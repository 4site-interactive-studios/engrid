// This script adds an erros message to the page if the amount is greater than the max amount or less than the min amount.
import { DonationAmount, DonationFrequency, EnForm, ENGrid, EngridLogger, } from ".";
export class MinMaxAmount {
    constructor() {
        var _a, _b;
        this._form = EnForm.getInstance();
        this._amount = DonationAmount.getInstance();
        this._frequency = DonationFrequency.getInstance();
        this.minAmount = (_a = ENGrid.getOption("MinAmount")) !== null && _a !== void 0 ? _a : 1;
        this.maxAmount = (_b = ENGrid.getOption("MaxAmount")) !== null && _b !== void 0 ? _b : 100000;
        this.minAmountMessage = ENGrid.getOption("MinAmountMessage");
        this.maxAmountMessage = ENGrid.getOption("MaxAmountMessage");
        this.enAmountValidator = null;
        this.logger = new EngridLogger("MinMaxAmount", "white", "purple", "🔢");
        if (!this.shouldRun()) {
            // If we're not on a Donation Page, get out
            return;
        }
        this.setValidationConfigFromEN();
        this._amount.onAmountChange.subscribe((s) => window.setTimeout(this.liveValidate.bind(this), 1000) // Wait 1 second for the amount to be updated
        );
        this._form.onValidate.subscribe(this.enOnValidate.bind(this));
    }
    // Should we run the script?
    shouldRun() {
        return ENGrid.getPageType() === "DONATION";
    }
    // Don't submit the form if the amount is not valid
    enOnValidate() {
        if (!this._form.validate)
            return;
        const otherAmount = document.querySelector("[name='transaction.donationAmt.other']");
        if (this._amount.amount < this.minAmount) {
            this.logger.log("Amount is less than min amount: " + this.minAmount);
            if (otherAmount) {
                otherAmount.focus();
            }
            this._form.validate = false;
        }
        else if (this._amount.amount > this.maxAmount) {
            this.logger.log("Amount is greater than max amount: " + this.maxAmount);
            if (otherAmount) {
                otherAmount.focus();
            }
            this._form.validate = false;
        }
        window.setTimeout(this.liveValidate.bind(this), 300);
    }
    // Disable Submit Button if the amount is not valid
    liveValidate() {
        const amount = ENGrid.cleanAmount(this._amount.amount.toString());
        const activeElement = document.activeElement;
        if (activeElement &&
            activeElement.tagName === "INPUT" &&
            "name" in activeElement &&
            activeElement.name === "transaction.donationAmt.other" &&
            amount === 0) {
            // Don't validate if the other amount has focus and the amount is 0
            return;
        }
        this.logger.log(`Amount: ${amount}`);
        if (amount < this.minAmount) {
            this.logger.log("Amount is less than min amount: " + this.minAmount);
            ENGrid.setError(".en__field--withOther", this.minAmountMessage || "Invalid Amount");
        }
        else if (amount > this.maxAmount) {
            this.logger.log("Amount is greater than max amount: " + this.maxAmount);
            ENGrid.setError(".en__field--withOther", this.maxAmountMessage || "Invalid Amount");
        }
        else {
            ENGrid.removeError(".en__field--withOther");
        }
    }
    updateFamntRange(freq) {
        if (!this.enAmountValidator || !this.enAmountValidator.format)
            return;
        // In the validator, "onetime" is written as "SINGLE"
        // Validator format for FAMNT is like SINGLE:10~100000|MONTHLY:5~100000|QUARTERLY:25~100000|ANNUAL:25~100000
        const frequency = freq === "onetime" ? "SINGLE" : freq.toUpperCase();
        const validationRange = this.enAmountValidator.format
            .split("|")
            .find((range) => range.startsWith(frequency));
        if (!validationRange) {
            this.logger.log(`No validation range found for frequency: ${frequency}`);
            return;
        }
        const amounts = validationRange.split(":")[1].split("~");
        this.minAmount = Number(amounts[0]);
        this.maxAmount = Number(amounts[1]);
        this.minAmountMessage = this.enAmountValidator.errorMessage;
        this.maxAmountMessage = this.enAmountValidator.errorMessage;
        this.logger.log(`Frequency changed to ${frequency}, updating min and max amounts`, validationRange);
        this.logger.log(`Setting new values - Min Amount: ${this.minAmount}, Max Amount: ${this.maxAmount}, Error Message: ${this.minAmountMessage}`);
    }
    setValidationConfigFromEN() {
        if (!ENGrid.getOption("UseAmountValidatorFromEN") ||
            !window.EngagingNetworks.validators) {
            this.logger.log("Not setting validation config from EN.");
            return;
        }
        // Find the amount validator for the donation amount field
        // It should be of type "AMNT" or "FAMNT" and have
        // a componentId that matches the donation amount field.
        this.enAmountValidator = window.EngagingNetworks.validators.find((validator) => {
            var _a;
            return ((validator.type === "FAMNT" || validator.type === "AMNT") &&
                ((_a = document
                    .querySelector(".en__field--" + validator.componentId)) === null || _a === void 0 ? void 0 : _a.classList.contains("en__field--donationAmt")));
        });
        if (!this.enAmountValidator || !this.enAmountValidator.format) {
            return;
        }
        this.logger.log(`Detected an amount validator for donation amount on the page:`, this.enAmountValidator);
        // Static amount validator
        if (this.enAmountValidator.type === "AMNT") {
            this.minAmount = Number(this.enAmountValidator.format.split("~")[0]);
            this.maxAmount = Number(this.enAmountValidator.format.split("~")[1]);
            this.minAmountMessage = this.enAmountValidator.errorMessage;
            this.maxAmountMessage = this.enAmountValidator.errorMessage;
            this.logger.log(`Setting new values - Min Amount: ${this.minAmount}, Max Amount: ${this.maxAmount}, Error Message: ${this.minAmountMessage}`);
        }
        // Frequency-based amount validator
        if (this.enAmountValidator.type === "FAMNT") {
            this._frequency.onFrequencyChange.subscribe((freq) => {
                this.updateFamntRange(freq);
            });
            this.updateFamntRange(this._frequency.frequency);
        }
    }
}
