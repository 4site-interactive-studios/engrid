export interface FrequencyUpsellOptions {
  title: string;
  paragraph: string;
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
  title: "Before we process your donation...",
  paragraph: "Would you like to make it an annual gift?",
  yesButton: "YES! Process my gift as an annual gift of ${current_amount}",
  noButton: "NO! Process my gift as a one-time gift of ${upsell_amount}",
  upsellFrequency: "annual",
  upsellFromFrequency: ["onetime"],
  upsellAmount: (currentAmount) => currentAmount,
  onAccept: () => {},
  onDecline: () => {},
};
