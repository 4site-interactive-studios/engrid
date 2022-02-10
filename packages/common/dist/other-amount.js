// This class automatically select other radio input when an amount is entered into it.
import { EngridLogger } from ".";
export class OtherAmount {
    constructor() {
        this.logger = new EngridLogger("OtherAmount", "green", "black", "💰");
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