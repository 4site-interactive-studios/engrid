export declare class OptInLadder {
    private logger;
    private _form;
    private _dataLayer;
    constructor();
    private runAsParent;
    private runAsChildRegular;
    private runAsChildThankYou;
    private inIframe;
    private listenForParentInfo;
    private saveStepToSessionStorage;
    private saveOptInsToSessionStorage;
    private isEmbeddedThankYouPage;
    private getPageUrl;
    private getFirstPageUrl;
    private hidePage;
    private clearSessionStorage;
    private isFollowupStep;
}
