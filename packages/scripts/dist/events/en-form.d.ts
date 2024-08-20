export declare class EnForm {
    private logger;
    private _onSubmit;
    private _onValidate;
    private _onError;
    submit: boolean;
    submitPromise: boolean | Promise<any>;
    validate: boolean;
    validatePromise: boolean | Promise<any>;
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
