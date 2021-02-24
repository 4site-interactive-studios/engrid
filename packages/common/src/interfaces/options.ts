export interface Options {
    backgroundImage?: string | string[],
    ModalDebug?: boolean,
    ImageAttribution?: boolean,
    applePay?: boolean,
    CapitalizeFields?: boolean,
    ClickToExpand?: boolean,
    CurrencySymbol?: string,
    CurrencySeparator?: string,
    SkipToMainContentLink?: boolean,
    onLoad?: () => void,
    onResize?: () => void,
}

export const OptionsDefaults: Options = {
    backgroundImage: '',
    ModalDebug: false,
    ImageAttribution: true,
    applePay: false,
    CapitalizeFields: false,
    ClickToExpand: true,
    CurrencySymbol: '$',
    CurrencySeparator: '.',
    SkipToMainContentLink: true,
}