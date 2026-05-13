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
import { IframeQueueItem } from "./interfaces/iframe-queue-options";
export declare class IframeQueue {
    private static instance;
    private logger;
    private events;
    private _form;
    private queue;
    private _isProcessing;
    private _aborted;
    private inFlightPromise;
    /**
     * Returns the shared IframeQueue singleton. The bootstrap in app.ts
     * instantiates this once via `new IframeQueue()`, but consumers that
     * need to enqueue items programmatically should always go through
     * `getInstance()` so they share the same queue state.
     */
    static getInstance(): IframeQueue;
    constructor();
    /** Whether the queue is currently processing. */
    get isProcessing(): boolean;
    /** Number of items currently in the queue (not counting the in-flight item). */
    get size(): number;
    /**
     * Add an item to the back of the queue. Items are processed in
     * insertion order. Calling `enqueue` while the queue is processing is
     * supported — the new item joins the chain and will be picked up
     * after the current item completes.
     */
    enqueue(item: IframeQueueItem): void;
    /**
     * Add many items at once, preserving order. Equivalent to calling
     * {@link enqueue} repeatedly.
     */
    enqueueAll(items: IframeQueueItem[]): void;
    /**
     * Begin processing the queue. Resolves when the queue drains
     * successfully and rejects on the first error. If already processing,
     * returns the in-flight promise so callers don't start a second drain.
     */
    process(): Promise<void>;
    /**
     * Empty the queue without processing. Stops the in-flight item if
     * any (the in-flight item rejects with an abort error which is
     * surfaced via `onChainError`).
     */
    clear(): void;
    /**
     * In parent mode the constructor checks `window.EngridIframeQueue`
     * for declarative startup config, enqueues those items, and (if
     * `autoStart` is true) calls `process()` after DOMContentLoaded.
     */
    private setupParentMode;
    /**
     * Reads `window.EngridIframeQueue` and returns merged options, or
     * null if no valid config is present.
     */
    private readWindowConfig;
    /** Process queued items strictly one at a time. */
    private drain;
    /**
     * Process a single item: create the iframe, post populate, wait for
     * the matching Thank-You ping (or error/timeout). Resolves on success
     * and rejects on error/timeout.
     */
    private processItem;
    /** Defensive: remove any `chain` query parameter from the URL. */
    private stripChainParam;
    /** Create a hidden iframe element for a queue item. */
    private createIframe;
    /**
     * In embedded mode we register a `message` listener that accepts
     * populate messages from `window.parent`, fills form fields, and
     * (optionally) submits. The Thank-You-page ping is sent by the iFrame
     * component (iframe.ts) — not here — so this method does not need to
     * concern itself with completion signalling.
     */
    private setupEmbeddedMode;
    /** Handle a populate message sent by an IframeQueue parent. */
    private handlePopulate;
    /** True when this script is executing inside an iframe. */
    private inIframe;
}
