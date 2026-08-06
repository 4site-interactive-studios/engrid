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
        frequency?: "onetime" | "monthly" | "quarterly" | "semi_annual" | "annual";
    }>;
    upsellToFrequency?: "onetime" | "monthly" | "quarterly" | "semi_annual" | "annual";
    minAmount: number;
    canClose: boolean;
    submitOnClose: boolean;
    oneTime: boolean;
    monthly: boolean;
    annual: boolean;
    disablePaymentMethods: Array<string>;
    skipUpsell: boolean;
    conversionField: string;
    upsellCheckbox: false | {
        label: string;
        location: string;
        cssClass: string;
    };
}
export declare const UpsellOptionsDefaults: UpsellOptions;
