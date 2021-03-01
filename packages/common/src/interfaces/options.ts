export interface Options {
    backgroundImage?: string | string[],
    ModalDebug?: boolean,
    MediaAttribution?: boolean,
    applePay?: boolean,
    CapitalizeFields?: boolean,
    ClickToExpand?: boolean,
    CurrencySymbol?: string,
    CurrencySeparator?: string,
    SkipToMainContentLink?: boolean,
    SrcDefer?: boolean,
    onLoad?: () => void,
    onResize?: () => void,
}

export const OptionsDefaults: Options = {
    backgroundImage: '',
    ModalDebug: false,
    MediaAttribution: true,
    applePay: false,
    CapitalizeFields: false,
    ClickToExpand: true,
    CurrencySymbol: '$',
    CurrencySeparator: '.',
    SkipToMainContentLink: true,
    SrcDefer: true,
}