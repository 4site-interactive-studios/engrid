export interface FrequencyUpsellOptions {
    title: string;
    paragraph: string;
    yesButton: string;
    noButton: string;
    upsellFrequency: "monthly" | "quarterly" | "semi_annual" | "annual";
    upsellAmount: (currentAmount: number) => number;
    upsellFromFrequency: Array<"onetime" | "monthly" | "quarterly" | "semi_annual" | "annual">;
    customClass: string;
    onOpen: () => void;
    onAccept: () => void;
    onDecline: () => void;
}
export declare const FrequencyUpsellOptionsDefaults: FrequencyUpsellOptions;
