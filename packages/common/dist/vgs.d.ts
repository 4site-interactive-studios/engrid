export declare class VGS {
    private logger;
    private vgsField;
    private options;
    private paymentTypeField;
    private _form;
    constructor();
    shouldRun(): boolean;
    setDefaults(): void;
    setPaymentType(): void;
    dumpGlobalVar(): void;
    private validate;
}
