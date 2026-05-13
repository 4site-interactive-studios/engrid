/**
 * Iframe Queue — load embedded EN pages sequentially.
 *
 * **This component is opt-in.** Like `OptInLadder`, it is exported from
 * `@4site/engrid-scripts` but is **not** auto-constructed by ENgrid's
 * core bootstrap (`app.ts`). To use it, instantiate it once in your
 * theme's bootstrap:
 *
 * ```ts
 * import { IframeQueue } from "@4site/engrid-scripts";
 * new IframeQueue();
 * ```
 *
 * On client themes that don't use this component, **nothing in this
 * file runs**: no `message` listener is registered, no singleton is
 * allocated, no bundle code beyond the unused class definition.
 *
 * **Why this exists.** Engaging Networks' platform handles concurrent
 * iframe submissions inconsistently — when several embedded EN forms
 * are submitted in parallel (e.g. QCB opt-ins for postal mail, mobile
 * phone, and double opt-in email), roughly 40% of records are lost.
 * Loading the iframes sequentially (without `?chain`) resolves the
 * issue. This component generalises that pattern.
 *
 * **What it does.** In _parent_ mode (top-level page) it holds an
 * ordered queue of {@link IframeQueueItem} configs and processes them
 * one at a time: create iframe → wait for `load` → post a populate
 * message with field values → wait for the embedded page to reach a
 * Thank You page → advance. In _embedded_ mode (running inside an
 * iframe owned by an IframeQueue parent) it listens for the populate
 * message, fills the form fields via {@link ENGrid.setFieldValue}, and
 * submits via {@link EnForm.submitForm} when `autoSubmit` is true.
 *
 * **Why not `?chain`?** Engaging Networks' `?chain` URL parameter is
 * unreliable for sequential iframe submission; the agreed solution is
 * to pass field data via `postMessage` instead. The queue defensively
 * strips any `chain` query parameter from queued URLs.
 *
 * **Page ID matching.** The Thank-You-page ping (sent by the iFrame
 * component, see iframe.ts) carries the Page ID of the submitting
 * form. The queue compares it against the Page ID parsed from the
 * queued URL so that pings from unrelated EN iframes on the same
 * parent page (such as an Embedded Ecard iframe) are ignored.
 *
 * **Events.** Lifecycle events are dispatched via the
 * {@link IframeQueueEvents} singleton. External code subscribes there
 * rather than holding a reference to the queue itself.
 *
 * @example Programmatic API
 *   const queue = IframeQueue.getInstance();
 *   queue.enqueue({
 *     url: "https://example.org/page/123/data/1",
 *     fields: { "supporter.emailAddress": "donor@example.org" },
 *     autoSubmit: true,
 *   });
 *   queue.process().then(() => console.log("done"));
 *
 * @example Declarative API (set on the EN page before the bundle loads)
 *   window.EngridIframeQueue = {
 *     items: [
 *       { url: "https://example.org/page/123/data/1",
 *         fields: { "supporter.emailAddress": "donor@example.org" } },
 *     ],
 *     autoStart: true,
 *   };
 */

import { ENGrid, EngridLogger } from ".";
import { EnForm, IframeQueueEvents } from "./events";
import {
  IframeQueueItem,
  IframeQueueOptions,
  IframeQueueOptionsDefaults,
} from "./interfaces/iframe-queue-options";

/**
 * Local mirror of the `window.EngridLoader` shape declared in
 * `interfaces/global.d.ts`. Defined here as a regular type (rather
 * than imported) because the global declaration augments `Window`
 * but isn't exported as a value/type.
 */
type EngridLoaderConfig = {
  "repo-name"?: string;
  "repo-owner"?: string;
  assets?: string;
  engridcss?: string;
  engridjs?: string;
};

/** Wire-format type for the populate message sent parent → iframe. */
const MSG_POPULATE = "engrid-iframe-queue:populate";
/** Wire-format type for the Thank-You-page ping sent iframe → parent. */
const MSG_THANK_YOU = "engrid-iframe-queue:thank-you";
/** Wire-format type for an error message sent iframe → parent. */
const MSG_ERROR = "engrid-iframe-queue:error";

