export declare class DonationFrequency {
    private _onFrequencyChange;
    private _frequency;
    private _recurring;
    private _dispatch;
    private static instance;
    private constructor();
    static getInstance(): DonationFrequency;
    get frequency(): string;
    set frequency(value: string);
    get recurring(): string;
    set recurring(value: string);
    get onFrequencyChange(): any;
    load(): void;
    setRecurrency(recurr: string, dispatch?: boolean): void;
    setFrequency(freq: string, dispatch?: boolean): void;
}
