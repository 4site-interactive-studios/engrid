export interface Options {
    submitLabel: string,
    backgroundImage?: string | string[];
    ModalDebug?: boolean | undefined;
    applePay?: boolean | undefined;
    CapitalizeFields?: boolean | undefined;
    ClickToExpand?: boolean | undefined;
    onLoad?: () => void;
    onResize?: () => void;
}