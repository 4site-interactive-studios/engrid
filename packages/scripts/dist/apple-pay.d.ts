import { EnForm, DonationAmount, ProcessingFees } from ".";
export declare class ApplePay {
    private logger;
    applePay: HTMLInputElement;
    _amount: DonationAmount;
    _fees: ProcessingFees;
    _form: EnForm;
    beforeSession: (() => boolean) | null;
    private walletFields;
    private errorFields;
    private static instance;
    constructor();
    static getInstance(): ApplePay;
    private hasApplePayOption;
    private checkApplePay;
    private writeButtonContainer;
    private onSubmitFallback;
    onPayClicked(): void;
    private preflight;
    private scrollToError;
    private clearErrors;
    private missingMandatoryFields;
    private openSession;
    private onPaymentAuthorized;
    private setField;
    private setRegion;
    performValidation(url: string): Promise<unknown>;
}
