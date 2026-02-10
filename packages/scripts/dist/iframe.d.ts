import { EnForm } from "./events";
export declare class iFrame {
    _form: EnForm;
    private logger;
    private parentOrigin;
    constructor();
    private onLoaded;
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
