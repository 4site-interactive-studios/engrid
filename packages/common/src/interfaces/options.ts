export interface Options {
  backgroundImage?: string | string[];
  MediaAttribution?: boolean;
  applePay?: boolean;
  CapitalizeFields?: boolean;
  ClickToExpand?: boolean;
  CurrencySymbol?: string;
  CurrencySeparator?: string; // Deprecated
  ThousandsSeparator?: string;
  DecimalSeparator?: string;
  DecimalPlaces?: number;
  SkipToMainContentLink?: boolean;
  SrcDefer?: boolean;
  NeverBounceAPI?: string | null;
  NeverBounceDateField?: string | null;
  NeverBounceStatusField?: string | null;
  ProgressBar?: boolean | null;
  AutoYear?: boolean;
  Debug?: boolean;
  RememberMe: boolean | {
    remoteUrl?: string,
    cookieName?: string,
    cookieExpirationDays?: number,
    fieldNames?: string[],
    fieldDonationAmountRadioName?: string,
    fieldDonationAmountOtherName?: string,
    fieldDonationRecurrPayRadioName?: string,
    fieldDonationAmountOtherCheckboxID?: string,
    fieldOptInSelectorTarget?: string,
    fieldOptInSelectorTargetLocation?: string,
    fieldClearSelectorTarget?: string,
    fieldClearSelectorTargetLocation?: string,
    checked?: boolean
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
  ThousandsSeparator: "",
  DecimalSeparator: ".",
  DecimalPlaces: 2,
  SkipToMainContentLink: true,
  SrcDefer: true,
  NeverBounceAPI: null,
  NeverBounceDateField: null,
  NeverBounceStatusField: null,
  ProgressBar: false,
  AutoYear: false,
  Debug: false,
  RememberMe: false
};
