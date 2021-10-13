import * as cookie from "./cookie";
import { EnForm } from "./events";
const tippy = require('tippy.js').default;
export class RememberMe {
    constructor(options) {
        this._form = EnForm.getInstance();
        this.iframe = null;
        this.remoteUrl = ('remoteUrl' in options) ? options.remoteUrl : null;
        this.rememberMeOptIn = false;
        this.cookieName = ('cookieName' in options) ? options.cookieName : 'engrid-autofill';
        this.cookieExpirationDays = ('cookieExpirationDays' in options) ? options.cookieExpirationDays : 365;
        this.fieldNames = ('fieldNames' in options) ? options.fieldNames : [];
        this.fieldDonationAmountRadioName = ('fieldDonationAmountRadioName' in options) ? options.fieldDonationAmountRadioName : 'transaction.donationAmt';
        this.fieldDonationAmountOtherName = ('fieldDonationAmountOtherName' in options) ? options.fieldDonationAmountOtherName : 'transaction.donationAmt.other';
        this.fieldDonationRecurrPayRadioName = ('fieldDonationRecurrPayRadioName' in options) ? options.fieldDonationRecurrPayRadioName : 'transaction.recurrpay';
        this.fieldDonationAmountOtherCheckboxID = ('fieldDonationAmountOtherCheckboxID' in options) ? options.fieldDonationAmountOtherCheckboxID : '#en__field_transaction_donationAmt4';
        this.fieldOptInSelectorTarget = ('fieldOptInSelectorTarget' in options) ? options.fieldOptInSelectorTarget : '.en__field--emailAddress.en__field';
        this.fieldOptInSelectorTargetLocation = ('fieldOptInSelectorTargetLocation' in options) ? options.fieldOptInSelectorTargetLocation : 'after';
        this.fieldClearSelectorTarget = ('fieldClearSelectorTarget' in options) ? options.fieldClearSelectorTarget : 'label[for="en__field_supporter_firstName"]';
        this.fieldClearSelectorTargetLocation = ('fieldClearSelectorTargetLocation' in options) ? options.fieldClearSelectorTargetLocation : 'before';
        this.fieldData = {};
        if (this.useRemote()) {
            this.clearIframe(() => {
                if (this.iframe && this.iframe.contentWindow) {
                    this.iframe.contentWindow.postMessage({ key: this.cookieName, operation: 'read' }, '*');
                    this._form.onSubmit.subscribe(() => {
                        if (this.rememberMeOptIn) {
                            this.readFields();
                            this.saveCookieToRemote();
                        }
                    });
                }
            }, (event) => {
                if (event.data && event.data.key && event.data.value && event.data.key === this.cookieName) {
                    this.updateFieldData(event.data.value);
                    this.writeFields();
                    let hasFieldData = Object.keys(this.fieldData).length > 0;
                    if (!hasFieldData) {
                        this.insertRememberMeOptin();
                        this.rememberMeOptIn = false;
                    }
                    else {
                        this.insertClearRememberMeLink();
                        this.rememberMeOptIn = true;
                    }
                }
            });
        }
        else {
            this.readCookie();
            let hasFieldData = Object.keys(this.fieldData).length > 0;
            if (!hasFieldData) {
                this.insertRememberMeOptin();
                this.rememberMeOptIn = false;
            }
            else {
                this.insertClearRememberMeLink();
                this.rememberMeOptIn = true;
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
        if (!document.getElementById('clear-autofill-data')) {
            const clearAutofillLabel = 'clear autofill';
            const clearRememberMeField = document.createElement('a');
            clearRememberMeField.setAttribute('id', 'clear-autofill-data');
            clearRememberMeField.classList.add('label-tooltip');
            clearRememberMeField.setAttribute('style', 'cursor: pointer;');
            clearRememberMeField.innerHTML = `(${clearAutofillLabel})`;
            const targetField = document.querySelector(this.fieldClearSelectorTarget);
            if (targetField) {
                if (this.fieldClearSelectorTargetLocation === 'after') {
                    targetField.appendChild(clearRememberMeField);
                }
                else {
                    targetField.prepend(clearRememberMeField);
                }
                clearRememberMeField.addEventListener('click', (e) => {
                    e.preventDefault();
                    if (this.useRemote()) {
                        this.clearCookieOnRemote();
                    }
                    else {
                        this.clearCookie();
                    }
                    this.clearFields(['supporter.emailAddress']);
                    let clearAutofillLink = document.getElementById('clear-autofill-data');
                    if (clearAutofillLink) {
                        clearAutofillLink.style.display = 'none';
                    }
                    this.rememberMeOptIn = false;
                });
            }
        }
    }
    insertRememberMeOptin() {
        if (!document.getElementById('remember-me-opt-in')) {
            const rememberMeLabel = 'Remember Me';
            const rememberMeInfo = `
				Check “Remember me” to complete forms on this device faster. 
				While your financial information won’t be stored, you should only check this box from a personal device. 
				Click “Clear autofill” to remove the information from your device at any time.
			`;
            const rememberMeOptInField = document.createElement('div');
            rememberMeOptInField.classList.add('en__field', 'en__field--checkbox');
            rememberMeOptInField.setAttribute('id', 'remember-me-opt-in');
            rememberMeOptInField.setAttribute('style', 'overflow-x: hidden;');
            rememberMeOptInField.innerHTML = `
				<div class="en__field__item rememberme-wrapper">
					<input id="remember-me-checkbox" type="checkbox" class="en__field__input en__field__input--checkbox" />
					<label for="remember-me-checkbox" class="en__field__label en__field__label--item" style="white-space: nowrap;"><div class="rememberme-content" style="display: inline-flex; align-items: center;">
						${rememberMeLabel}						
					</div></label>
					<a id="rememberme-learn-more-toggle" style="display: inline-block; display: inline-flex; align-items: center; cursor: pointer;"><svg style="height: 14px; width: auto; z-index: 1;" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M11 7H9V5H11V7ZM11 9H9V15H11V9ZM10 2C5.59 2 2 5.59 2 10C2 14.41 5.59 18 10 18C14.41 18 18 14.41 18 10C18 5.59 14.41 2 10 2ZM10 0C15.523 0 20 4.477 20 10C20 15.523 15.523 20 10 20C4.477 20 0 15.523 0 10C0 4.477 4.477 0 10 0Z" fill="currentColor"/></svg></a>
				</div>
			`;
            const targetField = document.querySelector(this.fieldOptInSelectorTarget);
            if (targetField && targetField.parentNode) {
                targetField.parentNode.insertBefore(rememberMeOptInField, (this.fieldOptInSelectorTargetLocation == 'before') ? targetField : targetField.nextSibling);
                const rememberMeCheckbox = document.getElementById('remember-me-checkbox');
                if (rememberMeCheckbox) {
                    rememberMeCheckbox.addEventListener('change', () => {
                        if (rememberMeCheckbox.checked) {
                            this.rememberMeOptIn = true;
                        }
                        else {
                            this.rememberMeOptIn = false;
                        }
                    });
                }
                tippy('#rememberme-learn-more-toggle', { content: rememberMeInfo });
            }
        }
    }
    useRemote() {
        return (this.remoteUrl && window.postMessage && window.JSON && window.localStorage);
    }
    clearIframe(iframeLoaded, messageReceived) {
        if (this.remoteUrl) {
            let iframe = document.createElement('iframe');
            iframe.style.cssText = 'position:absolute;width:1px;height:1px;left:-9999px;';
            iframe.src = this.remoteUrl;
            iframe.setAttribute('sandbox', 'allow-same-origin allow-scripts');
            this.iframe = iframe;
            document.body.appendChild(this.iframe);
            this.iframe.addEventListener('load', () => iframeLoaded(), false);
            window.addEventListener('message', (event) => messageReceived(event), false);
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
            this.iframe.contentWindow.postMessage({ key: this.cookieName, value: JSON.stringify(this.fieldData), operation: 'write', expires: this.cookieExpirationDays }, '*');
        }
    }
    readCookie() {
        this.updateFieldData(cookie.get(this.cookieName) || '');
    }
    saveCookie() {
        cookie.set(this.cookieName, JSON.stringify(this.fieldData), { expires: this.cookieExpirationDays });
    }
    readFields() {
        for (let i = 0; i < this.fieldNames.length; i++) {
            let fieldSelector = "[name='" + this.fieldNames[i] + "']";
            let field = document.querySelector(fieldSelector);
            if (field) {
                if (field.tagName === 'INPUT') {
                    let type = field.getAttribute('type');
                    if (type === 'radio' || type === 'checkbox') {
                        field = document.querySelector(fieldSelector + ":checked");
                    }
                    this.fieldData[this.fieldNames[i]] = encodeURIComponent(field.value);
                }
                else if (field.tagName === 'SELECT') {
                    this.fieldData[this.fieldNames[i]] = encodeURIComponent(field.value);
                }
            }
        }
    }
    setFieldValue(field, value, overwrite = false) {
        if (field && value !== undefined) {
            if (field.value && overwrite || !field.value) {
                field.value = value;
            }
        }
    }
    clearFields(skipFields) {
        for (let key in this.fieldData) {
            if (skipFields.includes(key)) {
                delete this.fieldData[key];
            }
            else {
                this.fieldData[key] = '';
            }
            this.writeFields(true);
        }
    }
    writeFields(overwrite = false) {
        for (let i = 0; i < this.fieldNames.length; i++) {
            let fieldSelector = "[name='" + this.fieldNames[i] + "']";
            let field = document.querySelector(fieldSelector);
            if (field) {
                if (field.tagName === 'INPUT') {
                    if (this.fieldNames[i] === this.fieldDonationRecurrPayRadioName) {
                        if (this.fieldData[this.fieldNames[i]] === 'Y') {
                            field.click();
                        }
                    }
                    else if (this.fieldDonationAmountRadioName === this.fieldNames[i]) {
                        field = document.querySelector(fieldSelector + "[value='" + this.fieldData[this.fieldNames[i]] + "']");
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
                else if (field.tagName === 'SELECT') {
                    this.setFieldValue(field, this.fieldData[this.fieldNames[i]], overwrite);
                }
            }
        }
    }
}
