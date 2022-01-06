// This class automatically select other radio input when an amount is entered into it.
export class OtherAmount {
    constructor() {
        this.otherAmountField = document.querySelector(".en__field__input--other");
        if (this.otherAmountField) {
            "focus input".split(" ").forEach((e) => {
                var _a;
                (_a = document.querySelector("body")) === null || _a === void 0 ? void 0 : _a.addEventListener(e, (event) => {
                    if (event.target === this.otherAmountField) {
                        this.setRadioInput();
                    }
                });
            });
        }
    }
    setRadioInput() {
        const target = this.otherAmountField;
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
