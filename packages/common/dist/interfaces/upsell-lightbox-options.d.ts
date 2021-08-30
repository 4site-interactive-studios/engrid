export interface UpsellLightboxOptions {
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
    canClose: boolean;
    submitOnClose: boolean;
}
export declare const UpsellLightboxOptionsDefaults: UpsellLightboxOptions;
