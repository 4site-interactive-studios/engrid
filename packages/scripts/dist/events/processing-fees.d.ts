import { EnForm } from "./en-form";
import { DonationAmount } from "./donation-amount";
export declare class ProcessingFees {
    private _onFeeChange;
    _amount: DonationAmount;
    _form: EnForm;
    private _fee;
    private _field;
    private _subscribe?;
    private static instance;
    constructor();
    static getInstance(): ProcessingFees;
    get onFeeChange(): import("strongly-typed-events").ISimpleEvent<number>;
    get fee(): number;
    set fee(value: number);
    calculateFees(amount?: number): any;
    private addFees;
    private removeFees;
    private isENfeeCover;
}
