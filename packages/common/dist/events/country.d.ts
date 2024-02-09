export declare class Country {
    private _onCountryChange;
    private _country;
    private _field;
    private static instance;
    constructor();
    static getInstance(): Country;
    get countryField(): HTMLElement | null;
    get onCountryChange(): import("strongly-typed-events").ISimpleEvent<string>;
    get country(): string;
    set country(value: string);
}
