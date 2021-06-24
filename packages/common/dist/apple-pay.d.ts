import { DonationAmount, EnForm } from "./events";
export declare class ApplePay {
    applePay: HTMLInputElement;
    _amount: DonationAmount;
    _form: EnForm;
    constructor();
    private checkApplePay;
    performValidation(url: string): Promise<unknown>;
    private log;
    sendPaymentToken(token: any): Promise<unknown>;
    private onPayClicked;
}
