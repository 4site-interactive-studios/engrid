/**
 * Iframe Queue — load embedded EN pages sequentially.
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

/** Wire-format type for the populate message sent parent → iframe. */
const MSG_POPULATE = "engrid-iframe-queue:populate";
/** Wire-format type for the Thank-You-page ping sent iframe → parent. */
const MSG_THANK_YOU = "engrid-iframe-queue:thank-you";
/** Wire-format type for an error message sent iframe → parent. */
const MSG_ERROR = "engrid-iframe-queue:error";

/** Default per-item timeout in milliseconds. */
const DEFAULT_TIMEOUT_MS = 30000;

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
      const url = this.stripChainParam(item.url);
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

      const cleanup = () => {
        if (timeoutId !== null) {
          window.clearTimeout(timeoutId);
          timeoutId = null;
        }
        window.removeEventListener("message", onMessage);
        iframe.removeEventListener("load", onIframeLoad);
        iframe.removeEventListener("error", onIframeError);
        if (iframe.parentNode) {
          iframe.parentNode.removeChild(iframe);
        }
      };

      const succeed = () => {
        if (settled) return;
        settled = true;
        cleanup();
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
        cleanup();
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

  /** Defensive: remove any `chain` query parameter from the URL. */
  private stripChainParam(rawUrl: string): string {
    try {
      const url = new URL(rawUrl, window.location.href);
      if (url.searchParams.has("chain")) {
        url.searchParams.delete("chain");
      }
      return url.href;
    } catch {
      return rawUrl;
    }
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
        ENGrid.setFieldValue(name, value);
      }
      if (autoSubmit) {
        // Defer slightly so any synchronous EN dependency parsing in
        // setFieldValue settles before the form is submitted.
        window.setTimeout(() => {
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
