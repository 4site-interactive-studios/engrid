export declare class CustomCurrency {
    private logger;
    private currencyElement;
    private countryElement;
    constructor();
    shouldRun(): boolean;
    addEventListeners(): void;
    loadCurrencies(country?: string): void;
}
