// This class automatically select other radio input when an amount is entered into it.
import { EngridLogger, ENGrid, EnForm, FastFormFill, RememberMeEvents, } from ".";
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
            return value.toUpperCase().split(" ").join("-").replace(":-", "-");
        }
        else if (typeof value === "boolean") {
            value = value ? "TRUE" : "FALSE";
            return value;
        }
        return "";
    }
    onLoad() {
        if (ENGrid.getGiftProcess()) {
            this.logger.log("EN_SUCCESSFUL_DONATION");
            this.dataLayer.push({
                event: "EN_SUCCESSFUL_DONATION",
            });
            this.addEndOfGiftProcessEventsToDataLayer();
        }
        else {
            this.logger.log("EN_PAGE_VIEW");
            this.dataLayer.push({
                event: "EN_PAGE_VIEW",
            });
        }
        if (window.pageJson) {
            const pageJson = window.pageJson;
            for (const property in pageJson) {
                if (!Number.isNaN(pageJson[property])) {
                    this.dataLayer.push({
                        event: `EN_PAGEJSON_${property.toUpperCase()}-${pageJson[property]}`,
                    });
                    this.dataLayer.push({
                        [`'EN_PAGEJSON_${property.toUpperCase()}'`]: pageJson[property],
                    });
                }
                else {
                    this.dataLayer.push({
                        event: `EN_PAGEJSON_${property.toUpperCase()}-${this.transformJSON(pageJson[property])}`,
                    });
                    this.dataLayer.push({
                        [`'EN_PAGEJSON_${property.toUpperCase()}'`]: this.transformJSON(pageJson[property]),
                    });
                }
                this.dataLayer.push({
                    event: "EN_PAGEJSON_" + property.toUpperCase(),
                    eventValue: pageJson[property],
                });
            }
            if (ENGrid.getPageCount() === ENGrid.getPageNumber()) {
                this.dataLayer.push({
                    event: "EN_SUBMISSION_SUCCESS_" + pageJson.pageType.toUpperCase(),
                });
                this.dataLayer.push({
                    [`'EN_SUBMISSION_SUCCESS_${pageJson.pageType.toUpperCase()}'`]: "TRUE",
                });
            }
        }
        const urlParams = new URLSearchParams(window.location.search);
        urlParams.forEach((value, key) => {
            this.dataLayer.push({
                event: `EN_URLPARAM_${key.toUpperCase()}-${this.transformJSON(value)}`,
            });
            this.dataLayer.push({
                [`'EN_URLPARAM_${key.toUpperCase()}'`]: this.transformJSON(value),
            });
        });
        if (ENGrid.getPageType() === "DONATION") {
            const recurrFreqEls = document.querySelectorAll('[name="transaction.recurrfreq"]');
            const recurrValues = [...recurrFreqEls].map((el) => el.value);
            this.dataLayer.push({
                event: "EN_RECURRING_FREQUENCIES",
                [`'EN_RECURRING_FREQEUENCIES'`]: recurrValues,
            });
        }
        let fastFormFill = false;
        // Fast Form Fill - Personal Details
        const fastPersonalDetailsFormBlock = document.querySelector(".en__component--formblock.fast-personal-details");
        if (fastPersonalDetailsFormBlock) {
            const allPersonalMandatoryInputsAreFilled = FastFormFill.allMandatoryInputsAreFilled(fastPersonalDetailsFormBlock);
            const somePersonalMandatoryInputsAreFilled = FastFormFill.someMandatoryInputsAreFilled(fastPersonalDetailsFormBlock);
            if (allPersonalMandatoryInputsAreFilled) {
                this.dataLayer.push({
                    event: "EN_FASTFORMFILL_PERSONALINFO_SUCCESS",
                });
                fastFormFill = true;
            }
            else if (somePersonalMandatoryInputsAreFilled) {
                this.dataLayer.push({
                    event: "EN_FASTFORMFILL_PERSONALINFO_PARTIALSUCCESS",
                });
            }
            else {
                this.dataLayer.push({
                    event: "EN_FASTFORMFILL_PERSONALINFO_FAILURE",
                });
            }
        }
        // Fast Form Fill - Address Details
        const fastAddressDetailsFormBlock = document.querySelector(".en__component--formblock.fast-address-details");
        if (fastAddressDetailsFormBlock) {
            const allAddressMandatoryInputsAreFilled = FastFormFill.allMandatoryInputsAreFilled(fastAddressDetailsFormBlock);
            const someAddressMandatoryInputsAreFilled = FastFormFill.someMandatoryInputsAreFilled(fastAddressDetailsFormBlock);
            if (allAddressMandatoryInputsAreFilled) {
                this.dataLayer.push({
                    event: "EN_FASTFORMFILL_ADDRESS_SUCCESS",
                });
                fastFormFill = fastFormFill ? true : false; // Only set to true if it was true before
            }
            else if (someAddressMandatoryInputsAreFilled) {
                this.dataLayer.push({
                    event: "EN_FASTFORMFILL_ADDRESS_PARTIALSUCCESS",
                });
            }
            else {
                this.dataLayer.push({
                    event: "EN_FASTFORMFILL_ADDRESS_FAILURE",
                });
            }
        }
        if (fastFormFill) {
            this.dataLayer.push({
                event: "EN_FASTFORMFILL_ALL_SUCCESS",
            });
        }
        else {
            this.dataLayer.push({
                event: "EN_FASTFORMFILL_ALL_FAILURE",
            });
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
            [`'${variableName.toUpperCase()}'`]: variableValue,
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
