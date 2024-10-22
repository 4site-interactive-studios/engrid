import { ProcessingFees } from ".";
import { DonationAmount } from "./events";
export declare class UpsellCheckbox {
    private options;
    private checkboxOptions;
    private checkboxOptionsDefaults;
    _amount: DonationAmount;
    _fees: ProcessingFees;
    private _frequency;
    private _dataLayer;
    private checkboxContainer;
    private oldAmount;
    private oldFrequency;
    private logger;
    constructor();
    private updateLiveData;
    private renderCheckbox;
    private shouldRun;
    private showCheckbox;
    private hideCheckbox;
    private liveAmounts;
    private liveFrequency;
    private getUpsellAmount;
    private toggleCheck;
    private getAmountTxt;
    private getFrequencyTxt;
    private renderConversionField;
}
