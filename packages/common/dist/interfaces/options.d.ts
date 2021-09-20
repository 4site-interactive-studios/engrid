export interface Options {
    backgroundImage?: string | string[];
    MediaAttribution?: boolean;
    applePay?: boolean;
    CapitalizeFields?: boolean;
    ClickToExpand?: boolean;
    CurrencySymbol?: string;
    CurrencySeparator?: string;
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
    RememberMe?: any;
    onLoad?: () => void;
    onResize?: () => void;
    onSubmit?: () => void;
    onError?: () => void;
    onValidate?: () => void;
}
export declare const OptionsDefaults: Options;
