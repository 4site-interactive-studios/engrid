export interface Options {
    backgroundImage?: string | string[];
    MediaAttribution?: boolean;
    applePay?: boolean;
    CapitalizeFields?: boolean;
    ClickToExpand?: boolean;
    CurrencySymbol?: string;
    CurrencyCode?: string;
    AddCurrencySymbol?: boolean;
    CurrencySeparator?: string;
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
    FreshAddress?: false | {
        dateField?: string;
        dateFieldFormat?: string;
        statusField?: string;
        messageField?: string;
    };
    ProgressBar?: boolean | null;
    AutoYear?: boolean;
    TranslateFields?: boolean;
    Debug?: boolean;
    RegionLongFormat?: string;
    RememberMe?: boolean | {
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
    TidyContact?: false | {
        cid?: string;
        record_field?: string;
        date_field?: string;
        status_field?: string;
        countries?: string[];
        country_fallback?: string;
        us_zip_divider?: string;
        address_enable?: boolean;
        address_fields?: {
            address1: string;
            address2: string;
            address3: string;
            city: string;
            region: string;
            postalCode: string;
            country: string;
            phone: string;
        };
        phone_enable?: boolean;
        phone_flags?: boolean;
        phone_country_from_ip?: boolean;
        phone_preferred_countries?: string[];
        phone_record_field?: string;
        phone_date_field?: string;
        phone_status_field?: string;
    };
    MobileCTA?: false | {
        label?: string;
        pages?: string[];
    };
    PageLayouts?: string[];
    CountryDisable?: string[];
    Plaid?: boolean;
    Placeholders?: false | {
        [key: string]: string;
    };
    ENValidators?: boolean;
    CustomCurrency?: false | {
        label?: string;
        default: {
            [key: string]: string;
        };
        countries?: {
            [key: string]: {
                [key: string]: string;
            };
        };
    };
    VGS?: false | {
        "transaction.ccnumber"?: {
            showCardIcon?: boolean;
            css?: {
                [key: string]: string | object;
            };
            icons?: {
                [key: string]: string;
            };
            ariaLabel?: string;
            placeholder?: string;
        };
        "transaction.ccvv"?: {
            showCardIcon?: boolean;
            css?: {
                [key: string]: string | object;
            };
            ariaLabel?: string;
            placeholder?: string;
            hideValue?: boolean;
        };
    };
    PostalCodeValidator?: boolean;
    CountryRedirect?: false | {
        [key: string]: string;
    };
    WelcomeBack?: false | {
        welcomeBackMessage: {
            display: boolean;
            title: string;
            editText: string;
            anchor: string;
            placement: "beforebegin" | "afterbegin" | "beforeend" | "afterend";
        };
        personalDetailsSummary: {
            display: boolean;
            title: string;
            editText: string;
            anchor: string;
            placement: "beforebegin" | "afterbegin" | "beforeend" | "afterend";
        };
    };
    onLoad?: () => void;
    onResize?: () => void;
    onSubmit?: () => void;
    onError?: () => void;
    onValidate?: () => void;
}
export declare const OptionsDefaults: Options;
