// This script checks if the donations amounts are numbers and if they are, appends the correct currency symbol
import { DonationAmount, EnForm, ENGrid, EngridLogger } from "./";
export class MinMaxAmount {
    constructor() {
        var _a, _b;
        this._form = EnForm.getInstance();
        this._amount = DonationAmount.getInstance();
        this.minAmount = (_a = ENGrid.getOption("MinAmount")) !== null && _a !== void 0 ? _a : 1;
        this.maxAmount = (_b = ENGrid.getOption("MaxAmount")) !== null && _b !== void 0 ? _b : 100000;
        this.minAmountMessage = ENGrid.getOption("MinAmountMessage");
        this.maxAmountMessage = ENGrid.getOption("MaxAmountMessage");
        this.logger = new EngridLogger("MinMaxAmount", "white", "purple", "🔢");
        if (!this.shouldRun()) {
            // If we're not on a Donation Page, get out
            return;
        }
        this._amount.onAmountChange.subscribe(this.disableSubmitButton.bind(this));
        this._form.onValidate.subscribe(this.enOnValidate.bind(this));
    }
    // Should we run the script?
    shouldRun() {
        return ENGrid.getPageType() === "DONATION";
    }
    // Don't submit the form if the amount is not valid
    enOnValidate() {
        if (this._amount.amount < this.minAmount) {
            this.logger.log("Amount is less than min amount: " + this.minAmount);
            alert(this.minAmountMessage);
            return false;
        }
        else if (this._amount.amount > this.maxAmount) {
            this.logger.log("Amount is greater than max amount: " + this.maxAmount);
            alert(this.maxAmountMessage);
            return false;
        }
        return true;
    }
    // Disable Submit Button if the amount is not valid
    disableSubmitButton() {
        if (this._amount.amount < this.minAmount) {
            this.logger.log("Amount is less than min amount: " + this.minAmount);
            ENGrid.disableSubmit(this.minAmountMessage || "");
        }
        else if (this._amount.amount > this.maxAmount) {
            this.logger.log("Amount is greater than max amount: " + this.maxAmount);
            ENGrid.disableSubmit(this.maxAmountMessage || "");
        }
        else {
            ENGrid.enableSubmit();
        }
    }
}
