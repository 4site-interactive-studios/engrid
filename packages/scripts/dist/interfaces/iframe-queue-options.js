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
export const IframeQueueOptionsDefaults = {
    items: [],
    autoStart: true,
};
