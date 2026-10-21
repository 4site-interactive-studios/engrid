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
    /**
     * Enhances EN's native preview modal on standalone (non-embedded) ecard
     * pages: when the modal opens, widen it to fit the preview content if the
     * viewport is wide enough.
     */
    private setupNativePreviewEnhancements;
    private sendHandshake;
    private setupParentPage;
    private showDelegatedPreview;
    /**
     * Centers the preview wrap like EN does (negative margins equal to half its
     * dimensions) and flags overflow when the viewport is smaller than the wrap.
     */
    private centerPreviewWrap;
    /**
     * Widens the preview modal to fit the ecard content when the preview iframe
     * scrolls horizontally and the viewport is wide enough to display it all.
     * The preview URL is same-origin, so the iframe content can be measured.
     */
    private fitPreviewToContent;
    private closeDelegatedPreview;
    private getIframeBySource;
    private inIframe;
}
