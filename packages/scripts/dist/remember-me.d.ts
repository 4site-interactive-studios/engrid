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
    private encryptData;
    private hide;
    private fieldDonationAmountRadioName;
    private fieldDonationAmountOtherName;
    private fieldDonationRecurrPayRadioName;
    private fieldDonationAmountOtherCheckboxID;
    private fieldOptInSelectorTarget;
    private fieldOptInSelectorTargetLocation;
    private fieldClearSelectorTarget;
    private fieldClearSelectorTargetLocation;
    private fieldClearLabel;
    private rememberMeLabel;
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
        fieldClearLabel?: string;
        rememberMeLabel?: string;
        checked?: boolean;
        encryptData?: boolean;
        hide?: boolean;
    });
    private updateFieldData;
    private insertClearRememberMeLink;
    private buildClearLabelMarkup;
    private getUsernameFromFieldData;
    private getElementByFirstSelector;
    private placeOnRightSide;
    private insertRememberMeOptin;
    private useRemote;
    private createIframe;
    private clearCookie;
    private clearCookieOnRemote;
    private saveCookieToRemote;
    private readCookie;
    private saveCookie;
    /**
     * Reads and decrypts the local (non-remote) Remember Me cookie using
     * browser-native AES-GCM (Web Crypto), with the key held in localStorage
     * on this device. If the key is absent (different device or cleared
     * storage) or decryption otherwise fails, the field data is left empty
     * and the component falls back to the normal, no-autofill experience.
     */
    private readCookieEncrypted;
    /**
     * Encrypts the current fieldData with AES-GCM (Web Crypto) and stores the
     * base64-encoded result in the local cookie. If encryption isn't possible
     * (e.g. Web Crypto unavailable), nothing is written.
     */
    private saveCookieEncrypted;
    private clearCookieEncrypted;
    /**
     * Retrieves the per-device AES-GCM encryption key. A random secret
     * generated once per device and held in localStorage — never written
     * to the cookie, so it never travels with the transported value.
     */
    private getEncryptionKey;
    /**
     * Encrypts a plaintext string with AES-GCM and returns the base64-encoded
     * IV + ciphertext, ready for storage. Returns null if a key isn't
     * available (e.g. Web Crypto unsupported).
     */
    private encryptPayload;
    /**
     * Decrypts a base64-encoded IV + ciphertext payload previously produced by
     * encryptPayload. Returns null (rather than throwing) if the key is
     * missing or decryption otherwise fails, so callers can gracefully fall
     * back to the standard, no-autofill experience.
     */
    private decryptPayload;
    private arrayBufferToBase64;
    private base64ToArrayBuffer;
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
