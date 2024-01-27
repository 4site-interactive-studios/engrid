export declare class CreditCard {
    private logger;
    private _form;
    private vgsField;
    private ccField;
    private ccValues;
    private isPotentiallyValid;
    private isValid;
    private field_expiration_month;
    private field_expiration_year;
    private paymentTypeField;
    constructor();
    private addEventListeners;
    private onlyNumbersCC;
    handleCCUpdate(): void;
    private handleExpUpdate;
    private formatCCNumber;
    private removeLiveCardTypeClasses;
    private addLiveCardTypeClasses;
    private clearPaymentTypeField;
    private isCardSupported;
    private getCardTypeFromPaymentTypeField;
    private isPaymentTypeCard;
    private validate;
}
