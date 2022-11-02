export interface UpsellOptions {
    image: string;
    imagePosition: string;
    title: string;
    paragraph: string;
    yesLabel: string;
    noLabel: string;
    otherAmount: boolean;
    otherLabel: string;
    upsellOriginalGiftAmountFieldName: string;
    amountRange: Array<{
        max: number;
        suggestion: number | string;
    }>;
    minAmount: number;
    canClose: boolean;
    submitOnClose: boolean;
    disablePaymentMethods: Array<string>;
}
export declare const UpsellOptionsDefaults: UpsellOptions;
