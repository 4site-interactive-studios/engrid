export declare class PremiumGift {
    private logger;
    private enElements;
    private sessionStorageKey;
    private _frequency;
    private _amount;
    constructor();
    shoudRun(): boolean;
    addEventListeners(): void;
    checkPremiumGift(): void;
    private restoreSessionState;
    private storeSessionState;
    searchElements(): void;
    setPremiumTitle(title: string): void;
    altsAndArias(): void;
    syncOptionSelectStates(): void;
    altsAndAriasForSelects(optionTypesParent: Element, titleText: string, premiumGiftId: string): void;
    maxDonationAria(): void;
}