/** Default per-item timeout in milliseconds. */
const DEFAULT_TIMEOUT_MS = 30000;

/**
 * Parameters that are automatically inherited from the parent page
 * onto each queued iframe URL. These are all ENgrid loader / dev-mode
 * flags — adding them to the parent is meant to affect "the ENgrid
 * bundle running on this browser tab," which conceptually includes
 * the embedded forms loaded by the queue.
 *
 * For each key, the value is resolved with the same precedence used by
 * `loader.ts#getOption`:
 *   1. The item's own URL — if the consumer hard-coded the param on
 *      the iframe URL, that wins.
 *   2. The parent page's URL parameter (`?assets=local`).
 *   3. `window.EngridLoader[key]` on the parent page — useful when EN
 *      strips URL params on the Thank You page, so themes set
 *      `<script>window.EngridLoader = { assets: 'local' };</script>`
 *      to pin the bundle source.
 *
 * Notable use case: any of the three works for forcing local-asset
 * loading on every queued QCB iframe during testing.
 */
const PROPAGATED_PARENT_PARAMS: readonly string[] = [
  "assets",
  "engridjs",
  "engridcss",
  "repo-name",
  "repo-owner",
  "debug",
  "mode",
];

/** Default visually-hidden style for queue iframes. */
const DEFAULT_HIDDEN_STYLE: Partial<CSSStyleDeclaration> = {
  position: "absolute",
  width: "1px",
  height: "1px",
  left: "-9999px",
  top: "0",
  opacity: "0",
  border: "0",
};

export class IframeQueue {
  private static instance: IframeQueue;

  private logger: EngridLogger = new EngridLogger(
    "IframeQueue",
    "white",
    "#1f6feb",
    "🚂"
  );

  private events: IframeQueueEvents = IframeQueueEvents.getInstance();
  private _form: EnForm = EnForm.getInstance();

  private queue: IframeQueueItem[] = [];
  private _isProcessing: boolean = false;
  private _aborted: boolean = false;
  private inFlightPromise: Promise<void> | null = null;

  /**
   * Returns the shared IframeQueue singleton. The bootstrap in app.ts
   * instantiates this once via `new IframeQueue()`, but consumers that
   * need to enqueue items programmatically should always go through
   * `getInstance()` so they share the same queue state.
   */
  public static getInstance(): IframeQueue {
    if (!IframeQueue.instance) {
      IframeQueue.instance = new IframeQueue();
    }
    return IframeQueue.instance;
  }

  constructor() {
    // Singleton guard: if called via `new IframeQueue()` after an
    // instance already exists (e.g. by app.ts), return the existing
    // instance so behaviour stays consistent with `getInstance()`.
    if (IframeQueue.instance) {
      return IframeQueue.instance;
    }
    IframeQueue.instance = this;

    if (this.inIframe()) {
      this.setupEmbeddedMode();
    } else {
      this.setupParentMode();
    }
  }

  // ---------------------------------------------------------------------------
  // Public API (parent mode)
  // ---------------------------------------------------------------------------

  /** Whether the queue is currently processing. */
  public get isProcessing(): boolean {
    return this._isProcessing;
  }

  /** Number of items currently in the queue (not counting the in-flight item). */
  public get size(): number {
    return this.queue.length;
  }

  /**
   * Add an item to the back of the queue. Items are processed in
   * insertion order. Calling `enqueue` while the queue is processing is
   * supported — the new item joins the chain and will be picked up
   * after the current item completes.
   */
  public enqueue(item: IframeQueueItem): void {
    if (!item || typeof item.url !== "string" || !item.url) {
      this.logger.danger("enqueue() called with invalid item; ignoring");
      return;
    }
    this.queue.push(item);
    this.logger.log(`enqueue: ${item.url} (queue size = ${this.queue.length})`);
  }

  /**
   * Add many items at once, preserving order. Equivalent to calling
   * {@link enqueue} repeatedly.
   */
  public enqueueAll(items: IframeQueueItem[]): void {
    if (!Array.isArray(items)) return;
    for (const item of items) this.enqueue(item);
  }

