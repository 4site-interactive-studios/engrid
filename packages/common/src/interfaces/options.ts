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
  RegionLongFormat?: string;
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
  TidyContact?:
    | false
    | {
        cid?: number; // Client ID
        record_field?: string; // TidyContact Record
        date_field?: string; // TidyContact Date
        status_field?: string; // TidyContact Status
        countries?: string[]; // Country that is allowed to use the API, if empty, all countries are allowed. You can use more than one country by separating them with a comma.
        us_zip_divider?: string; // The divider used in US zip codes.
        address_fields?: {
          address1: string; // Address Field 1
          address2: string; // Address Field 2
          address3: string; // Address Field 3 - This is only used for field creation
          city: string; // City field
          region: string; // State field
          postalCode: string; // Zipcode field
          country: string; // Country field
        };
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
  TidyContact: false,
  RegionLongFormat: "",
};
