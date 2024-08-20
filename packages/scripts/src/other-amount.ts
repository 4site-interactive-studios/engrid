// This class automatically select other radio input when an amount is entered into it.

import { EngridLogger, ENGrid, DonationAmount } from ".";

export class OtherAmount {
  private logger: EngridLogger = new EngridLogger(
    "OtherAmount",
    "green",
    "black",
    "💰"
  );
  private _amount: DonationAmount = DonationAmount.getInstance();
  constructor() {
    "focusin input".split(" ").forEach((e) => {
      // We're attaching this event to the body because sometimes the other amount input is not in the DOM yet and comes via AJAX.
      document.querySelector("body")?.addEventListener(e, (event) => {
        const target = event.target as HTMLInputElement;
        if (target.classList.contains("en__field__input--other")) {
          this.logger.log("Other Amount Field Focused");
          this.setRadioInput();
        }
      });
    });
    const otherAmountField = document.querySelector(
      "[name='transaction.donationAmt.other'"
    ) as HTMLInputElement;
    if (otherAmountField) {
      otherAmountField.setAttribute("inputmode", "decimal");
      // ADD THE MISSING LABEL FOR IMPROVED ACCESSABILITY
      otherAmountField.setAttribute(
        "aria-label",
        "Enter your custom donation amount"
      );
      otherAmountField.setAttribute("autocomplete", "off");
      otherAmountField.setAttribute("data-lpignore", "true");
      otherAmountField.addEventListener("change", (e: Event) => {
        const target = e.target as HTMLInputElement;
        const amount = target.value;
        const cleanAmount = ENGrid.cleanAmount(amount);
        if (amount !== cleanAmount.toString()) {
          this.logger.log(
            `Other Amount Field Changed: ${amount} => ${cleanAmount}`
          );
          if ("dataLayer" in window) {
            (window as any).dataLayer.push({
              event: "otherAmountTransformed",
              otherAmountTransformation: `${amount} => ${cleanAmount}`,
            });
          }
          target.value =
            cleanAmount % 1 != 0
              ? cleanAmount.toFixed(2)
              : cleanAmount.toString();
        }
      });
      // On blur, if the amount is 0, select the previous amount
      otherAmountField.addEventListener("blur", (e: Event) => {
        const target = e.target as HTMLInputElement;
        const amount = target.value;
        const cleanAmount = ENGrid.cleanAmount(amount);
        if (cleanAmount === 0) {
          this.logger.log("Other Amount Field Blurred with 0 amount");
          // Get Live Amount
          const liveAmount = this._amount.amount;
          if (liveAmount > 0) {
            this._amount.setAmount(liveAmount, false);
          }
        }
      });
    }
  }

  private setRadioInput() {
    const target = document.querySelector(
      ".en__field--donationAmt .en__field__input--other"
    ) as HTMLInputElement;
    if (target && target.parentNode && target.parentNode.parentNode) {
      const targetWrapper = target.parentNode as HTMLElement;
      targetWrapper.classList.remove("en__field__item--hidden");
      if (targetWrapper.parentNode) {
        const lastRadioInput = targetWrapper.parentNode.querySelector(
          ".en__field__item:nth-last-child(2) input"
        ) as HTMLInputElement;
        lastRadioInput.checked = !0;
      }
    }
  }
}
