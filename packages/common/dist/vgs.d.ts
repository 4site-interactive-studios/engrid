export declare class VGS {
    private logger;
    private vgsField;
    private options;
    private paymentTypeField;
    private _form;
    private field_expiration_month;
    private field_expiration_year;
    constructor();
    shouldRun(): boolean;
    setDefaults(): void;
    setPaymentType(): void;
    dumpGlobalVar(): void;
    private handleExpUpdate;
    private validate;
}
