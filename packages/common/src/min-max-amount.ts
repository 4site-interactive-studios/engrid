// This script adds an erros message to the page if the amount is greater than the max amount or less than the min amount.
import { DonationAmount, EnForm, ENGrid, EngridLogger } from "./";
export class MinMaxAmount {
  private _form: EnForm = EnForm.getInstance();
  private _amount: DonationAmount = DonationAmount.getInstance();
  private minAmount: number = ENGrid.getOption("MinAmount") ?? 1;
  private maxAmount: number = ENGrid.getOption("MaxAmount") ?? 100000;
  private minAmountMessage = ENGrid.getOption("MinAmountMessage");
  private maxAmountMessage = ENGrid.getOption("MaxAmountMessage");
  private logger: EngridLogger = new EngridLogger(
    "MinMaxAmount",
    "white",
    "purple",
    "🔢"
  );
  constructor() {
    if (!this.shouldRun()) {
      // If we're not on a Donation Page, get out
      return;
    }
    this._amount.onAmountChange.subscribe(
      (s) => window.setTimeout(this.liveValidate.bind(this), 1000) // Wait 1 second for the amount to be updated
    );
    this._form.onValidate.subscribe(this.enOnValidate.bind(this));
  }
  // Should we run the script?
  shouldRun() {
    return ENGrid.getPageType() === "DONATION";
  }

  // Don't submit the form if the amount is not valid
  enOnValidate() {
    if (!this._form.validate) return;
    const otherAmount = document.querySelector(
      "[name='transaction.donationAmt.other']"
    ) as HTMLInputElement;
    if (this._amount.amount < this.minAmount) {
      this.logger.log("Amount is less than min amount: " + this.minAmount);
      if (otherAmount) {
        otherAmount.focus();
      }
      this._form.validate = false;
    } else if (this._amount.amount > this.maxAmount) {
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
    const activeElement = document.activeElement as HTMLInputElement;
    if (
      activeElement &&
      activeElement.tagName === "INPUT" &&
      "name" in activeElement &&
      activeElement.name === "transaction.donationAmt.other" &&
      amount === 0
    ) {
      // Don't validate if the other amount has focus and the amount is 0
      return;
    }
    this.logger.log(`Amount: ${amount}`);
    if (amount < this.minAmount) {
      this.logger.log("Amount is less than min amount: " + this.minAmount);
      ENGrid.setError(
        ".en__field--withOther",
        this.minAmountMessage || "Invalid Amount"
      );
    } else if (amount > this.maxAmount) {
      this.logger.log("Amount is greater than max amount: " + this.maxAmount);
      ENGrid.setError(
        ".en__field--withOther",
        this.maxAmountMessage || "Invalid Amount"
      );
    } else {
      ENGrid.removeError(".en__field--withOther");
    }
  }
}
