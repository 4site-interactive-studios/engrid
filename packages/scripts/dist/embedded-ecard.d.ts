export declare class EmbeddedEcard {
    private logger;
    private readonly options;
    private _form;
    isSubmitting: boolean;
    constructor();
    private onHostPage;
    private onEmbeddedEcardPage;
    private onPostActionPage;
    private embedEcard;
    private createIframe;
    private addEventListeners;
    private setEmbeddedEcardSessionData;
    private getEcardRecipients;
    private setupEmbeddedPage;
    private submitEcard;
    private sendPostMessage;
}
