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
  amountRange: Array<{ max: number; suggestion: number | string }>;
  minAmount: number; // Never accept less than this amount
  canClose: boolean;
  submitOnClose: boolean;
  oneTime: boolean;
  annual: boolean;
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
    "Will you change your gift to just {new-amount} a month to boost your impact?",
  paragraph:
    "Make a monthly pledge today to support us with consistent, reliable resources during emergency moments.",
  yesLabel: "Yes! Process My <br> {new-amount} monthly gift",
  noLabel: "No, thanks. Continue with my <br> {old-amount} one-time gift",
  otherAmount: true, // Use false to hide the "other amount" field
  otherLabel: "Or enter a different monthly amount:",
  upsellOriginalGiftAmountFieldName: "",
  amountRange: [
    { max: 10, suggestion: 5 },
    { max: 15, suggestion: 7 },
    { max: 20, suggestion: 8 },
    { max: 25, suggestion: 9 },
    { max: 30, suggestion: 10 },
    { max: 35, suggestion: 11 },
    { max: 40, suggestion: 12 },
    { max: 50, suggestion: 14 },
    { max: 100, suggestion: 15 },
    { max: 200, suggestion: 19 },
    { max: 300, suggestion: 29 },
    { max: 500, suggestion: "Math.ceil((amount / 12)/5)*5" },
  ],
  minAmount: 0,
  canClose: true,
  submitOnClose: false,
  oneTime: true,
  annual: false,
  disablePaymentMethods: [],
  skipUpsell: false,
  conversionField: "",
  upsellCheckbox: false,
};
