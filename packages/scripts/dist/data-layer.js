// DataLayer: singleton helper for pushing structured analytics events/vars to window.dataLayer.
// On load it emits one aggregated event `pageJsonVariablesReady` with:
//   EN_PAGEJSON_* (normalized pageJson), EN_URLPARAM_*, EN_RECURRING_FREQUENCIES (donation pages),
//   and EN_SUBMISSION_SUCCESS_{PAGETYPE} when on the final page.
// User actions emit: EN_FORM_VALUE_UPDATED (field changes) and submission opt‑in/out events.
// Queued end‑of‑gift events/variables (via addEndOfGiftProcessEvent / addEndOfGiftProcessVariable)
// are replayed after a successful gift process load.
// Sensitive payment/bank fields are excluded; selected PII fields are Base64 “hashed” (btoa — not cryptographic).
// Replace with a real hash (e.g., SHA‑256) if required.
import { EngridLogger, ENGrid, EnForm, RememberMeEvents } from ".";
export class DataLayer {
    constructor() {
        this.logger = new EngridLogger("DataLayer", "#f1e5bc", "#009cdc", "📊");
        this.dataLayer = window.dataLayer || [];
        this._form = EnForm.getInstance();
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
        if (el.value === "" || this.excludedFields.includes(el.name))
            return;
        const value = this.hashedFields.includes(el.name)
            ? this.hash(el.value)
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
        this.dataLayer.push({
            event: "EN_FORM_VALUE_UPDATED",
            enFieldName: el.name,
            enFieldLabel: this.getFieldLabel(el),
            enFieldValue: value,
        });
    }
    hash(value) {
        return btoa(value);
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
