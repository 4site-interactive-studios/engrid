export declare class PremiumGift {
    private logger;
    private enElements;
    private _frequency;
    private _amount;
    constructor();
    shoudRun(): boolean;
    addEventListeners(): void;
    checkPremiumGift(): void;
    searchElements(): void;
    setPremiumTitle(title: string): void;
    altsAndArias(): void;
    syncOptionSelectStates(): void;
    altsAndAriasForSelects(optionTypesParent: Element, titleText: string, premiumGiftId: string): void;
    maxDonationAria(): void;
}