  /**
   * Begin processing the queue. Resolves when the queue drains
   * successfully and rejects on the first error. If already processing,
   * returns the in-flight promise so callers don't start a second drain.
   */
  public process(): Promise<void> {
    if (this._isProcessing && this.inFlightPromise) {
      this.logger.log("process: already processing; returning in-flight promise");
      return this.inFlightPromise;
    }
    if (this.queue.length === 0) {
      this.logger.log("process: queue empty; nothing to do");
      return Promise.resolve();
    }
    this._aborted = false;
    this._isProcessing = true;
    this.inFlightPromise = this.drain()
      .then(() => {
        this.events.dispatchChainComplete();
      })
      .finally(() => {
        this._isProcessing = false;
        this.inFlightPromise = null;
      });
    return this.inFlightPromise;
  }

  /**
   * Empty the queue without processing. Stops the in-flight item if
   * any (the in-flight item rejects with an abort error which is
   * surfaced via `onChainError`).
   */
  public clear(): void {
    this.logger.log(`clear: dropping ${this.queue.length} queued item(s)`);
    this.queue = [];
    this._aborted = true;
  }

  // ---------------------------------------------------------------------------
  // Parent-mode internals
  // ---------------------------------------------------------------------------

  /**
   * In parent mode the constructor checks `window.EngridIframeQueue`
   * for declarative startup config, enqueues those items, and (if
   * `autoStart` is true) calls `process()` after DOMContentLoaded.
   */
  private setupParentMode(): void {
    this.logger.log("setupParentMode");
    const config = this.readWindowConfig();
    if (!config) return;
    if (Array.isArray(config.items) && config.items.length > 0) {
      this.enqueueAll(config.items);
    }
    const shouldAutoStart =
      typeof config.autoStart === "boolean"
        ? config.autoStart
        : this.queue.length > 0;
    if (!shouldAutoStart || this.queue.length === 0) return;
    const start = () => {
      this.process().catch((err) => {
        this.logger.danger(`Auto-started queue rejected: ${err}`);
      });
    };
    if (document.readyState !== "loading") {
      start();
    } else {
      document.addEventListener("DOMContentLoaded", start);
    }
  }

  /**
   * Reads `window.EngridIframeQueue` and returns merged options, or
   * null if no valid config is present.
   */
  private readWindowConfig(): IframeQueueOptions | null {
    const raw = (window as unknown as { EngridIframeQueue?: IframeQueueOptions })
      .EngridIframeQueue;
    if (!raw || typeof raw !== "object") return null;
    return { ...IframeQueueOptionsDefaults, ...raw };
  }

  /** Process queued items strictly one at a time. */
  private async drain(): Promise<void> {
    while (this.queue.length > 0) {
      if (this._aborted) {
        this.logger.log("drain: aborted; stopping");
        return;
      }
      const item = this.queue.shift() as IframeQueueItem;
      try {
        await this.processItem(item);
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        this.events.dispatchItemError(item, error);
        try {
          item.onError?.(error);
        } catch (cbErr) {
          this.logger.danger(`onError callback threw: ${cbErr}`);
        }
        this.events.dispatchChainError({
          message: error.message,
          failedItem: item,
          cause: error,
        });
        // Abort the rest of the chain.
        this.queue = [];
        throw error;
      }
    }
  }

  /**
   * Process a single item: create the iframe, post populate, wait for
   * the matching Thank-You ping (or error/timeout). Resolves on success
   * and rejects on error/timeout.
   */
  private processItem(item: IframeQueueItem): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const url = this.prepareIframeUrl(item.url);
      const expectedPageId = ENGrid.getPageIdFromUrl(url);
      if (!expectedPageId) {
        reject(
          new Error(
            `IframeQueue: could not parse Page ID from URL "${item.url}".`
          )
        );
        return;
      }

      this.events.dispatchItemStart(item);

      const container = item.container ?? document.body;
      const iframe = this.createIframe(url, item.iframeStyle);
      const timeoutMs = item.timeout ?? DEFAULT_TIMEOUT_MS;

