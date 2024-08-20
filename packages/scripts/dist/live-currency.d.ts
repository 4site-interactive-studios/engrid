import { DonationAmount } from ".";
export declare class LiveCurrency {
    private logger;
    private elementsFound;
    private isUpdating;
    _amount: DonationAmount;
    private _frequency;
    private _fees;
    constructor();
    searchElements(): void;
    shouldRun(): boolean;
    addMutationObserver(): void;
    addEventListeners(): void;
    updateCurrency(): void;
}
