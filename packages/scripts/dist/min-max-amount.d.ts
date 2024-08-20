export declare class MinMaxAmount {
    private _form;
    private _amount;
    private minAmount;
    private maxAmount;
    private minAmountMessage;
    private maxAmountMessage;
    private logger;
    constructor();
    shouldRun(): boolean;
    enOnValidate(): void;
    liveValidate(): void;
}
