var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as cookie from "./cookie";
import { EnForm, RememberMeEvents } from "./events";
const tippy = require("tippy.js").default;
// localStorage key used to cache the per-device AES-GCM encryption key.
// A random secret generated once per device and held in localStorage.
const RM_ENCRYPTION_KEY_STORAGE_NAME = "engrid-remember-me-key";
export class RememberMe {
    constructor(options) {
        this._form = EnForm.getInstance();
        this._events = RememberMeEvents.getInstance();
        this.iframe = null;
        this.encryptData = options.encryptData ? options.encryptData : false;
        this.hide = options.hide ? options.hide : false;
        this.remoteUrl = options.remoteUrl ? options.remoteUrl : null;
        this.cookieName = options.cookieName
            ? options.cookieName
            : "engrid-autofill";
        this.cookieExpirationDays = options.cookieExpirationDays
            ? options.cookieExpirationDays
            : 365;
        this.rememberMeOptIn = options.checked ? options.checked : false;
        this.fieldNames = options.fieldNames ? options.fieldNames : [];
        this.fieldDonationAmountRadioName = options.fieldDonationAmountRadioName
            ? options.fieldDonationAmountRadioName
            : "transaction.donationAmt";
        this.fieldDonationAmountOtherName = options.fieldDonationAmountOtherName
            ? options.fieldDonationAmountOtherName
            : "transaction.donationAmt.other";
        this.fieldDonationRecurrPayRadioName =
            options.fieldDonationRecurrPayRadioName
                ? options.fieldDonationRecurrPayRadioName
                : "transaction.recurrpay";
        this.fieldDonationAmountOtherCheckboxID =
            options.fieldDonationAmountOtherCheckboxID
                ? options.fieldDonationAmountOtherCheckboxID
                : "#en__field_transaction_donationAmt4";
        this.fieldOptInSelectorTarget = options.fieldOptInSelectorTarget
            ? options.fieldOptInSelectorTarget
            : ".en__field--emailAddress.en__field";
        this.fieldOptInSelectorTargetLocation =
            options.fieldOptInSelectorTargetLocation
                ? options.fieldOptInSelectorTargetLocation
                : "after";
        this.fieldClearSelectorTarget = options.fieldClearSelectorTarget
            ? options.fieldClearSelectorTarget
            : 'label[for="en__field_supporter_firstName"]';
        this.fieldClearSelectorTargetLocation =
            options.fieldClearSelectorTargetLocation
                ? options.fieldClearSelectorTargetLocation
                : "before";
        this.fieldClearLabel = options.fieldClearLabel
            ? options.fieldClearLabel
            : "(clear autofill)";
        this.fieldData = {};
        if (this.useRemote()) {
            this.createIframe(() => {
                if (this.iframe && this.iframe.contentWindow) {
                    this.iframe.contentWindow.postMessage(JSON.stringify({
                        key: this.cookieName,
                        operation: "read",
                        encryptData: this.encryptData,
                    }), "*");
                    this._form.onSubmit.subscribe(() => {
                        if (this.rememberMeOptIn) {
                            this.readFields();
                            this.saveCookieToRemote();
                        }
                    });
                }
            }, (event) => {
                let data;
                if (event.data &&
                    typeof event.data === "string" &&
                    this.isJson(event.data)) {
                    data = JSON.parse(event.data);
                }
                if (data &&
                    data.key &&
                    data.value !== undefined &&
                    data.key === this.cookieName) {
                    this.updateFieldData(data.value);
                    this.writeFields();
                    let hasFieldData = Object.keys(this.fieldData).length > 0;
                    if (!hasFieldData) {
                        this.insertRememberMeOptin();
                    }
                    else {
                        this.insertClearRememberMeLink();
                    }
                }
            });
        }
        else if (this.encryptData) {
            // Same flow as the unencrypted branch below, but the cookie payload is
            // AES-GCM encrypted/decrypted (browser-native Web Crypto), so reading
            // the cookie is asynchronous. A failed decrypt (foreign device or
            // cleared localStorage) leaves fieldData empty and silently falls back
            // to the standard, no-autofill experience.
            this.readCookieEncrypted().then(() => {
                let hasFieldData = Object.keys(this.fieldData).length > 0;
                if (!hasFieldData) {
                    this.insertRememberMeOptin();
                }
                else {
                    this.insertClearRememberMeLink();
                }
                this.writeFields();
                this._form.onSubmit.subscribe(() => {
                    if (this.rememberMeOptIn) {
                        this.readFields();
                        this.saveCookieEncrypted();
                    }
                });
            });
        }
        else {
            this.readCookie();
            let hasFieldData = Object.keys(this.fieldData).length > 0;
            if (!hasFieldData) {
                this.insertRememberMeOptin();
            }
            else {
                this.insertClearRememberMeLink();
            }
            this.writeFields();
            this._form.onSubmit.subscribe(() => {
                if (this.rememberMeOptIn) {
                    this.readFields();
                    this.saveCookie();
                }
            });
        }
    }
    updateFieldData(jsonData) {
        if (jsonData) {
            let data = JSON.parse(jsonData);
            for (let i = 0; i < this.fieldNames.length; i++) {
                if (data[this.fieldNames[i]] !== undefined) {
                    this.fieldData[this.fieldNames[i]] = decodeURIComponent(data[this.fieldNames[i]]);
                }
            }
        }
    }
    insertClearRememberMeLink() {
        let clearRememberMeField = document.getElementById("clear-autofill-data");
        if (!clearRememberMeField) {
            clearRememberMeField = document.createElement("a");
            clearRememberMeField.setAttribute("id", "clear-autofill-data");
            clearRememberMeField.classList.add("label-tooltip");
            clearRememberMeField.setAttribute("style", "cursor: pointer;");
            clearRememberMeField.innerHTML = this.fieldClearLabel;
            const targetField = this.getElementByFirstSelector(this.fieldClearSelectorTarget);
            if (targetField) {
                if (this.fieldClearSelectorTargetLocation === "after") {
                    targetField.appendChild(clearRememberMeField);
                }
                else {
                    targetField.prepend(clearRememberMeField);
                }
            }
        }
        clearRememberMeField.addEventListener("click", (e) => {
            e.preventDefault();
            this.clearFields(["supporter.country" /*, 'supporter.emailAddress'*/]);
            if (this.useRemote()) {
                this.clearCookieOnRemote();
            }
            else if (this.encryptData) {
                this.clearCookieEncrypted();
            }
            else {
                this.clearCookie();
            }
            let clearAutofillLink = document.getElementById("clear-autofill-data");
            if (clearAutofillLink) {
                clearAutofillLink.style.display = "none";
            }
            this.rememberMeOptIn = false;
            this._events.dispatchClear();
            window.dispatchEvent(new CustomEvent("RememberMe_Cleared"));
        });
        this._events.dispatchLoad(true);
        window.dispatchEvent(new CustomEvent("RememberMe_Loaded", { detail: { withData: true } }));
    }
    getElementByFirstSelector(selectorsString) {
        // iterate through the selectors until we find one that exists
        let targetField = null;
        const selectorTargets = selectorsString.split(",");
        for (let i = 0; i < selectorTargets.length; i++) {
            targetField = document.querySelector(selectorTargets[i]);
            if (targetField) {
                break;
            }
        }
        return targetField;
    }
    insertRememberMeOptin() {
        let rememberMeOptInField = document.getElementById("remember-me-opt-in");
        if (!rememberMeOptInField) {
            const rememberMeLabel = "Remember Me";
            const rememberMeInfo = `
				Check “Remember me” to complete forms on this device faster. 
				While your financial information won’t be stored, you should only check this box from a personal device. 
				Click “Clear autofill” to remove the information from your device at any time.
			`;
            const rememberMeOptInFieldChecked = this.rememberMeOptIn ? "checked" : "";
            const rememberMeOptInField = document.createElement("div");
            rememberMeOptInField.classList.add("en__field", "en__field--checkbox", "en__field--question", "rememberme-wrapper");
            rememberMeOptInField.setAttribute("id", "remember-me-opt-in");
            rememberMeOptInField.setAttribute("style", "overflow-x: hidden;");
            rememberMeOptInField.innerHTML = `
        <div class="en__field__element en__field__element--checkbox">
          <div class="en__field__item">
            <input id="remember-me-checkbox" type="checkbox" class="en__field__input en__field__input--checkbox" ${rememberMeOptInFieldChecked} />
            <label for="remember-me-checkbox" class="en__field__label en__field__label--item" style="white-space: nowrap;">
              <div class="rememberme-content" style="display: inline-flex; align-items: center;">
                ${rememberMeLabel}
                <a id="rememberme-learn-more-toggle" style="display: inline-block; display: inline-flex; align-items: center; cursor: pointer; margin-left: 10px; margin-top: var(--rememberme-learn-more-toggle_margin-top)">
                  <svg style="height: 14px; width: auto; z-index: 1;" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M11 7H9V5H11V7ZM11 9H9V15H11V9ZM10 2C5.59 2 2 5.59 2 10C2 14.41 5.59 18 10 18C14.41 18 18 14.41 18 10C18 5.59 14.41 2 10 2ZM10 0C15.523 0 20 4.477 20 10C20 15.523 15.523 20 10 20C4.477 20 0 15.523 0 10C0 4.477 4.477 0 10 0Z" fill="currentColor"/></svg>
                </a>
              </div>
            </label>
          </div>
        </div>
			`;
            const targetField = this.getElementByFirstSelector(this.fieldOptInSelectorTarget);
            if (targetField && targetField.parentNode) {
                targetField.parentNode.insertBefore(rememberMeOptInField, this.fieldOptInSelectorTargetLocation == "before"
                    ? targetField
                    : targetField.nextSibling);
                const rememberMeCheckbox = document.getElementById("remember-me-checkbox");
                if (rememberMeCheckbox) {
                    rememberMeCheckbox.addEventListener("change", () => {
                        if (rememberMeCheckbox.checked) {
                            this.rememberMeOptIn = true;
                        }
                        else {
                            this.rememberMeOptIn = false;
                        }
                    });
                }
                if (this.hide) {
                    rememberMeOptInField.classList.add("hide");
                }
                tippy("#rememberme-learn-more-toggle", { content: rememberMeInfo });
            }
        }
        else if (this.rememberMeOptIn) {
            rememberMeOptInField.checked = true;
        }
        this._events.dispatchLoad(false);
        window.dispatchEvent(new CustomEvent("RememberMe_Loaded", { detail: { withData: false } }));
    }
    useRemote() {
        return (!!this.remoteUrl &&
            typeof window.postMessage === "function" &&
            window.JSON &&
            window.localStorage);
    }
    createIframe(iframeLoaded, messageReceived) {
        if (this.remoteUrl) {
            let iframe = document.createElement("iframe");
            iframe.style.cssText =
                "position:absolute;width:1px;height:1px;left:-9999px;";
            iframe.src = this.remoteUrl;
            iframe.setAttribute("sandbox", "allow-same-origin allow-scripts");
            iframe.setAttribute("title", "Remember Me iframe");
            this.iframe = iframe;
            document.body.appendChild(this.iframe);
            this.iframe.addEventListener("load", () => iframeLoaded(), false);
            window.addEventListener("message", (event) => {
                var _a;
                if (((_a = this.iframe) === null || _a === void 0 ? void 0 : _a.contentWindow) === event.source) {
                    messageReceived(event);
                }
            }, false);
        }
    }
    clearCookie() {
        this.fieldData = {};
        this.saveCookie();
    }
    clearCookieOnRemote() {
        this.fieldData = {};
        this.saveCookieToRemote();
    }
    saveCookieToRemote() {
        if (this.iframe && this.iframe.contentWindow) {
            this.iframe.contentWindow.postMessage(JSON.stringify({
                key: this.cookieName,
                value: this.fieldData,
                operation: "write",
                expires: this.cookieExpirationDays,
                encryptData: this.encryptData,
            }), "*");
        }
    }
    readCookie() {
        this.updateFieldData(cookie.get(this.cookieName) || "");
    }
    saveCookie() {
        cookie.set(this.cookieName, JSON.stringify(this.fieldData), {
            expires: this.cookieExpirationDays,
        });
    }
    /**
     * Reads and decrypts the local (non-remote) Remember Me cookie using
     * browser-native AES-GCM (Web Crypto), with the key held in localStorage
     * on this device. If the key is absent (different device or cleared
     * storage) or decryption otherwise fails, the field data is left empty
     * and the component falls back to the normal, no-autofill experience.
     */
    readCookieEncrypted() {
        return __awaiter(this, void 0, void 0, function* () {
            const raw = cookie.get(this.cookieName);
            if (!raw) {
                return;
            }
            const decrypted = yield this.decryptPayload(raw);
            if (decrypted) {
                this.updateFieldData(decrypted);
            }
        });
    }
    /**
     * Encrypts the current fieldData with AES-GCM (Web Crypto) and stores the
     * base64-encoded result in the local cookie. If encryption isn't possible
     * (e.g. Web Crypto unavailable), nothing is written.
     */
    saveCookieEncrypted() {
        return __awaiter(this, void 0, void 0, function* () {
            const encrypted = yield this.encryptPayload(JSON.stringify(this.fieldData));
            if (encrypted) {
                cookie.set(this.cookieName, encrypted, {
                    expires: this.cookieExpirationDays,
                });
            }
        });
    }
    clearCookieEncrypted() {
        this.fieldData = {};
        this.saveCookieEncrypted();
    }
    /**
     * Retrieves the per-device AES-GCM encryption key. A random secret
     * generated once per device and held in localStorage — never written
     * to the cookie, so it never travels with the transported value.
     */
    getEncryptionKey() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!window.crypto || !window.crypto.subtle) {
                return null;
            }
            const storedKey = window.localStorage.getItem(RM_ENCRYPTION_KEY_STORAGE_NAME);
            if (storedKey) {
                try {
                    return yield window.crypto.subtle.importKey("raw", this.base64ToArrayBuffer(storedKey), { name: "AES-GCM", length: 256 }, false, ["encrypt", "decrypt"]);
                }
                catch (e) {
                    return null;
                }
            }
            try {
                const key = yield window.crypto.subtle.generateKey({ name: "AES-GCM", length: 256 }, true, ["encrypt", "decrypt"]);
                const exported = yield window.crypto.subtle.exportKey("raw", key);
                window.localStorage.setItem(RM_ENCRYPTION_KEY_STORAGE_NAME, this.arrayBufferToBase64(exported));
                return key;
            }
            catch (e) {
                return null;
            }
        });
    }
    /**
     * Encrypts a plaintext string with AES-GCM and returns the base64-encoded
     * IV + ciphertext, ready for storage. Returns null if a key isn't
     * available (e.g. Web Crypto unsupported).
     */
    encryptPayload(plaintext) {
        return __awaiter(this, void 0, void 0, function* () {
            const key = yield this.getEncryptionKey();
            if (!key) {
                return null;
            }
            const iv = window.crypto.getRandomValues(new Uint8Array(12));
            const ciphertext = yield window.crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, new TextEncoder().encode(plaintext));
            const combined = new Uint8Array(iv.length + ciphertext.byteLength);
            combined.set(iv);
            combined.set(new Uint8Array(ciphertext), iv.length);
            return this.arrayBufferToBase64(combined);
        });
    }
    /**
     * Decrypts a base64-encoded IV + ciphertext payload previously produced by
     * encryptPayload. Returns null (rather than throwing) if the key is
     * missing or decryption otherwise fails, so callers can gracefully fall
     * back to the standard, no-autofill experience.
     */
    decryptPayload(encryptedBase64) {
        return __awaiter(this, void 0, void 0, function* () {
            const key = yield this.getEncryptionKey();
            if (!key) {
                return null;
            }
            let combined;
            try {
                combined = new Uint8Array(this.base64ToArrayBuffer(encryptedBase64));
            }
            catch (e) {
                return null;
            }
            if (combined.length < 13) {
                return null;
            }
            const iv = combined.slice(0, 12);
            const ciphertext = combined.slice(12);
            try {
                const decrypted = yield window.crypto.subtle.decrypt({ name: "AES-GCM", iv }, key, ciphertext);
                return new TextDecoder().decode(decrypted);
            }
            catch (e) {
                return null;
            }
        });
    }
    arrayBufferToBase64(buffer) {
        let binary = "";
        const bytes = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);
        for (let i = 0; i < bytes.byteLength; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return window.btoa(binary);
    }
    base64ToArrayBuffer(base64) {
        const binary = window.atob(base64);
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) {
            bytes[i] = binary.charCodeAt(i);
        }
        return bytes.buffer;
    }
    readFields() {
        for (let i = 0; i < this.fieldNames.length; i++) {
            let fieldSelector = "[name='" + this.fieldNames[i] + "']";
            let field = document.querySelector(fieldSelector);
            if (field) {
                if (field.tagName === "INPUT") {
                    let type = field.getAttribute("type");
                    if (type === "radio" || type === "checkbox") {
                        field = document.querySelector(fieldSelector + ":checked");
                    }
                    this.fieldData[this.fieldNames[i]] = encodeURIComponent(field.value);
                }
                else if (field.tagName === "SELECT") {
                    this.fieldData[this.fieldNames[i]] = encodeURIComponent(field.value);
                }
            }
        }
    }
    setFieldValue(field, value, overwrite = false) {
        value = decodeURIComponent(value || "");
        if (field && value !== undefined) {
            if ("type" in field) {
                switch (field.type) {
                    case "select-one":
                    case "select-multiple": {
                        const selectField = field;
                        for (const option of Array.from(selectField.options)) {
                            if (option.value === value) {
                                if ((selectField.value && overwrite) || !selectField.value) {
                                    option.selected = true;
                                    selectField.dispatchEvent(new Event("change", { bubbles: true }));
                                }
                                break;
                            }
                        }
                        break;
                    }
                    case "checkbox":
                    case "radio": {
                        const inputField = field;
                        if (inputField.value === value) {
                            inputField.checked = true;
                            inputField.dispatchEvent(new Event("change", { bubbles: true }));
                        }
                        break;
                    }
                    case "textarea":
                    case "text":
                    default:
                        if ((field.value && overwrite) || !field.value) {
                            field.value = value;
                            field.dispatchEvent(new Event("change", { bubbles: true }));
                            field.dispatchEvent(new Event("blur", { bubbles: true }));
                        }
                }
            }
        }
    }
    clearFields(skipFields) {
        for (let key in this.fieldData) {
            if (skipFields.includes(key)) {
                delete this.fieldData[key];
            }
            else if (this.fieldData[key] === "") {
                delete this.fieldData[key];
            }
            else {
                this.fieldData[key] = "";
            }
        }
        this.writeFields(true);
    }
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
    writeFields(overwrite = false) {
        for (let i = 0; i < this.fieldNames.length; i++) {
            let fieldSelector = "[name='" + this.fieldNames[i] + "']";
            let field = document.querySelector(fieldSelector);
            if (field) {
                if (field.tagName === "INPUT") {
                    if (this.fieldNames[i] === this.fieldDonationRecurrPayRadioName) {
                        if (this.fieldData[this.fieldNames[i]] === "Y") {
                            field.click();
                        }
                    }
                    else if (this.fieldDonationAmountRadioName === this.fieldNames[i]) {
                        field = document.querySelector(fieldSelector +
                            "[value='" +
                            this.fieldData[this.fieldNames[i]] +
                            "']");
                        if (field) {
                            field.click();
                        }
                        else {
                            field = document.querySelector("input[name='" + this.fieldDonationAmountOtherName + "']");
                            this.setFieldValue(field, this.fieldData[this.fieldNames[i]], true);
                        }
                    }
                    else {
                        this.setFieldValue(field, this.fieldData[this.fieldNames[i]], overwrite);
                    }
                }
                else if (field.tagName === "SELECT") {
                    this.setFieldValue(field, this.fieldData[this.fieldNames[i]], true);
                }
            }
        }
    }
    isJson(str) {
        try {
            JSON.parse(str);
        }
        catch (e) {
            return false;
        }
        return true;
    }
}
