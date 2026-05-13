/**
 * Configuration interfaces for the Iframe Queue component.
 *
 * The Iframe Queue loads a sequence of embedded Engaging Networks pages
 * one at a time, passes field values into them via `postMessage`, and
 * exposes a global `IframeQueueEvents` instance so external code can
 * subscribe to chain-completion. See iframe-queue.ts for the component.
 *
 * Configuration may be supplied either programmatically (via
 * `IframeQueue.getInstance().enqueue(...).process()`) or declaratively
 * by setting `window.EngridIframeQueue` on the host EN page before
 * the ENgrid bundle loads.
 */
/**
 * A single embedded EN page to load and submit as part of the queue.
 *
 * The queue creates an iframe for each item, posts an
 * `engrid-iframe-queue:populate` message to the iframe with the
 * item's `fields`, and waits for an `engrid-iframe-queue:thank-you`
 * ping (sent by the iFrame component on the embedded Thank You page)
 * before advancing to the next item.
 */
export interface IframeQueueItem {
    /**
     * Full URL of the EN page to load. The queue strips any `chain` query
     * parameter defensively; do not rely on `?chain` for data passing.
     */
    url: string;
    /**
     * Field name → value pairs to populate in the embedded form via
     * postMessage. Field names match the `name` attribute of the EN form
     * input (e.g. `supporter.emailAddress`).
     */
    fields?: Record<string, string>;
    /**
     * If true, the embedded iframe submits the form once fields are
     * populated. Default: true.
     */
    autoSubmit?: boolean;
    /**
     * Maximum time (ms) to wait for the Thank-You-page ping before
     * treating the item as failed and aborting the queue. Default: 30000.
     */
    timeout?: number;
    /**
     * Element to append the iframe to. Default: document.body.
     */
    container?: HTMLElement;
    /**
     * Override iframe styles. Default: visually hidden
     * (position:absolute; width:1px; height:1px; left:-9999px; opacity:0;).
     */
    iframeStyle?: Partial<CSSStyleDeclaration>;
    /**
     * Optional per-item callback fired when the item completes
     * successfully. Useful for ad-hoc consumers that don't want to
     * subscribe to the global IframeQueueEvents singleton.
     */
    onComplete?: () => void;
    /**
     * Optional per-item callback fired when the item fails (timeout,
     * iframe load error, or message error from the embedded page).
     */
    onError?: (error: Error) => void;
}
/**
 * Payload dispatched by `IframeQueueEvents.onChainError` when the queue
 * aborts due to an error. `failedItem` may be undefined if the error
 * occurred before any item started processing.
 */
export interface IframeQueueErrorPayload {
    message: string;
    failedItem?: IframeQueueItem;
    cause?: Error;
}
/**
 * Declarative configuration set on `window.EngridIframeQueue` to
 * preload items and optionally auto-start the queue at page load.
 */
export interface IframeQueueOptions {
    /** Items to enqueue at startup. */
    items?: IframeQueueItem[];
    /**
     * Whether to call `process()` automatically once items are enqueued
     * at startup. Default: true if `items` is non-empty, else false.
     */
    autoStart?: boolean;
}
export declare const IframeQueueOptionsDefaults: IframeQueueOptions;
