import { Options } from "./";
export declare abstract class ENGrid {
    constructor();
    static get enForm(): HTMLFormElement;
    static get debug(): boolean;
    static get demo(): boolean;
    static getUrlParameter(name: string): string | true | Object[] | null;
    static getField(name: string): Element | null;
    static getFieldValue(name: string): string;
    static setFieldValue(name: string, value: unknown, parseENDependencies?: boolean, dispatchEvents?: boolean): void;
    static createHiddenInput(name: string, value?: string): HTMLInputElement;
    static enParseDependencies(): void;
    static getGiftProcess(): any;
    static getPageCount(): any;
    static getPageNumber(): any;
    static getPageID(): any;
    static getClientID(): any;
    static getDataCenter(): "us" | "ca";
    static getPageType(): "DONATION" | "ECARD" | "SURVEY" | "EMAILTOTARGET" | "ADVOCACY" | "SUBSCRIBEFORM" | "SUPPORTERHUB" | "UNSUBSCRIBE" | "TWEETPAGE" | "UNKNOWN";
    static setBodyData(dataName: string, value: string | boolean): void;
    static getBodyData(dataName: string): string | null;
    static hasBodyData(dataName: string): boolean;
    static getOption<K extends keyof Options>(key: K): Options[K] | null;
    static loadJS(url: string, onload?: (() => void) | null, head?: boolean): void;
    static formatNumber(number: string | number, decimals?: number, dec_point?: string, thousands_sep?: string): string;
    static cleanAmount(amount: string): number;
    static disableSubmit(label?: string): boolean;
    static enableSubmit(): boolean;
    static formatDate(date: Date, format?: string): string;
    /**
     * Check if the provided object has ALL the provided properties
     * Example: checkNested(EngagingNetworks, 'require', '_defined', 'enjs', 'checkSubmissionFailed')
     * will return true if EngagingNetworks.require._defined.enjs.checkSubmissionFailed is defined
     */
    static checkNested(obj: any, ...args: string[]): boolean;
    static deepMerge(target: any, source: any): any;
    static setError(element: string | HTMLElement, errorMessage: string): void;
    static removeError(element: string | HTMLElement): void;
    static isVisible(element: HTMLElement): boolean;
    static getCurrencySymbol(): string;
    static getCurrencyCode(): string;
    static addHtml(html: string | HTMLElement, target?: string, position?: string): void;
    static removeHtml(target: string): void;
    static slugify(text: string): string;
    static watchForError(callback: Function): void;
    static getPaymentType(): string;
    static setPaymentType(paymentType: string): void;
    static isInViewport(element: HTMLElement): boolean;
}
