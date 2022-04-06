import { Options } from "./";
export declare abstract class ENGrid {
    constructor();
    static get enForm(): HTMLFormElement;
    static get debug(): boolean;
    static getUrlParameter(name: string): string | true | Object[] | null;
    static getFieldValue(name: string): string;
    static setFieldValue(name: string, value: unknown): void;
    static createHiddenInput(name: string, value?: string): HTMLInputElement;
    static enParseDependencies(): void;
    static getGiftProcess(): any;
    static getPageCount(): any;
    static getPageNumber(): any;
    static getPageID(): any;
    static getPageType(): "ECARD" | "SURVEY" | "EMAILTOTARGET" | "ADVOCACY" | "SUBSCRIBEFORM" | "SUPPORTERHUB" | "UNSUBSCRIBE" | "DONATION";
    static setBodyData(dataName: string, value: string | boolean): void;
    static getBodyData(dataName: string): string | null;
    static getOption<K extends keyof Options>(key: K): Options[K] | null;
    static loadJS(url: string, onload?: (() => void) | null, head?: boolean): void;
    static formatNumber(number: string | number, decimals?: number, dec_point?: string, thousands_sep?: string): string;
    static disableSubmit(label?: string): boolean;
    static enableSubmit(): boolean;
    static formatDate(date: Date, format?: string): string;
    /**
     * Check if the provided object has ALL the provided properties
     * Example: checkNested(EngagingNetworks, 'require', '_defined', 'enjs', 'checkSubmissionFailed')
     * will return true if EngagingNetworks.require._defined.enjs.checkSubmissionFailed is defined
     */
    static checkNested(obj: any, ...args: string[]): boolean;
    static setError(querySelector: string, errorMessage: string): void;
    static removeError(querySelector: string): void;
}
