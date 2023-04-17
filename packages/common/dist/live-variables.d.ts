import { DonationAmount, ProcessingFees } from "./events";
import { Options } from "./";
export declare class LiveVariables {
    _amount: DonationAmount;
    _fees: ProcessingFees;
    private _frequency;
    private _form;
    private multiplier;
    private submitLabel;
    private options;
    constructor(options: Options);
    private getAmountTxt;
    private getUpsellAmountTxt;
    private getUpsellAmountRaw;
    changeSubmitButton(): void;
    changeLiveAmount(): void;
    changeLiveUpsellAmount(): void;
    changeLiveFrequency(): void;
    changeRecurrency(): void;
    private upsold;
}
