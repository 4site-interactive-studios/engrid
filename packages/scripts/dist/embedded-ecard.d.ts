export declare class EmbeddedEcard {
    private logger;
    private readonly options;
    private _form;
    isSubmitting: boolean;
    ecardFormActive: boolean;
    iframe: HTMLIFrameElement | null;
    constructor();
    private onHostPage;
    private onEmbeddedEcardPage;
    private onPostActionPage;
    private embedEcard;
    private createIframe;
    private addEventListeners;
    private validateRecipients;
    private toggleEcardForm;
    private setEmbeddedEcardSessionData;
    private getEcardRecipients;
    private setupEmbeddedPage;
    private submitEcard;
    private sendPostMessage;
}
