export interface UpsellOptions {
  image: string;
  imagePosition: string; // left or right
  title: string;
  paragraph: string;
  yesLabel: string;
  noLabel: string;
  otherAmount: boolean; // Use false to hide the "other amount" field
  otherLabel: string;
  upsellOriginalGiftAmountFieldName: string;
  amountRange: Array<{
    max: number;
    suggestion: number | string;
    frequency?: "onetime" | "monthly" | "quarterly" | "semi_annual" | "annual";
  }>; // The max amount and the suggested upsell amount for that range. The suggestion can be a number or a string that will be evaluated as a function of the original amount. The frequency is optional and can be used to override the default frequency for that range.
  upsellToFrequency?:
    | "onetime"
    | "monthly"
    | "quarterly"
    | "semi_annual"
    | "annual"; // The frequency to upsell to, if not provided, the monthly frequency will be used
  minAmount: number; // Never accept less than this amount
  canClose: boolean;
  submitOnClose: boolean;
  oneTime: boolean; // Show the upsell for one-time gifts
  monthly: boolean; // Show the upsell for monthly gifts
  annual: boolean; // Show the upsell for annual gifts
  disablePaymentMethods: Array<string>;
  skipUpsell: boolean; // Use this to skip the upsell entirely, used to disable the upsell programatically
  conversionField: string; // The field name to store the upsell conversion data
  upsellCheckbox:
    | false
    | {
        label: string;
        location: string;
        cssClass: string;
      }; // Use this to show a checkbox to upsell
}

export const UpsellOptionsDefaults: UpsellOptions = {
  image: "https://picsum.photos/480/650",
  imagePosition: "left", // left or right
  title:
    "Will you change your gift to just {new-amount} {new-frequency} to boost your impact?",
  paragraph:
    "Make a {new-frequency} pledge today to support us with consistent, reliable resources during emergency moments.",
  yesLabel: "Yes! Process My <br> {new-amount} {new-frequency} gift",
  noLabel:
    "No, thanks. Continue with my <br> {old-amount} {old-frequency} gift",
  otherAmount: true, // Use false to hide the "other amount" field
  otherLabel: "Or enter a different {new-frequency} amount:",
  upsellOriginalGiftAmountFieldName: "",
  amountRange: [
    { max: 10, suggestion: 5, frequency: "monthly" },
    { max: 15, suggestion: 7, frequency: "monthly" },
    { max: 20, suggestion: 8, frequency: "monthly" },
    { max: 25, suggestion: 9, frequency: "monthly" },
    { max: 30, suggestion: 10, frequency: "monthly" },
    { max: 35, suggestion: 11, frequency: "monthly" },
    { max: 40, suggestion: 12, frequency: "monthly" },
    { max: 50, suggestion: 14, frequency: "monthly" },
    { max: 100, suggestion: 15, frequency: "monthly" },
    { max: 200, suggestion: 19, frequency: "monthly" },
    { max: 300, suggestion: 29, frequency: "monthly" },
    {
      max: 500,
      suggestion: "Math.ceil((amount / 12)/5)*5",
      frequency: "monthly",
    },
  ],
  upsellToFrequency: "monthly",
  minAmount: 0,
  canClose: true,
  submitOnClose: false,
  oneTime: true,
  monthly: false,
  annual: false,
  disablePaymentMethods: [],
  skipUpsell: false,
  conversionField: "",
  upsellCheckbox: false,
};
