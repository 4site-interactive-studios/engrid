import { DonationAmount } from ".";
export declare class LiveCurrency {
    private logger;
    private elementsFound;
    _amount: DonationAmount;
    private _frequency;
    private _fees;
    constructor();
    searchElements(): void;
    shouldRun(): boolean;
    addEventListeners(): void;
    updateCurrency(): void;
}
