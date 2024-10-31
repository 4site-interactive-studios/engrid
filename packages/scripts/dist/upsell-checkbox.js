// This component will add a checkbox to the donation form that will allow the user to upgrade their donation to a monthly donation.
import { ENGrid, EngridLogger, ProcessingFees, UpsellOptionsDefaults, DataLayer, } from ".";
import { DonationAmount, DonationFrequency } from "./events";
export class UpsellCheckbox {
    constructor() {
        this.checkboxOptions = false;
        this.checkboxOptionsDefaults = {
            label: "Make my gift a monthly gift of <strong>{new-amount}/mo</strong>",
            location: "before .en__component .en__submit",
            cssClass: "",
        };
        this._amount = DonationAmount.getInstance();
        this._fees = ProcessingFees.getInstance();
        this._frequency = DonationFrequency.getInstance();
        this._dataLayer = DataLayer.getInstance();
        this.checkboxContainer = null;
        this.oldAmount = 0;
        this.oldFrequency = "one-time";
        this.resetCheckbox = false;
        this.logger = new EngridLogger("UpsellCheckbox", "black", "LemonChiffon", "✅");
        let options = "EngridUpsell" in window ? window.EngridUpsell : {};
        this.options = Object.assign(Object.assign({}, UpsellOptionsDefaults), options);
        if (this.options.upsellCheckbox === false) {
            this.logger.log("Skipped");
            return;
        }
        // To avoid using both UpsellLightbox and UpsellCheckbox at the same time, set window.EngridUpsell.skipUpsell to true if there's an upsellCheckbox
        if ("upsellCheckbox" in options && options.upsellCheckbox !== false) {
            window.EngridUpsell.skipUpsell = true; // Skip the upsell lightbox
        }
        this.checkboxOptions = Object.assign(Object.assign({}, this.checkboxOptionsDefaults), this.options.upsellCheckbox);
        if (!this.shouldRun()) {
            this.logger.log("should NOT run");
            // If we're not on a Donation Page, get out
            return;
        }
        this.renderCheckbox();
        this.updateLiveData();
        this._frequency.onFrequencyChange.subscribe(() => this.updateLiveData());
        this._frequency.onFrequencyChange.subscribe(() => this.resetUpsellCheckbox());
        this._amount.onAmountChange.subscribe(() => this.updateLiveData());
        this._amount.onAmountChange.subscribe(() => this.resetUpsellCheckbox());
        this._fees.onFeeChange.subscribe(() => this.updateLiveData());
    }
    updateLiveData() {
        this.liveAmounts();
        this.liveFrequency();
    }
    resetUpsellCheckbox() {
        var _a, _b;
        // Only reset the upsell checkbox if it has been checked
        if (!this.resetCheckbox)
            return;
        this.logger.log("Reset");
        // Uncheck the upsell checkbox
        const checkbox = (_a = this.checkboxContainer) === null || _a === void 0 ? void 0 : _a.querySelector("#upsellCheckbox");
        if (checkbox) {
            checkbox.checked = false;
        }
        // Hide the upsell checkbox
        (_b = this.checkboxContainer) === null || _b === void 0 ? void 0 : _b.classList.add("recurring-frequency-y-hide");
        this.oldAmount = 0;
        this.oldFrequency = "one-time";
        this.resetCheckbox = false;
    }
    renderCheckbox() {
        if (this.checkboxOptions === false)
            return;
        const label = this.checkboxOptions.label
            .replace("{new-amount}", " <span class='upsell_suggestion'></span>")
            .replace("{old-amount}", " <span class='upsell_amount'></span>")
            .replace("{old-frequency}", " <span class='upsell_frequency'></span>");
        const formBlock = document.createElement("div");
        formBlock.classList.add("en__component", "en__component--formblock", "recurring-frequency-y-hide", "engrid-upsell-checkbox");
        if (this.checkboxOptions.cssClass)
            formBlock.classList.add(this.checkboxOptions.cssClass);
        formBlock.innerHTML = `
    <div class="en__field en__field--checkbox">
      <div class="en__field__element en__field__element--checkbox">
        <div class="en__field__item">
            <input type="checkbox" class="en__field__input en__field__input--checkbox" name="upsellCheckbox" id="upsellCheckbox" value="Y">
            <label class="en__field__label en__field__label--item" for="upsellCheckbox" style="gap: 0.5ch">${label}</label>
        </div>
      </div>
    </div>`;
        const checkbox = formBlock.querySelector("#upsellCheckbox");
        if (checkbox)
            checkbox.addEventListener("change", this.toggleCheck.bind(this));
        const position = this.checkboxOptions.location.split(" ")[0];
        // Location is everything after the first space
        const location = this.checkboxOptions.location
            .split(" ")
            .slice(1)
            .join(" ")
            .trim();
        const target = document.querySelector(location);
        this.checkboxContainer = formBlock;
        if (target) {
            if (position === "before") {
                this.logger.log("rendered before");
                target.before(formBlock);
            }
            else {
                this.logger.log("rendered after");
                target.after(formBlock);
            }
        }
        else {
            this.logger.error("could not render - target not found");
        }
    }
    // Should we run the script?
    shouldRun() {
        // if it's a first page of a Donation page
        return ENGrid.getPageNumber() === 1 && ENGrid.getPageType() === "DONATION";
    }
    showCheckbox() {
        if (this.checkboxContainer)
            this.checkboxContainer.classList.remove("hide");
    }
    hideCheckbox() {
        if (this.checkboxContainer)
            this.checkboxContainer.classList.add("hide");
    }
    liveAmounts() {
        // Only update live data if the current frequency is one-time
        if (this._frequency.frequency !== "onetime")
            return;
        const live_upsell_amount = document.querySelectorAll(".upsell_suggestion");
        const live_amount = document.querySelectorAll(".upsell_amount");
        const upsellAmount = this.getUpsellAmount();
        const suggestedAmount = upsellAmount + this._fees.calculateFees(upsellAmount);
        if (suggestedAmount > 0) {
            this.showCheckbox();
        }
        else {
            this.hideCheckbox();
        }
        live_upsell_amount.forEach((elem) => (elem.innerHTML = this.getAmountTxt(suggestedAmount)));
        live_amount.forEach((elem) => (elem.innerHTML = this.getAmountTxt(this._amount.amount + this._fees.fee)));
    }
    liveFrequency() {
        const live_upsell_frequency = document.querySelectorAll(".upsell_frequency");
        live_upsell_frequency.forEach((elem) => (elem.innerHTML = this.getFrequencyTxt()));
    }
    // Return the Suggested Upsell Amount
    getUpsellAmount() {
        const amount = this._amount.amount;
        let upsellAmount = 0;
        for (let i = 0; i < this.options.amountRange.length; i++) {
            let val = this.options.amountRange[i];
            if (upsellAmount == 0 && amount <= val.max) {
                upsellAmount = val.suggestion;
                if (upsellAmount === 0)
                    return 0;
                if (typeof upsellAmount !== "number") {
                    const suggestionMath = upsellAmount.replace("amount", amount.toFixed(2));
                    upsellAmount = parseFloat(Function('"use strict";return (' + suggestionMath + ")")());
                }
                break;
            }
        }
        return upsellAmount > this.options.minAmount
            ? upsellAmount
            : this.options.minAmount;
    }
    // Proceed to the next page (upsold or not)
    toggleCheck(e) {
        var _a, _b;
        e.preventDefault();
        if (e.target.checked) {
            this.logger.success("Upsold");
            const upsoldAmount = this.getUpsellAmount();
            const originalAmount = this._amount.amount;
            this.oldAmount = originalAmount;
            this.oldFrequency = this._frequency.frequency;
            // If we're checking the upsell checkbox, remove the class that hides it on different frequencies
            (_a = this.checkboxContainer) === null || _a === void 0 ? void 0 : _a.classList.remove("recurring-frequency-y-hide");
            this._frequency.setFrequency("monthly");
            this._amount.setAmount(upsoldAmount);
            this._dataLayer.addEndOfGiftProcessEvent("ENGRID_UPSELL_CHECKBOX", {
                eventValue: true,
                originalAmount: originalAmount,
                upsoldAmount: upsoldAmount,
                frequency: "monthly",
            });
            this._dataLayer.addEndOfGiftProcessVariable("ENGRID_UPSELL_CHECKBOX", true);
            this._dataLayer.addEndOfGiftProcessVariable("ENGRID_UPSELL_ORIGINAL_AMOUNT", originalAmount);
            this._dataLayer.addEndOfGiftProcessVariable("ENGRID_UPSELL_DONATION_FREQUENCY", "MONTHLY");
            this.renderConversionField("upsellSuccess", "onetime", originalAmount, "monthly", upsoldAmount, "monthly", upsoldAmount);
            // Set the resetCheckbox flag to true so it will reset if the user changes the amount or frequency
            window.setTimeout(() => {
                this.resetCheckbox = true;
            }, 500);
        }
        else {
            this.resetCheckbox = false;
            this.logger.success("Not Upsold");
            this._amount.setAmount(this.oldAmount);
            this._frequency.setFrequency(this.oldFrequency);
            (_b = this.checkboxContainer) === null || _b === void 0 ? void 0 : _b.classList.add("recurring-frequency-y-hide");
            this._dataLayer.addEndOfGiftProcessVariable("ENGRID_UPSELL_CHECKBOX", false);
            this._dataLayer.addEndOfGiftProcessVariable("ENGRID_UPSELL_DONATION_FREQUENCY", "ONE-TIME");
            this.renderConversionField("upsellFail", this._frequency.frequency, this._amount.amount, "monthly", this._amount.amount, this._frequency.frequency, this._amount.amount);
        }
    }
    getAmountTxt(amount = 0) {
        var _a, _b, _c, _d;
        const symbol = (_a = ENGrid.getCurrencySymbol()) !== null && _a !== void 0 ? _a : "$";
        const dec_separator = (_b = ENGrid.getOption("DecimalSeparator")) !== null && _b !== void 0 ? _b : ".";
        const thousands_separator = (_c = ENGrid.getOption("ThousandsSeparator")) !== null && _c !== void 0 ? _c : "";
        const dec_places = amount % 1 == 0 ? 0 : (_d = ENGrid.getOption("DecimalPlaces")) !== null && _d !== void 0 ? _d : 2;
        const amountTxt = ENGrid.formatNumber(amount, dec_places, dec_separator, thousands_separator);
        return amount > 0 ? symbol + amountTxt : "";
    }
    getFrequencyTxt() {
        const freqTxt = {
            onetime: "one-time",
            monthly: "monthly",
            annual: "annual",
        };
        const frequency = this._frequency.frequency;
        return frequency in freqTxt ? freqTxt[frequency] : frequency;
    }
    renderConversionField(event, // The event that triggered the conversion
    freq, // The frequency of the donation (onetime, monthly, annual)
    amt, // The original amount of the donation (before the upsell)
    sugFreq, // The suggested frequency of the upsell (monthly)
    sugAmt, // The suggested amount of the upsell
    subFreq, // The submitted frequency of the upsell (onetime, monthly, annual)
    subAmt // The submitted amount of the upsell
    ) {
        if (this.options.conversionField === "")
            return;
        const conversionField = document.querySelector("input[name='" + this.options.conversionField + "']") ||
            ENGrid.createHiddenInput(this.options.conversionField);
        if (!conversionField) {
            this.logger.error("Could not find or create the conversion field");
            return;
        }
        const conversionValue = `event:${event},freq:${freq},amt:${amt},sugFreq:${sugFreq},sugAmt:${sugAmt},subFreq:${subFreq},subAmt:${subAmt}`;
        conversionField.value = conversionValue;
        this.logger.log(`Conversion Field ${event}`, conversionValue);
    }
}
