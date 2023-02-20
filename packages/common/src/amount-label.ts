// This script checks if the donations amounts are numbers and if they are, appends the correct currency symbol
import { DonationFrequency, ENGrid } from "./";
export class AmountLabel {
  private _frequency: DonationFrequency = DonationFrequency.getInstance();
  constructor() {
    if (!this.shouldRun()) {
      // If we're not on a Donation Page, get out
      return;
    }
    this._frequency.onFrequencyChange.subscribe((s) =>
      window.setTimeout(this.fixAmountLabels.bind(this), 100)
    );
    // Run the main function on page load so we can analyze the amounts of the current frequency
    window.setTimeout(this.fixAmountLabels.bind(this), 300);
  }
  // Should we run the script?
  shouldRun() {
    return !!(
      ENGrid.getPageType() === "DONATION" &&
      ENGrid.getOption("AddCurrencySymbol")
    );
  }

  // Fix Amount Labels
  fixAmountLabels() {
    let amounts = document.querySelectorAll(
      ".en__field--donationAmt label"
    ) as NodeListOf<HTMLLabelElement>;
    const currencySymbol = ENGrid.getCurrencySymbol() || "";
    amounts.forEach((element) => {
      if (!isNaN(element.innerText as any)) {
        element.innerText = currencySymbol + element.innerText;
      }
    });
  }
}
