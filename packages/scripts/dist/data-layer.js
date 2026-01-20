// DataLayer: singleton helper for pushing structured analytics events/vars to window.dataLayer.
// On load it emits one aggregated event `pageJsonVariablesReady` with:
//   EN_PAGEJSON_* (normalized pageJson), EN_URLPARAM_*, EN_RECURRING_FREQUENCIES (donation pages),
//   and EN_SUBMISSION_SUCCESS_{PAGETYPE} when on the final page.
// User actions emit: EN_FORM_VALUE_UPDATED (field changes) and submission opt‑in/out events.
// Queued end‑of‑gift events/variables (via addEndOfGiftProcessEvent / addEndOfGiftProcessVariable)
// are replayed after a successful gift process load.
// Sensitive payment/bank fields are excluded; selected PII fields are Base64 “hashed” (btoa — not cryptographic).
// Replace with a real hash (e.g., SHA‑256) if required.
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { EngridLogger, ENGrid, EnForm, RememberMeEvents } from ".";
export class DataLayer {
    constructor() {
        this.logger = new EngridLogger("DataLayer", "#f1e5bc", "#009cdc", "📊");
        this.dataLayer = window.dataLayer || [];
        this._form = EnForm.getInstance();
        this.encoder = new TextEncoder();
        this.endOfGiftProcessStorageKey = "ENGRID_END_OF_GIFT_PROCESS_EVENTS";
        this.excludedFields = [
            // Credit Card
            "transaction.ccnumber",
            "transaction.ccexpire.delimiter",
            "transaction.ccexpire",
            "transaction.ccvv",
            "supporter.creditCardHolderName",
            // Bank Account
            "supporter.bankAccountNumber",
            "supporter.bankAccountType",
            "transaction.bankname",
            "supporter.bankRoutingNumber",
        ];
        this.hashedFields = [
            // Supporter Address, Phone Numbers, and Address
            "supporter.emailAddress",
            "supporter.phoneNumber",
            "supporter.phoneNumber2",
            "supporter.address1",
            "supporter.address2",
            "supporter.address3",
            // In Honor/Memory Inform Email and Address
            "transaction.infemail",
            "transaction.infadd1",
            "transaction.infadd2",
            "transaction.infadd3",
            // Billing Address
            "supporter.billingAddress1",
            "supporter.billingAddress2",
            "supporter.billingAddress3",
        ];
        this.retainedEmailField = "supporter.emailAddress";
        this.retainedAddressFields = [
            "supporter.address1",
            "supporter.address2",
            "supporter.address3",
        ];
        this.retainedPhoneFields = [
            "supporter.phoneNumber2",
            "supporter.phoneNumber",
        ];
        if (ENGrid.getOption("RememberMe")) {
            RememberMeEvents.getInstance().onLoad.subscribe((hasData) => {
                this.logger.log("Remember me - onLoad", hasData);
                this.onLoad();
            });
        }
        else {
            this.onLoad();
        }
        this._form.onSubmit.subscribe(() => this.onSubmit());
    }
    static getInstance() {
        if (!DataLayer.instance) {
            DataLayer.instance = new DataLayer();
            window._dataLayer = DataLayer.instance;
        }
        return DataLayer.instance;
    }
    transformJSON(value) {
        if (typeof value === "string") {
            return value
                .toUpperCase()
                .trim()
                .replace(/\s+/g, "-")
                .replace(/:-/g, "-");
        }
        if (typeof value === "boolean") {
            return value ? "TRUE" : "FALSE";
        }
        if (typeof value === "number") {
            return value; // Preserve numeric type for analytics platforms that infer number vs string
        }
        return "";
    }
    onLoad() {
        // Collect all data layer variables to push at once
        const dataLayerData = {};
        if (ENGrid.getGiftProcess()) {
            this.logger.log("EN_SUCCESSFUL_DONATION");
            this.addEndOfGiftProcessEventsToDataLayer();
        }
        if (window.pageJson) {
            const pageJson = window.pageJson;
            for (const property in pageJson) {
                const key = `EN_PAGEJSON_${property.toUpperCase()}`;
                const value = pageJson[property];
                dataLayerData[key] = this.transformJSON(value);
            }
            if (ENGrid.getPageCount() === ENGrid.getPageNumber()) {
                dataLayerData[`EN_SUBMISSION_SUCCESS_${pageJson.pageType.toUpperCase()}`] = "TRUE";
            }
        }
        const urlParams = new URLSearchParams(window.location.search);
        urlParams.forEach((value, key) => {
            dataLayerData[`EN_URLPARAM_${key.toUpperCase()}`] =
                this.transformJSON(value);
        });
        this.addRetainedHashesToDataLayer(dataLayerData);
        if (ENGrid.getPageType() === "DONATION") {
            const recurrFreqEls = document.querySelectorAll('[name="transaction.recurrfreq"]');
            const recurrValues = [...recurrFreqEls].map((el) => el.value);
            dataLayerData[`EN_RECURRING_FREQUENCIES`] = recurrValues;
        }
        // Push all collected variables at once
        if (Object.keys(dataLayerData).length > 0) {
            dataLayerData.event = "pageJsonVariablesReady";
            this.dataLayer.push(dataLayerData);
        }
        this.attachEventListeners();
    }
    addRetainedHashesToDataLayer(dataLayerData) {
        if (typeof window === "undefined" || !window.localStorage) {
            return;
        }
        ["EMAIL", "ADDRESS", "PHONE"].forEach((suffix) => {
            const storageKey = `EN_HASH_${suffix}`;
            const storedValue = window.localStorage.getItem(storageKey);
            if (storedValue) {
                dataLayerData[storageKey] = storedValue;
            }
        });
    }
    onSubmit() {
        const optIn = document.querySelector(".en__field__item:not(.en__field--question) input[name^='supporter.questions'][type='checkbox']:checked");
        if (optIn) {
            this.logger.log("EN_SUBMISSION_WITH_EMAIL_OPTIN");
            this.dataLayer.push({
                event: "EN_SUBMISSION_WITH_EMAIL_OPTIN",
            });
        }
        else {
            this.logger.log("EN_SUBMISSION_WITHOUT_EMAIL_OPTIN");
            this.dataLayer.push({
                event: "EN_SUBMISSION_WITHOUT_EMAIL_OPTIN",
            });
        }
    }
    attachEventListeners() {
        const textInputs = document.querySelectorAll(".en__component--advrow input:not([type=checkbox]):not([type=radio]):not([type=submit]):not([type=button]):not([type=hidden]):not([unhidden]), .en__component--advrow textarea");
        textInputs.forEach((el) => {
            el.addEventListener("blur", (e) => {
                this.handleFieldValueChange(e.target);
            });
        });
        const radioAndCheckboxInputs = document.querySelectorAll(".en__component--advrow input[type=checkbox], .en__component--advrow input[type=radio]");
        radioAndCheckboxInputs.forEach((el) => {
            el.addEventListener("change", (e) => {
                this.handleFieldValueChange(e.target);
            });
        });
        const selectInputs = document.querySelectorAll(".en__component--advrow select");
        selectInputs.forEach((el) => {
            el.addEventListener("change", (e) => {
                this.handleFieldValueChange(e.target);
            });
        });
    }
    handleFieldValueChange(el) {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            if (el.value === "" || this.excludedFields.includes(el.name))
                return;
            const value = this.hashedFields.includes(el.name)
                ? yield this.hash(el.value)
                : el.value;
            if (["checkbox", "radio"].includes(el.type)) {
                if (el.checked) {
                    if (el.name === "en__pg") {
                        //Premium gift handling
                        this.dataLayer.push({
                            event: "EN_FORM_VALUE_UPDATED",
                            enFieldName: el.name,
                            enFieldLabel: "Premium Gift",
                            enFieldValue: (_b = (_a = el
                                .closest(".en__pg__body")) === null || _a === void 0 ? void 0 : _a.querySelector(".en__pg__name")) === null || _b === void 0 ? void 0 : _b.textContent,
                            enProductId: (_c = document.querySelector('[name="transaction.selprodvariantid"]')) === null || _c === void 0 ? void 0 : _c.value,
                        });
                    }
                    else {
                        this.dataLayer.push({
                            event: "EN_FORM_VALUE_UPDATED",
                            enFieldName: el.name,
                            enFieldLabel: this.getFieldLabel(el),
                            enFieldValue: value,
                        });
                    }
                }
                return;
            }
            if (el.name === this.retainedEmailField) {
                const retainedEmailValue = this.geRetainedFieldsValue("email");
                const sha256value = yield this.hash(retainedEmailValue);
                localStorage.setItem(`EN_HASH_EMAIL`, sha256value);
                this.dataLayer.push({
                    event: "EN_HASH_VALUE_UPDATED",
                    enFieldName: "email",
                    enFieldLabel: this.getFieldLabel(el),
                    enFieldValue: sha256value,
                });
                return;
            }
            else if (this.retainedAddressFields.includes(el.name)) {
                const retainedAddressValue = this.geRetainedFieldsValue("address");
                const sha256value = yield this.hash(retainedAddressValue);
                localStorage.setItem(`EN_HASH_ADDRESS`, sha256value);
                this.dataLayer.push({
                    event: "EN_HASH_VALUE_UPDATED",
                    enFieldName: "address",
                    enFieldLabel: "Supporter Address",
                    enFieldValue: sha256value,
                });
            }
            else if (this.retainedPhoneFields.includes(el.name)) {
                const retainedPhoneValue = this.geRetainedFieldsValue("phone");
                const sha256value = yield this.hash(retainedPhoneValue);
                localStorage.setItem(`EN_HASH_PHONE`, sha256value);
                this.dataLayer.push({
                    event: "EN_HASH_VALUE_UPDATED",
                    enFieldName: "phone",
                    enFieldLabel: "Supporter Phone",
                    enFieldValue: sha256value,
                });
            }
            this.dataLayer.push({
                event: "EN_FORM_VALUE_UPDATED",
                enFieldName: el.name,
                enFieldLabel: this.getFieldLabel(el),
                enFieldValue: value,
            });
        });
    }
    geRetainedFieldsValue(kind) {
        switch (kind) {
            case "email":
                return ENGrid.getFieldValue(this.retainedEmailField);
            case "address":
                return this.retainedAddressFields
                    .map((field) => ENGrid.getFieldValue(field))
                    .filter((value) => value !== "")
                    .join("")
                    .toLocaleLowerCase()
                    .replace(/\s+/g, "");
            case "phone":
                // Only return the first phone number found - prioritize phoneNumber2 over phoneNumber and remove non-numeric characters
                for (const field of this.retainedPhoneFields) {
                    const value = ENGrid.getFieldValue(field);
                    if (value !== "") {
                        return value.replace(/\D/g, "");
                    }
                }
                return "";
            default:
                return "";
        }
    }
    hash(value) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = this.encoder.encode(value);
            const hashBuffer = yield crypto.subtle.digest("SHA-256", data);
            return Array.from(new Uint8Array(hashBuffer))
                .map((byte) => {
                const hex = byte.toString(16);
                return hex.length === 1 ? "0" + hex : hex;
            })
                .join("");
        });
    }
    getFieldLabel(el) {
        var _a, _b;
        return ((_b = (_a = el.closest(".en__field")) === null || _a === void 0 ? void 0 : _a.querySelector("label")) === null || _b === void 0 ? void 0 : _b.textContent) || "";
    }
    addEndOfGiftProcessEvent(eventName, eventProperties = {}) {
        this.storeEndOfGiftProcessData(Object.assign({ event: eventName }, eventProperties));
    }
    addEndOfGiftProcessVariable(variableName, variableValue = "") {
        this.storeEndOfGiftProcessData({
            [variableName.toUpperCase()]: variableValue,
        });
    }
    storeEndOfGiftProcessData(data) {
        const events = this.getEndOfGiftProcessData();
        events.push(data);
        window.sessionStorage.setItem(this.endOfGiftProcessStorageKey, JSON.stringify(events));
    }
    addEndOfGiftProcessEventsToDataLayer() {
        this.getEndOfGiftProcessData().forEach((event) => {
            this.dataLayer.push(event);
        });
        window.sessionStorage.removeItem(this.endOfGiftProcessStorageKey);
    }
    getEndOfGiftProcessData() {
        let eventsData = window.sessionStorage.getItem(this.endOfGiftProcessStorageKey);
        return !eventsData ? [] : JSON.parse(eventsData);
    }
}
