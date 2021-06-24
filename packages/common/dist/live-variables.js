import { DonationAmount, EnForm, DonationFrequency, ProcessingFees } from "./events";
import { ENGrid, OptionsDefaults } from './';
export class LiveVariables {
    constructor(options) {
        var _a;
        this._amount = DonationAmount.getInstance();
        this._fees = ProcessingFees.getInstance();
        this._frequency = DonationFrequency.getInstance();
        this._form = EnForm.getInstance();
        this.multiplier = 1 / 12;
        this.options = Object.assign(Object.assign({}, OptionsDefaults), options);
        this.submitLabel = ((_a = document.querySelector(".en__submit button")) === null || _a === void 0 ? void 0 : _a.innerHTML) || "Donate";
        this._amount.onAmountChange.subscribe(() => this.changeSubmitButton());
        this._amount.onAmountChange.subscribe(() => this.changeLiveAmount());
        this._amount.onAmountChange.subscribe(() => this.changeLiveUpsellAmount());
        this._fees.onFeeChange.subscribe(() => this.changeLiveAmount());
        this._fees.onFeeChange.subscribe(() => this.changeLiveUpsellAmount());
        this._fees.onFeeChange.subscribe(() => this.changeSubmitButton());
        this._frequency.onFrequencyChange.subscribe(() => this.swapAmounts());
        this._frequency.onFrequencyChange.subscribe(() => this.changeLiveFrequency());
        this._frequency.onFrequencyChange.subscribe(() => this.changeRecurrency());
        this._frequency.onFrequencyChange.subscribe(() => this.changeSubmitButton());
        this._form.onSubmit.subscribe(() => this.loadingSubmitButton());
        this._form.onError.subscribe(() => this.changeSubmitButton());
        // Watch the monthly-upsell links
        document.addEventListener("click", (e) => {
            const element = e.target;
            if (element) {
                if (element.classList.contains("monthly-upsell")) {
                    this.upsold(e);
                }
                else if (element.classList.contains("form-submit")) {
                    e.preventDefault();
                    this._form.submitForm();
                }
            }
        });
    }
    getAmountTxt(amount = 0) {
        var _a, _b;
        const symbol = (_a = this.options.CurrencySymbol) !== null && _a !== void 0 ? _a : '$';
        const separator = (_b = this.options.CurrencySeparator) !== null && _b !== void 0 ? _b : '.';
        const amountTxt = Number.isInteger(amount)
            ? symbol + amount
            : symbol + amount.toFixed(2).replace('.', separator);
        return amount > 0 ? amountTxt : "";
    }
    getUpsellAmountTxt(amount = 0) {
        const amountTxt = this.options.CurrencySymbol + Math.ceil(amount / 5) * 5;
        return amount > 0 ? amountTxt : "";
    }
    getUpsellAmountRaw(amount = 0) {
        const amountRaw = Math.ceil(amount / 5) * 5;
        return amount > 0 ? amountRaw.toString() : "";
    }
    changeSubmitButton() {
        const submit = document.querySelector(".en__submit button");
        const amount = this.getAmountTxt(this._amount.amount + this._fees.fee);
        const frequency = this._frequency.frequency == "onetime" ? "" : this._frequency.frequency == "annual" ? "annually" : this._frequency.frequency;
        let label = this.submitLabel;
        if (amount) {
            label = label.replace("$AMOUNT", amount);
            label = label.replace("$FREQUENCY", frequency);
        }
        else {
            label = label.replace("$AMOUNT", '');
            label = label.replace("$FREQUENCY", '');
        }
        if (submit && label) {
            submit.innerHTML = label;
        }
    }
    loadingSubmitButton() {
        const submit = document.querySelector(".en__submit button");
        let submitButtonOriginalHTML = submit.innerHTML;
        let submitButtonProcessingHTML = "<span class='loader-wrapper'><span class='loader loader-quart'></span><span class='submit-button-text-wrapper'>" +
            submitButtonOriginalHTML +
            "</span></span>";
        submitButtonOriginalHTML = submit.innerHTML;
        submit.innerHTML = submitButtonProcessingHTML;
        return true;
    }
    changeLiveAmount() {
        const value = this._amount.amount + this._fees.fee;
        const live_amount = document.querySelectorAll(".live-giving-amount");
        live_amount.forEach(elem => (elem.innerHTML = this.getAmountTxt(value)));
    }
    changeLiveUpsellAmount() {
        const value = (this._amount.amount + this._fees.fee) * this.multiplier;
        const live_upsell_amount = document.querySelectorAll(".live-giving-upsell-amount");
        live_upsell_amount.forEach(elem => (elem.innerHTML = this.getUpsellAmountTxt(value)));
        const live_upsell_amount_raw = document.querySelectorAll(".live-giving-upsell-amount-raw");
        live_upsell_amount_raw.forEach(elem => (elem.innerHTML = this.getUpsellAmountRaw(value)));
    }
    changeLiveFrequency() {
        const live_frequency = document.querySelectorAll(".live-giving-frequency");
        live_frequency.forEach(elem => (elem.innerHTML =
            this._frequency.frequency == "onetime" ? "" : this._frequency.frequency));
    }
    changeRecurrency() {
        const recurrpay = document.querySelector("[name='transaction.recurrpay']");
        if (recurrpay && recurrpay.type != 'radio') {
            recurrpay.value = this._frequency.frequency == 'onetime' ? 'N' : 'Y';
            this._frequency.recurring = recurrpay.value;
            if (ENGrid.getOption('Debug'))
                console.log('Recurpay Changed!');
        }
    }
    swapAmounts() {
        if ("EngridAmounts" in window && this._frequency.frequency in window.EngridAmounts) {
            const loadEnAmounts = (amountArray) => {
                let ret = [];
                for (let amount in amountArray.amounts) {
                    ret.push({ selected: amountArray.amounts[amount] === amountArray.default, label: amount, value: amountArray.amounts[amount].toString() });
                }
                return ret;
            };
            window.EngagingNetworks.require._defined.enjs.swapList("donationAmt", loadEnAmounts(window.EngridAmounts[this._frequency.frequency]), { ignoreCurrentValue: !window.EngagingNetworks.require._defined.enjs.checkSubmissionFailed() });
            this._amount.load();
            if (ENGrid.getOption('Debug'))
                console.log("Amounts Swapped To", window.EngridAmounts[this._frequency.frequency]);
        }
    }
    // Watch for a clicks on monthly-upsell link
    upsold(e) {
        // Find and select monthly giving
        const enFieldRecurrpay = document.querySelector(".en__field--recurrpay input[value='Y']");
        if (enFieldRecurrpay) {
            enFieldRecurrpay.checked = true;
        }
        // Find the hidden radio select that needs to be selected when entering an "Other" amount
        const enFieldOtherAmountRadio = document.querySelector(".en__field--donationAmt input[value='other']");
        if (enFieldOtherAmountRadio) {
            enFieldOtherAmountRadio.checked = true;
        }
        // Enter the other amount and remove the "en__field__item--hidden" class from the input's parent
        const enFieldOtherAmount = document.querySelector("input[name='transaction.donationAmt.other']");
        if (enFieldOtherAmount) {
            enFieldOtherAmount.value = this.getUpsellAmountRaw(this._amount.amount * this.multiplier);
            this._amount.load();
            this._frequency.load();
            if (enFieldOtherAmount.parentElement) {
                enFieldOtherAmount.parentElement.classList.remove("en__field__item--hidden");
            }
        }
        const target = e.target;
        if (target && target.classList.contains("form-submit")) {
            e.preventDefault();
            // Form submit
            this._form.submitForm();
        }
    }
}
