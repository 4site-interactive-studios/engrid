export declare class EnForm {
    private _onSubmit;
    private _onValidate;
    private _onError;
    submit: boolean;
    validate: boolean;
    private static instance;
    private constructor();
    static getInstance(): EnForm;
    dispatchSubmit(): void;
    dispatchValidate(): void;
    dispatchError(): void;
    submitForm(): void;
    get onSubmit(): import("strongly-typed-events").ISignal;
    get onError(): import("strongly-typed-events").ISignal;
    get onValidate(): import("strongly-typed-events").ISignal;
}
