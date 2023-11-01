import { ProcessingFees } from "./";
import { DonationAmount } from "./events";
export declare class UpsellLightbox {
    private options;
    private overlay;
    private _form;
    _amount: DonationAmount;
    _fees: ProcessingFees;
    private _frequency;
    private _dataLayer;
    private logger;
    constructor();
    private renderLightbox;
    private shouldRun;
    private shouldSkip;
    private popupOtherField;
    private liveAmounts;
    private liveFrequency;
    private getUpsellAmount;
    private shouldOpen;
    private freqAllowed;
    private open;
    private setOriginalAmount;
    private continue;
    private close;
    private getAmountTxt;
    private getFrequencyTxt;
    private checkOtherAmount;
}
