import { EnForm } from "./events";
export declare class iFrame {
    _form: EnForm;
    private logger;
    constructor();
    private onLoaded;
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