      let settled = false;
      let timeoutId: number | null = null;

      const detachListeners = () => {
        if (timeoutId !== null) {
          window.clearTimeout(timeoutId);
          timeoutId = null;
        }
        window.removeEventListener("message", onMessage);
        iframe.removeEventListener("load", onIframeLoad);
        iframe.removeEventListener("error", onIframeError);
      };

      const removeIframe = () => {
        if (iframe.parentNode) {
          iframe.parentNode.removeChild(iframe);
        }
      };

      const succeed = () => {
        if (settled) return;
        settled = true;
        detachListeners();
        removeIframe();
        this.events.dispatchItemComplete(item);
        try {
          item.onComplete?.();
        } catch (cbErr) {
          this.logger.danger(`onComplete callback threw: ${cbErr}`);
        }
        resolve();
      };

      const fail = (error: Error) => {
        if (settled) return;
        settled = true;
        detachListeners();
        if (this.shouldKeepIframeOnError(item)) {
          this.markIframeFailed(iframe, error);
          this.logger.danger(
            `Item failed — iframe kept in DOM for inspection: ${error.message}`
          );
        } else {
          removeIframe();
        }
        reject(error);
      };

      const onMessage = (event: MessageEvent) => {
        // Only accept messages from this specific iframe — origin
        // string matching is unreliable because EN may serve embedded
        // pages from different subdomains. `event.source` identity is
        // what matters here.
        if (event.source !== iframe.contentWindow) return;
        const data = event.data as
          | { type?: string; pageId?: number; message?: string }
          | undefined;
        if (!data || typeof data !== "object" || !data.type) return;

        if (data.type === MSG_THANK_YOU) {
          if (data.pageId !== expectedPageId) {
            this.logger.log(
              `Ignoring thank-you ping with mismatched pageId ` +
                `(expected ${expectedPageId}, got ${data.pageId})`
            );
            return;
          }
          this.logger.log(
            `Item complete: ${url} (pageId ${expectedPageId})`
          );
          succeed();
        } else if (data.type === MSG_ERROR) {
          if (data.pageId !== expectedPageId) return;
          fail(
            new Error(
              `IframeQueue: embedded page reported error: ${
                data.message ?? "unknown error"
              }`
            )
          );
        }
      };

      const onIframeLoad = () => {
        if (settled) return;
        const populate = {
          type: MSG_POPULATE,
          pageId: expectedPageId,
          fields: item.fields ?? {},
          autoSubmit: item.autoSubmit !== false, // default true
        };
        this.logger.log(
          `Posting populate to iframe (pageId=${expectedPageId}, ` +
            `fieldCount=${Object.keys(populate.fields).length}, ` +
            `autoSubmit=${populate.autoSubmit})`
        );
        // Use "*" for the same reason origin matching is skipped on
        // inbound messages — EN may serve embedded pages from a
        // different subdomain than the host page.
        iframe.contentWindow?.postMessage(populate, "*");
      };

      const onIframeError = () => {
        fail(new Error(`IframeQueue: iframe failed to load: ${url}`));
      };

      window.addEventListener("message", onMessage);
      iframe.addEventListener("load", onIframeLoad);
      iframe.addEventListener("error", onIframeError);

      timeoutId = window.setTimeout(() => {
        fail(
          new Error(
            `IframeQueue: timed out after ${timeoutMs}ms waiting for ` +
              `Thank-You-page ping from ${url}`
          )
        );
      }, timeoutMs);

