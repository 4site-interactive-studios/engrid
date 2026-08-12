var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { EnForm, DonationAmount, ENGrid, ProcessingFees, EngridLogger, } from ".";
/*global window */
const ApplePaySession = window.ApplePaySession;
const merchantIdentifier = window.merchantIdentifier;
const merchantDomainName = window.merchantDomainName;
const merchantDisplayName = window.merchantDisplayName;
const merchantSessionIdentifier = window.merchantSessionIdentifier;
const merchantNonce = window.merchantNonce;
const merchantEpochTimestamp = window.merchantEpochTimestamp;
const merchantSignature = window.merchantSignature;
const merchantCountryCode = window.merchantCountryCode;
const merchantCurrencyCode = window.merchantCurrencyCode;
const merchantSupportedNetworks = window.merchantSupportedNetworks;
const merchantCapabilities = window.merchantCapabilities;
const merchantTotalLabel = window.merchantTotalLabel;
export class ApplePay {
    constructor() {
        this.logger = new EngridLogger("ApplePay", "#000000", "#a6f3a6", "🍎");
        this.applePay = document.querySelector('.en__field__input.en__field__input--radio[value="applepay"]');
        this._amount = DonationAmount.getInstance();
        this._fees = ProcessingFees.getInstance();
        this._form = EnForm.getInstance();
        // Client hook: runs after the built-in pre-flight, right before the Apple
        // Pay sheet opens. Return false to abort. The hook shows its own errors
        // with ENGrid.setError; the donation amount field error is cleared before
        // every attempt.
        this.beforeSession = null;
        // Fields the wallet supplies via requiredBillingContactFields, so they are
        // excluded from the mandatory-field pre-flight.
        this.walletFields = [
            "supporter.address1",
            "supporter.address2",
            "supporter.city",
            "supporter.region",
            "supporter.postcode",
            "supporter.country",
            "supporter.phoneNumber",
        ];
        // Field containers this component flagged with ENGrid.setError, so they can
        // be cleared on the next attempt.
        this.errorFields = [];
        ApplePay.instance = this;
        this.checkApplePay();
    }
    static getInstance() {
        if (!ApplePay.instance) {
            ApplePay.instance = new ApplePay();
        }
        return ApplePay.instance;
    }
    // True when the page offers Apple Pay, either as a giveBySelect radio tile
    // or as an option of the payment type select.
    hasApplePayOption() {
        if (this.applePay)
            return true;
        const paymentTypeField = ENGrid.getField("transaction.paymenttype");
        if (!paymentTypeField || !paymentTypeField.options)
            return false;
        return Array.from(paymentTypeField.options).some((option) => option.value.toLowerCase() === "applepay");
    }
    checkApplePay() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.hasApplePayOption() ||
                !window.hasOwnProperty("ApplePaySession")) {
                const applePayContainer = document.querySelector(".en__field__item.applepay");
                if (applePayContainer)
                    applePayContainer.remove();
                ENGrid.setBodyData("apple-pay-available", "false");
                this.logger.log("DISABLED: not supported by this browser or page");
                return false;
            }
            if (!merchantIdentifier) {
                ENGrid.setBodyData("apple-pay-available", "false");
                this.logger.log("DISABLED: window.merchantIdentifier is not defined");
                return false;
            }
            let applePayEnabled = false;
            try {
                applePayEnabled = yield ApplePaySession.canMakePaymentsWithActiveCard(merchantIdentifier);
            }
            catch (e) {
                applePayEnabled = false;
            }
            ENGrid.setBodyData("apple-pay-available", applePayEnabled ? "true" : "false");
            if (!applePayEnabled) {
                this.logger.log("DISABLED: no provisioned card");
                return false;
            }
            // Hidden field that carries the wallet token to EN. Only create it if it
            // doesn't exist yet, so we never post a duplicate PkPaymentToken.
            if (!ENGrid.getField("PkPaymentToken")) {
                ENGrid.createHiddenInput("PkPaymentToken").setAttribute("id", "applePayToken");
            }
            this.writeButtonContainer();
            // Fallback trigger: an implicit submit (e.g. Enter key) while Apple Pay
            // is selected and no token exists yet opens the sheet instead of
            // submitting. After authorization the token is set and the submit
            // passes through.
            this._form.onSubmit.subscribe(() => this.onSubmitFallback());
            this.logger.log("ENABLED");
            return true;
        });
    }
    // Writes the native Apple Pay button container right before the submit
    // button. CSS swaps it with the submit button while the applepay payment
    // type is selected (data-engrid-payment-type="applepay").
    writeButtonContainer() {
        if (document.querySelector(".apple-pay-container"))
            return;
        if (!document.querySelector(".en__submit"))
            return;
        // The -apple-pay-button-* properties are set inline because cssnano's
        // colormin rewrites the keyword "black" to #000 in built stylesheets,
        // which is not a valid value for -apple-pay-button-style, so Safari
        // drops it and falls back to white-outline.
        ENGrid.addHtml('<div class="apple-pay-container showif-applepay-selected">' +
            '<div class="apple-pay-button" role="button" tabindex="0" aria-label="Donate with Apple Pay" ' +
            'style="-apple-pay-button-type: donate; -apple-pay-button-style: black;"></div>' +
            "</div>", ".en__submit", "before");
        const button = document.querySelector(".apple-pay-container .apple-pay-button");
        if (!button)
            return;
        button.addEventListener("click", () => this.onPayClicked());
        button.addEventListener("keydown", (event) => {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                this.onPayClicked();
            }
        });
    }
    onSubmitFallback() {
        const applePayToken = document.getElementById("applePayToken");
        if (ENGrid.getPaymentType().toLowerCase() !== "applepay" ||
            (applePayToken && applePayToken.value !== "")) {
            return; // Not Apple Pay, or already authorized: let the submit proceed
        }
        if (!this._form.submit)
            return; // Another component vetoed this submit
        this._form.submit = false; // Veto the submit and open the sheet instead
        this.onPayClicked();
    }
    onPayClicked() {
        if (!this.preflight())
            return;
        this.openSession();
    }
    preflight() {
        this.clearErrors();
        // The wallet supplies billing address and phone, but nothing else. Flag
        // empty mandatory fields before the sheet opens so a donor never
        // authorizes a payment EN will bounce for a missing mandatory field.
        const missing = this.missingMandatoryFields();
        missing.forEach((field) => {
            ENGrid.setError(field, "This field is required");
            this.errorFields.push(field);
        });
        if (missing.length) {
            this.scrollToError();
            return false;
        }
        const amount = this._amount.amount;
        if (!amount || amount <= 0) {
            ENGrid.setError(".en__field--donationAmt", "Please select a gift amount.");
            this.scrollToError();
            return false;
        }
        // The client hook owns the donation amount field error from here on
        ENGrid.removeError(".en__field--donationAmt");
        if (this.beforeSession && this.beforeSession() === false) {
            this.scrollToError();
            return false;
        }
        return true;
    }
    // Scrolls to the first field flagged with a validation error so the donor
    // sees what needs fixing; without this the button looks unresponsive.
    scrollToError() {
        const errorField = (this.errorFields[0] ||
            document.querySelector(".en__field--validationFailed"));
        if (errorField) {
            errorField.scrollIntoView({ behavior: "smooth", block: "center" });
        }
    }
    clearErrors() {
        this.errorFields.forEach((field) => ENGrid.removeError(field));
        this.errorFields = [];
        ENGrid.removeError(".en__field--donationAmt");
    }
    // Every visible mandatory field container that is empty and that the
    // wallet cannot fill.
    missingMandatoryFields() {
        const missing = [];
        document
            .querySelectorAll(".en__field.en__mandatory")
            .forEach((field) => {
            const fieldElement = field;
            if (!ENGrid.isVisible(fieldElement))
                return;
            const input = fieldElement.querySelector("input, select, textarea");
            if (!input || !input.name)
                return;
            if (this.walletFields.indexOf(input.name) !== -1)
                return;
            if (input.type === "radio" || input.type === "checkbox") {
                if (!fieldElement.querySelector("input:checked")) {
                    missing.push(fieldElement);
                }
                return;
            }
            if (input.value.trim() === "") {
                missing.push(fieldElement);
            }
        });
        return missing;
    }
    openSession() {
        // ProcessingFees mirrors EN's own fee cover calculation, so the sheet
        // total matches what EN will actually charge.
        const donationAmount = (this._amount.amount + this._fees.fee).toFixed(2);
        const request = {
            supportedNetworks: merchantSupportedNetworks,
            merchantCapabilities: merchantCapabilities,
            countryCode: merchantCountryCode,
            currencyCode: merchantCurrencyCode,
            requiredBillingContactFields: ["postalAddress", "phone"],
            total: {
                label: merchantTotalLabel || merchantDisplayName || "Donation",
                amount: donationAmount,
                type: "final",
            },
        };
        let session;
        try {
            session = new ApplePaySession(3, request);
        }
        catch (e) {
            const errorTarget = (document.querySelector(".apple-pay-container") || document.querySelector(".en__submit"));
            if (errorTarget) {
                ENGrid.setError(errorTarget, "Apple Pay error: '" + e.message + "'");
            }
            this._form.dispatchError();
            return;
        }
        const thisClass = this;
        session.onvalidatemerchant = function (event) {
            thisClass
                .performValidation(event.validationURL)
                .then(function (merchantSession) {
                if (ENGrid.debug)
                    console.log("Apple Pay merchantSession", merchantSession);
                session.completeMerchantValidation(merchantSession);
            })
                .catch(function () {
                session.abort();
            });
        };
        session.onpaymentauthorized = function (event) {
            thisClass.onPaymentAuthorized(session, event);
        };
        session.oncancel = function () {
            // Donor closed the sheet; return them to the form quietly.
            thisClass.logger.log("Sheet cancelled by the donor");
        };
        session.begin();
    }
    onPaymentAuthorized(session, event) {
        if (ENGrid.debug)
            console.log("Apple Pay Token", event.payment.token);
        // Pass the billing info from Apple Pay back into the EN billing fields -
        // this won't happen automatically with Vantiv Apple Pay.
        const billing = event.payment.billingContact || {};
        const addressLines = billing.addressLines || [];
        // Country goes first, dispatching change: EN swaps country-dependent
        // fields (supporter.region is a select for some countries and a text
        // input for others) when the country changes, so the region field must
        // already be in its final shape when we fill it below.
        this.setField("supporter.country", billing.countryCode, true);
        this.setField("supporter.address1", addressLines[0]);
        this.setField("supporter.address2", addressLines[1]);
        this.setField("supporter.city", billing.locality);
        if (billing.administrativeArea) {
            this.setRegion(billing.administrativeArea);
        }
        this.setField("supporter.postcode", billing.postalCode);
        this.setField("supporter.phoneNumber", billing.phone);
        // Apple Pay gifts are one-time on this setup; make sure recurrpay isn't
        // submitted blank when we bypass the EN submit button.
        const recurrpay = ENGrid.getField("transaction.recurrpay");
        if (recurrpay && !recurrpay.value)
            recurrpay.value = "N";
        const applePayToken = document.getElementById("applePayToken");
        if (applePayToken) {
            applePayToken.value = JSON.stringify(event.payment.token);
        }
        session.completePayment(ApplePaySession.STATUS_SUCCESS);
        this._form.submitForm();
    }
    setField(name, value, dispatchEvents = false) {
        if (value == null || value === "")
            return;
        if (!ENGrid.getField(name))
            return;
        ENGrid.setFieldValue(name, value, true, dispatchEvents);
    }
    // The region field is a select for countries EN has subdivisions for and a
    // text input for the rest. On a select, the wallet value must match an
    // option or the write is silently dropped, so match case-insensitively by
    // option value or label (Apple returns subdivision codes for some
    // countries and full names for others).
    setRegion(value) {
        const field = ENGrid.getField("supporter.region");
        if (!field)
            return;
        if (field instanceof HTMLSelectElement) {
            const option = Array.from(field.options).find((o) => o.value.toLowerCase() === value.toLowerCase() ||
                o.text.toLowerCase() === value.toLowerCase());
            if (!option) {
                this.logger.log(`Region "${value}" doesn't match any region select option`);
                return;
            }
            ENGrid.setFieldValue("supporter.region", option.value);
            return;
        }
        ENGrid.setFieldValue("supporter.region", value);
    }
    performValidation(url) {
        return new Promise(function (resolve, reject) {
            var merchantSession = {};
            merchantSession.merchantIdentifier = merchantIdentifier;
            merchantSession.merchantSessionIdentifier = merchantSessionIdentifier;
            merchantSession.nonce = merchantNonce;
            merchantSession.domainName = merchantDomainName;
            merchantSession.epochTimestamp = merchantEpochTimestamp;
            merchantSession.signature = merchantSignature;
            var validationData = "&merchantIdentifier=" +
                merchantIdentifier +
                "&merchantDomain=" +
                merchantDomainName +
                "&displayName=" +
                merchantDisplayName;
            var validationUrl = "/ea-dataservice/rest/applepay/validateurl?url=" + url + validationData;
            var xhr = new XMLHttpRequest();
            xhr.onload = function () {
                var data = JSON.parse(this.responseText);
                if (ENGrid.debug)
                    console.log("Apple Pay Validation", data);
                resolve(data);
            };
            xhr.onerror = reject;
            xhr.open("GET", validationUrl);
            xhr.send();
        });
    }
}
