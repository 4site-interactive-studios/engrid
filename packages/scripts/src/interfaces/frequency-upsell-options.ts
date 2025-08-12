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
  customClass: string;
  onOpen: () => void;
  onAccept: () => void;
  onDecline: () => void;
}

export const FrequencyUpsellOptionsDefaults: FrequencyUpsellOptions = {
  title: "Before we process your donation...",
  paragraph: "Would you like to make it an annual gift?",
  yesButton: "YES! Process my gift as an annual gift of ${upsell_amount}",
  noButton: "NO! Process my gift as a one-time gift of ${current_amount}",
  upsellFrequency: "annual",
  upsellFromFrequency: ["onetime"],
  customClass: "",
  upsellAmount: (currentAmount) => currentAmount,
  onOpen: () => {},
  onAccept: () => {},
  onDecline: () => {},
};