      this.logger.log(
        `Item start: ${url} (pageId ${expectedPageId}, timeout ${timeoutMs}ms)`
      );
      container.appendChild(iframe);
    });
  }

  /**
   * Normalise the URL for a queued iframe:
   *  1. Strip any `chain` query parameter defensively — the queue
   *     replaces `?chain` with sequential processing.
   *  2. Inherit a small allowlist of loader / dev-mode params (see
   *     {@link PROPAGATED_PARENT_PARAMS}) when they're not already set
   *     on the item URL. Each key is resolved with the same precedence
   *     `loader.ts#getOption` uses: parent URL param first, then
   *     `window.EngridLoader[key]`.
   *
   * Item-specified params always take precedence over inherited ones.
   * Returns the original string unchanged if URL parsing fails.
   */
  private prepareIframeUrl(rawUrl: string): string {
    let url: URL;
    try {
      url = new URL(rawUrl, window.location.href);
    } catch {
      return rawUrl;
    }
    url.searchParams.delete("chain");
    const parentUrlParams = this.getParentSearchParams();
    const parentLoader = this.getParentEngridLoader();
    const inherited: string[] = [];
    for (const key of PROPAGATED_PARENT_PARAMS) {
      if (url.searchParams.has(key)) continue;
      let value: string | null = null;
      let source = "";
      if (parentUrlParams) {
        const v = parentUrlParams.get(key);
        if (v !== null) {
          value = v;
          source = "url";
        }
      }
      if (value === null && parentLoader) {
        const v = parentLoader[key as keyof EngridLoaderConfig];
        if (typeof v === "string" && v !== "") {
          value = v;
          source = "EngridLoader";
        }
      }
      if (value !== null) {
        url.searchParams.set(key, value);
        inherited.push(`${key}=${value} (from parent ${source})`);
      }
    }
    if (inherited.length > 0) {
      this.logger.log(
        `Inherited parent params on iframe URL: ${inherited.join(", ")}`
      );
    }
    return url.href;
  }

  /** Returns the parent page's URLSearchParams, or null on failure. */
  private getParentSearchParams(): URLSearchParams | null {
    try {
      return new URL(window.location.href).searchParams;
    } catch {
      return null;
    }
  }

  /**
   * Returns the parent page's `window.EngridLoader` object if set, or
   * null. Used by {@link prepareIframeUrl} as a fallback source for
   * loader/dev-mode param values when EN has stripped URL parameters
   * from the Thank You page.
   */
  private getParentEngridLoader(): EngridLoaderConfig | null {
    const w = window as unknown as { EngridLoader?: EngridLoaderConfig };
    if (!w.EngridLoader || typeof w.EngridLoader !== "object") return null;
    return w.EngridLoader;
  }

  /**
   * Decide whether to leave a failed iframe in the DOM (for
   * inspection) instead of removing it. True when the item explicitly
   * asks for it via `keepIframeOnError`, OR whenever ENgrid debug
   * mode is on (since debugging is when this is useful and we don't
   * want to make consumers opt in just to inspect failures).
   */
  private shouldKeepIframeOnError(item: IframeQueueItem): boolean {
    if (item.keepIframeOnError) return true;
    try {
      return ENGrid.debug === true;
    } catch {
      return false;
    }
  }

  /**
   * Reposition and style a failed iframe so it's visible in the
   * viewport (overriding the visually-hidden default), and tag it
   * with a class + tooltip so the developer knows why it's there.
   * Right-click the iframe → Inspect frame to dive in.
   */
  private markIframeFailed(iframe: HTMLIFrameElement, error: Error): void {
    Object.assign(iframe.style, {
      position: "fixed",
      top: "10px",
      right: "10px",
      bottom: "auto",
      left: "auto",
      width: "min(600px, 90vw)",
      height: "min(500px, 80vh)",
      opacity: "1",
      zIndex: "99999",
      border: "3px solid #d33",
      background: "white",
      boxShadow: "0 4px 24px rgba(0, 0, 0, 0.25)",
    } as Partial<CSSStyleDeclaration>);
    iframe.classList.add("engrid-iframe--queue-failed");
    iframe.title = `Iframe Queue: failed item — ${error.message}`;
  }

  /** Create a hidden iframe element for a queue item. */
  private createIframe(
    url: string,
    styleOverride?: Partial<CSSStyleDeclaration>
  ): HTMLIFrameElement {
    const iframe = document.createElement("iframe");
    iframe.setAttribute("src", url);
    iframe.setAttribute("frameborder", "0");
    iframe.setAttribute("scrolling", "no");
    iframe.setAttribute("aria-hidden", "true");
    iframe.setAttribute("title", "ENgrid Iframe Queue");
    iframe.classList.add("engrid-iframe", "engrid-iframe--queue");
    const style: Partial<CSSStyleDeclaration> = {
      ...DEFAULT_HIDDEN_STYLE,
      ...(styleOverride ?? {}),
    };
    Object.assign(iframe.style, style);
    return iframe;
  }

  // ---------------------------------------------------------------------------
  // Embedded-mode internals
  // ---------------------------------------------------------------------------

  /**
   * In embedded mode we register a `message` listener that accepts
   * populate messages from `window.parent`, fills form fields, and
   * (optionally) submits. The Thank-You-page ping is sent by the iFrame
   * component (iframe.ts) — not here — so this method does not need to
   * concern itself with completion signalling.
   */
  private setupEmbeddedMode(): void {
    this.logger.log("setupEmbeddedMode");
    window.addEventListener("message", (event: MessageEvent) => {
      if (event.source !== window.parent) return;
      const data = event.data as
        | {
            type?: string;
            pageId?: number;
            fields?: Record<string, string>;
            autoSubmit?: boolean;
          }
        | undefined;
      if (!data || typeof data !== "object" || data.type !== MSG_POPULATE) {
        return;
      }
      this.handlePopulate(data);
    });
  }

  /** Handle a populate message sent by an IframeQueue parent. */
  private handlePopulate(data: {
    pageId?: number;
    fields?: Record<string, string>;
    autoSubmit?: boolean;
  }): void {
    const fields = data.fields ?? {};
    const autoSubmit = data.autoSubmit !== false;
    this.logger.log(
      `Received populate (pageId=${data.pageId}, ` +
        `fieldCount=${Object.keys(fields).length}, autoSubmit=${autoSubmit})`
    );
    try {
      for (const [name, value] of Object.entries(fields)) {
        // Pass `dispatchEvents = true` so each field fires
        // `change` + `blur` after the value is set. Without that,
        // EN's form-validation state machine doesn't see the new
        // values and leaves `en__submit--disabled` on the submit
        // button, causing the auto-click below to no-op.
        ENGrid.setFieldValue(name, value, true, true);
      }
      if (autoSubmit) {
        // Defer slightly so any synchronous EN dependency parsing in
        // setFieldValue settles before the form is submitted.
        window.setTimeout(() => {
          // Belt-and-braces: clear EN's "submit disabled" state in
          // case its validators didn't re-evaluate (e.g. async
          // validators that hadn't completed when the events fired).
          this.forceEnableSubmitButton();
          this._form.submitForm();
        }, 0);
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      this.logger.danger(`handlePopulate failed: ${error.message}`);
      window.parent.postMessage(
        {
          type: MSG_ERROR,
          pageId: data.pageId ?? ENGrid.getPageID(),
          message: error.message,
        },
        "*"
      );
    }
  }

  /**
   * Strip every "disabled" marker from the EN submit button so the
   * programmatic `submitForm()` click is honoured. Removes:
   *   - the `disabled` DOM property/attribute on the button,
   *   - the `en__submit--disabled` BEM modifier (EN's own class),
   *   - the `en__submit--disabled` modifier on the `.en__submit`
   *     wrapper (some templates style the wrapper instead),
   *   - ENgrid's own loader markup if a previous `disableSubmit()`
   *     call left it in place.
   *
   * Used only by embedded-mode populate flow when `autoSubmit` is on.
   */
  private forceEnableSubmitButton(): void {
    const button = document.querySelector(
      "form .en__submit button"
    ) as HTMLButtonElement | null;
    if (button) {
      if (button.disabled) button.disabled = false;
      button.removeAttribute("disabled");
      button.classList.remove("en__submit--disabled");
    }
    const wrapper = document.querySelector(".en__submit") as HTMLElement | null;
    if (wrapper) {
      wrapper.classList.remove("en__submit--disabled");
    }
  }

  // ---------------------------------------------------------------------------
  // Helpers
  // ---------------------------------------------------------------------------

  /** True when this script is executing inside an iframe. */
  private inIframe(): boolean {
    try {
      return window.self !== window.top;
    } catch {
      return true;
    }
  }
}
