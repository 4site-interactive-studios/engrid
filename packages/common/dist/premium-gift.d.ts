export declare class PremiumGift {
    private logger;
    private enElements;
    private _frequency;
    private _amount;
    constructor();
    shoudRun(): boolean;
    addEventListeners(): void;
    restorePremiumGift(): void;
    checkPremiumGift(): void;
    searchElements(): void;
    setPremiumTitle(title: string): void;
}
