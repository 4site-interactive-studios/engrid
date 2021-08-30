import { DonationAmount, DonationFrequency } from "./events";
export declare abstract class UpsellBase {
    _amount: DonationAmount;
    protected _frequency: DonationFrequency;
    protected options: any;
    constructor();
    protected setOriginalAmount(original: string): void;
}
