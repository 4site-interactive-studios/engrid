export declare class EcardPreview {
    private logger;
    private previewCapable;
    private handshakeAttempts;
    private handshakeTimer;
    private delegatedModal;
    private requestingIframe;
    constructor();
    private isEmbeddedEcardPage;
    private setupEmbeddedEcardPage;
    private sendHandshake;
    private setupParentPage;
    private showDelegatedPreview;
    private closeDelegatedPreview;
    private getIframeBySource;
    private inIframe;
}
