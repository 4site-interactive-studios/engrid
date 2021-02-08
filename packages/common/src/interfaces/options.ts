export interface Options {
    backgroundImage?: string | string[],
    ModalDebug?: boolean,
    applePay?: boolean,
    CapitalizeFields?: boolean,
    ClickToExpand?: boolean,
    CurrencySymbol?: string,
    CurrencySeparator?: string,
    onLoad?: () => void,
    onResize?: () => void,
}

export const OptionsDefaults: Options = {
    backgroundImage: '',
    ModalDebug: false,
    applePay: false,
    CapitalizeFields: false,
    ClickToExpand: true,
    CurrencySymbol: '$',
    CurrencySeparator: '.',
}