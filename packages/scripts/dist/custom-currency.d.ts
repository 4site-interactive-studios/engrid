export declare class CustomCurrency {
    private logger;
    private currencyElement;
    private _country;
    constructor();
    shouldRun(): boolean;
    addEventListeners(): void;
    loadCurrencies(country?: string): void;
}
