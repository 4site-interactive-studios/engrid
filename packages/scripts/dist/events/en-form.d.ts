export declare class EnForm {
    private logger;
    private _onIntentSubmit;
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
    dispatchIntentSubmit(): void;
    dispatchSubmit(): void;
    dispatchValidate(): void;
    dispatchError(): void;
    submitForm(): void;
    /**
     * onIntentSubmit is dispatched when a submit button is clicked,
     * or a digital wallet submission is initiated,
     * but before server-side validation or the actual submit event.
     * This allows you to run code at the moment the user intends to submit,
     * such as triggering data formatting, analytics events, or other pre-submit actions.
     * Actions that rely on fully processed form data or validation results should use the onSubmit event instead.
     * Note: onSubmit will also dispatch onIntentSubmit, so do not repeat actions in both events.
     */
    get onIntentSubmit(): import("strongly-typed-events").ISignal;
    /**
     * onSubmit is dispatched when the form is submitted, after validation has passed.
     * This is the main event to listen to for form submissions, as it indicates that the user has successfully submitted the form and all validation checks have been passed.
     * This event uses window.enOnSubmit, which is called by Engaging Networks' JavaScript when the form is submitted.
     * At the time of writing, enOnSubmit does not trigger when a user submits via a digital wallet, use onIntentSubmit to listen for those submission attempts.
     * Note: onSubmit will also dispatch onIntentSubmit, so do not repeat actions in both events.
     */
    get onSubmit(): import("strongly-typed-events").ISignal;
    /**
     * onValidate is dispatched using window.enOnValidate, which is called by Engaging Networks' JavaScript
     * when the form is being validated, before submission. This only occurs after ENgrid's client-side validation has passed, but before server-side validation.
     */
    get onValidate(): import("strongly-typed-events").ISignal;
    /**
     * onError is dispatched using window.enOnError, which is called by Engaging Networks' JavaScript when a server-side validation error occurs on form submission.
     * This allows you to listen for validation errors and respond accordingly, such as displaying custom error messages or triggering analytics events.
     */
    get onError(): import("strongly-typed-events").ISignal;
}
