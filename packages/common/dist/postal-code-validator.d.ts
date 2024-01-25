export declare class PostalCodeValidator {
    private postalCodeField;
    private _form;
    private logger;
    private separator;
    private regexSeparator;
    private supportedSeparators;
    constructor();
    private shouldRun;
    private validate;
    private isValidUSZipCode;
    /**
     * Formats the zip code to #####-####  as the user inputs it
     * The separator is determined by the TidyContact option, but defaults to "-"
     */
    private liveValidate;
    private shouldValidateUSZipCode;
    private getSeparator;
    private getRegexSeparator;
}
