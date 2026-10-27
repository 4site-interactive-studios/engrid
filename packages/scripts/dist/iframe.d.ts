import { EnForm } from "./events";
export declare class iFrame {
    _form: EnForm;
    private resizeObserver;
    private logger;
    constructor();
    private onLoaded;
    /**
     * Observes document.body for size changes (DOM mutations, font/image
     * loads, CSS transitions) and re-sends the iframe height to the parent.
     *
     * Uses a leading + trailing throttle via debounceWithImmediate: the
     * first change is sent immediately, and the settled height is always
     * re-sent once changes stop for 120ms. Animated transitions therefore
     * don't flood the parent page with one message per frame, but the
     * parent always ends up matching the final resolved height.
     */
    private observeHeightChanges;
    /**
     * Posts a `engrid-iframe-queue:thank-you` message to the parent window
     * when the embedded EN page reaches its Thank You page (the last page
     * in the page sequence). Carries the Page ID of the submitting form so
     * the IframeQueue parent can match the ping against the queued item it
     * is waiting on, ignoring pings from unrelated EN iframes that may exist
     * on the same parent page (e.g. an Embedded Ecard iframe).
     *
     * Only fires when:
     *   - the script is running inside an iframe (already guaranteed by the
     *     code path that calls onLoaded()), AND
     *   - the embedded page is a Thank You page (ENGrid.isThankYouPage()).
     *
     * Consumed by: IframeQueue (engrid/packages/scripts/src/iframe-queue.ts).
     */
    private sendIframeQueueThankYouPing;
    private sendIframeHeight;
    private sendIframeFormStatus;
    private getIFrameByEvent;
    private shouldScroll;
    private inIframe;
    private isChained;
    private hideFormComponents;
    private showFormComponents;
    private debounceWithImmediate;
}
