import { DonationAmount } from ".";
export declare class LiveFrequency {
    private logger;
    private elementsFound;
    _amount: DonationAmount;
    private _frequency;
    constructor();
    searchElements(): void;
    shouldRun(): boolean;
    addEventListeners(): void;
    updateFrequency(): void;
    replaceMergeTags(tag: string, element: HTMLElement): void;
}
