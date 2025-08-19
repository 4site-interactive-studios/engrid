export declare class MinMaxAmount {
    private _form;
    private _amount;
    private _frequency;
    private minAmount;
    private maxAmount;
    private minAmountMessage;
    private maxAmountMessage;
    private enAmountValidator;
    private logger;
    constructor();
    shouldRun(): boolean;
    enOnValidate(): void;
    liveValidate(): void;
    private setValidationConfigFromEN;
}
