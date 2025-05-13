export interface FrequencyUpsellOptions {
  content: string;
  yesButton: string;
  noButton: string;
  upsellFrequency: "monthly" | "quarterly" | "semi_annual" | "annual";
  upsellAmount: (currentAmount: number) => number;
  upsellFromFrequency: Array<
    "onetime" | "monthly" | "quarterly" | "semi_annual" | "annual"
  >;
  onAccept: () => void;
  onDecline: () => void;
}

export const FrequencyUpsellOptionsDefaults: FrequencyUpsellOptions = {
  content:
    "Before we process your donation, would you like to make it an annual gift?",
  yesButton: "YES! Process my gift as an annual gift of ${current_amount}",
  noButton: "NO! Process my gift as a one-time gift of ${upsell_amount}",
  upsellFrequency: "annual",
  upsellFromFrequency: ["onetime"],
  upsellAmount: (currentAmount) => currentAmount,
  onAccept: () => {},
  onDecline: () => {},
};
