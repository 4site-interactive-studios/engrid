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
export interface FrequencyUpsellABTestConfig {
    abTest: true;
    options: FrequencyUpsellOptions[];
    cookieName?: string;
    cookieDurationDays?: number;
}
export type FrequencyUpsellConfig = FrequencyUpsellOptions | FrequencyUpsellABTestConfig;
export declare const FrequencyUpsellOptionsDefaults: FrequencyUpsellOptions;
