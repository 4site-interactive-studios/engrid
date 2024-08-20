import { SimpleEventDispatcher } from "strongly-typed-events";
import { ENGrid } from "../engrid";
export class DonationFrequency {
    constructor() {
        this._onFrequencyChange = new SimpleEventDispatcher();
        this._frequency = "onetime";
        this._recurring = "n";
        this._dispatch = true;
        // Watch the Radios for Changes
        document.addEventListener("change", (e) => {
            const element = e.target;
            if (element && element.name == "transaction.recurrpay") {
                this.recurring = element.value;
                // When this element is a radio, that means you're between onetime and monthly only
                if (element.type == "radio") {
                    this.frequency =
                        element.value.toLowerCase() == "n" ? "onetime" : "monthly";
                    // This field is hidden when transaction.recurrpay is radio
                    ENGrid.setFieldValue("transaction.recurrfreq", this.frequency.toUpperCase());
                }
            }
            if (element && element.name == "transaction.recurrfreq") {
                this.frequency = element.value;
            }
        });
        //Thank you page handling for utility classes
        if (ENGrid.getGiftProcess()) {
            ENGrid.setBodyData("transaction-recurring-frequency", sessionStorage.getItem("engrid-transaction-recurring-frequency") ||
                "onetime");
            ENGrid.setBodyData("transaction-recurring", window.pageJson.recurring ? "y" : "n");
        }
    }
    static getInstance() {
        if (!DonationFrequency.instance) {
            DonationFrequency.instance = new DonationFrequency();
        }
        return DonationFrequency.instance;
    }
    get frequency() {
        return this._frequency;
    }
    // Every time we set a frequency, trigger the onFrequencyChange event
    set frequency(value) {
        this._frequency = value.toLowerCase() || "onetime";
        if (this._dispatch)
            this._onFrequencyChange.dispatch(this._frequency);
        ENGrid.setBodyData("transaction-recurring-frequency", this._frequency);
        sessionStorage.setItem("engrid-transaction-recurring-frequency", this._frequency);
    }
    get recurring() {
        return this._recurring;
    }
    set recurring(value) {
        this._recurring = value.toLowerCase() || "n";
        ENGrid.setBodyData("transaction-recurring", this._recurring);
    }
    get onFrequencyChange() {
        return this._onFrequencyChange.asEvent();
    }
    // Set amount var with currently selected amount
    load() {
        var _a;
        this.frequency =
            ENGrid.getFieldValue("transaction.recurrfreq") ||
                sessionStorage.getItem("engrid-transaction-recurring-frequency") ||
                "onetime";
        const recurrField = ENGrid.getField("transaction.recurrpay");
        if (recurrField) {
            this.recurring = ENGrid.getFieldValue("transaction.recurrpay");
        }
        else if (ENGrid.checkNested(window.EngagingNetworks, "require", "_defined", "enjs", "getSupporterData")) {
            this.recurring =
                ((_a = window.EngagingNetworks.require._defined.enjs
                    .getSupporterData("recurrpay")) === null || _a === void 0 ? void 0 : _a.toLowerCase()) || "n";
        }
        // ENGrid.enParseDependencies();
    }
    // Force a new recurrency
    setRecurrency(recurr, dispatch = true) {
        // Run only if it is a Donation Page with a Recurrency
        if (!document.getElementsByName("transaction.recurrpay").length) {
            return;
        }
        // Set dispatch to be checked by the SET method
        this._dispatch = dispatch;
        ENGrid.setFieldValue("transaction.recurrpay", recurr.toUpperCase());
        // Revert dispatch to default value (true)
        this._dispatch = true;
    }
    // Force a new frequency
    setFrequency(freq, dispatch = true) {
        // Run only if it is a Donation Page with a Frequency
        if (!document.getElementsByName("transaction.recurrfreq").length) {
            return;
        }
        // Set dispatch to be checked by the SET method
        this._dispatch = dispatch;
        // Search for the current amount on radio boxes
        let found = Array.from(document.querySelectorAll('input[name="transaction.recurrfreq"]')).filter((el) => el instanceof HTMLInputElement && el.value == freq.toUpperCase());
        // We found the amount on the radio boxes, so check it
        if (found.length) {
            const freqField = found[0];
            freqField.checked = true;
            this.frequency = freq.toLowerCase();
            if (this.frequency === "onetime") {
                this.setRecurrency("N", dispatch);
            }
            else {
                this.setRecurrency("Y", dispatch);
            }
        }
        // Revert dispatch to default value (true)
        this._dispatch = true;
    }
}
