// This class automatically select other radio input when an amount is entered into it.
import { EngridLogger, ENGrid, DonationAmount } from ".";
export class OtherAmount {
    constructor() {
        this.logger = new EngridLogger("OtherAmount", "green", "black", "💰");
        this._amount = DonationAmount.getInstance();
        "focusin input".split(" ").forEach((e) => {
            var _a;
            // We're attaching this event to the body because sometimes the other amount input is not in the DOM yet and comes via AJAX.
            (_a = document.querySelector("body")) === null || _a === void 0 ? void 0 : _a.addEventListener(e, (event) => {
                const target = event.target;
                if (target.classList.contains("en__field__input--other")) {
                    this.logger.log("Other Amount Field Focused");
                    this.setRadioInput();
                }
            });
        });
        const otherAmountField = document.querySelector("[name='transaction.donationAmt.other'");
        if (otherAmountField) {
            otherAmountField.setAttribute("inputmode", "decimal");
            // ADD THE MISSING LABEL FOR IMPROVED ACCESSABILITY
            otherAmountField.setAttribute("aria-label", "Enter your custom donation amount");
            otherAmountField.setAttribute("autocomplete", "off");
            otherAmountField.setAttribute("data-lpignore", "true");
            otherAmountField.addEventListener("change", (e) => {
                const target = e.target;
                const amount = target.value;
                const cleanAmount = ENGrid.cleanAmount(amount);
                if (amount !== cleanAmount.toString()) {
                    this.logger.log(`Other Amount Field Changed: ${amount} => ${cleanAmount}`);
                    if ("dataLayer" in window) {
                        window.dataLayer.push({
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
            otherAmountField.addEventListener("blur", (e) => {
                const target = e.target;
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
    setRadioInput() {
        const target = document.querySelector(".en__field--donationAmt .en__field__input--other");
        if (target && target.parentNode && target.parentNode.parentNode) {
            const targetWrapper = target.parentNode;
            targetWrapper.classList.remove("en__field__item--hidden");
            if (targetWrapper.parentNode) {
                const lastRadioInput = targetWrapper.parentNode.querySelector(".en__field__item:nth-last-child(2) input");
                lastRadioInput.checked = !0;
            }
        }
    }
}
