export declare class EnForm {
    private _onSubmit;
    private _onError;
    submit: boolean;
    private static instance;
    private constructor();
    static getInstance(): EnForm;
    dispatchSubmit(): void;
    dispatchError(): void;
    submitForm(): void;
    get onSubmit(): import("strongly-typed-events").ISignal;
    get onError(): import("strongly-typed-events").ISignal;
}
