export interface Options {
  backgroundImage?: string | string[];
  MediaAttribution?: boolean;
  applePay?: boolean;
  CapitalizeFields?: boolean;
  ClickToExpand?: boolean;
  CurrencySymbol?: string;
  AddCurrencySymbol?: boolean;
  CurrencySeparator?: string; // Deprecated
  ThousandsSeparator?: string;
  DecimalSeparator?: string;
  DecimalPlaces?: number;
  MinAmount?: number;
  MaxAmount?: number;
  MinAmountMessage?: string;
  MaxAmountMessage?: string;
  SkipToMainContentLink?: boolean;
  SrcDefer?: boolean;
  NeverBounceAPI?: string | null;
  NeverBounceDateField?: string | null;
  NeverBounceDateFormat?: string;
  NeverBounceStatusField?: string | null;
  ProgressBar?: boolean | null;
  AutoYear?: boolean;
  TranslateFields?: boolean;
  Debug?: boolean;
  RememberMe?:
    | boolean
    | {
        remoteUrl?: string;
        cookieName?: string;
        cookieExpirationDays?: number;
        fieldNames?: string[];
        fieldDonationAmountRadioName?: string;
        fieldDonationAmountOtherName?: string;
        fieldDonationRecurrPayRadioName?: string;
        fieldDonationAmountOtherCheckboxID?: string;
        fieldOptInSelectorTarget?: string;
        fieldOptInSelectorTargetLocation?: string;
        fieldClearSelectorTarget?: string;
        fieldClearSelectorTargetLocation?: string;
        checked?: boolean;
      };
  onLoad?: () => void;
  onResize?: () => void;
  onSubmit?: () => void;
  onError?: () => void;
  onValidate?: () => void;
}

export const OptionsDefaults: Options = {
  backgroundImage: "",
  MediaAttribution: true,
  applePay: false,
  CapitalizeFields: false,
  ClickToExpand: true,
  CurrencySymbol: "$",
  AddCurrencySymbol: true,
  ThousandsSeparator: "",
  DecimalSeparator: ".",
  DecimalPlaces: 2,
  MinAmount: 1,
  MaxAmount: 100000,
  MinAmountMessage: "Amount must be at least $1",
  MaxAmountMessage: "Amount must be less than $100,000",
  SkipToMainContentLink: true,
  SrcDefer: true,
  NeverBounceAPI: null,
  NeverBounceDateField: null,
  NeverBounceStatusField: null,
  NeverBounceDateFormat: "MM/DD/YYYY",
  ProgressBar: false,
  AutoYear: false,
  TranslateFields: true,
  Debug: false,
  RememberMe: false,
};
