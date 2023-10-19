import { EnForm, RememberMeEvents } from "./events";
export declare class RememberMe {
    _form: EnForm;
    _events: RememberMeEvents;
    private remoteUrl;
    private cookieName;
    private fieldNames;
    private fieldData;
    private cookieExpirationDays;
    private iframe;
    private rememberMeOptIn;
    private fieldDonationAmountRadioName;
    private fieldDonationAmountOtherName;
    private fieldDonationRecurrPayRadioName;
    private fieldDonationAmountOtherCheckboxID;
    private fieldOptInSelectorTarget;
    private fieldOptInSelectorTargetLocation;
    private fieldClearSelectorTarget;
    private fieldClearSelectorTargetLocation;
    constructor(options: {
        remoteUrl?: string;
        cookieName?: string;
        cookieExpirationDays?: number;
        fieldNames?: string[];
        fieldDonationAmountRadioName?: string;
        fieldDonationAmountOtherName?: string;
        fieldDonationRecurrPayRadioName?: string;
        fieldDonationAmountOtherCheckboxID?: string;
        fieldOptInSelectorTarget?: string;
        fieldOptInSelectorTargetLocation?: string;
        fieldClearSelectorTarget?: string;
        fieldClearSelectorTargetLocation?: string;
        checked?: boolean;
    });
    private updateFieldData;
    private insertClearRememberMeLink;
    private getElementByFirstSelector;
    private insertRememberMeOptin;
    private useRemote;
    private createIframe;
    private clearCookie;
    private clearCookieOnRemote;
    private saveCookieToRemote;
    private readCookie;
    private saveCookie;
    private readFields;
    private setFieldValue;
    private clearFields;
    /**
     * Writes the values from the fieldData object to the corresponding HTML input fields.
     *
     * This function iterates over the fieldNames array and for each field name, it selects the corresponding HTML input field.
     * If the field is found and its tag name is "INPUT", it checks if the field name matches certain conditions (like being a donation recurring payment radio button or a donation amount radio button).
     * Depending on these conditions, it either clicks the field or sets its value using the setFieldValue function.
     * If the field tag name is "SELECT", it sets its value using the setFieldValue function.
     *
     * @param overwrite - A boolean indicating whether to overwrite the existing value of the fields. Defaults to false.
     */
    private writeFields;
    private isJson;
}
