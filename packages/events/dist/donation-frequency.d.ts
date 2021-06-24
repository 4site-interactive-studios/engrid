export declare class DonationFrequency {
    private _onFrequencyChange;
    private _frequency;
    private _radios;
    private static instance;
    private constructor();
    static getInstance(radios?: string): DonationFrequency;
    get frequency(): string;
    set frequency(value: string);
    get onFrequencyChange(): import("strongly-typed-events").ISimpleEvent<string>;
    load(): void;
}
