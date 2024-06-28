import { ENGrid, EngridLogger, DonationFrequency } from "./";
export class GiveBySelect {
    constructor() {
        this.logger = new EngridLogger("GiveBySelect", "#FFF", "#333", "🐇");
        this.transactionGiveBySelect = document.getElementsByName("transaction.giveBySelect");
        this.paymentTypeField = document.querySelector("select[name='transaction.paymenttype']");
        this._frequency = DonationFrequency.getInstance();
        if (!this.transactionGiveBySelect)
            return;
        this._frequency.onFrequencyChange.subscribe(() => this.checkPaymentTypeVisibility());
        this.transactionGiveBySelect.forEach((giveBySelect) => {
            giveBySelect.addEventListener("change", () => {
                this.logger.log("Changed to " + giveBySelect.value);
                ENGrid.setPaymentType(giveBySelect.value);
            });
        });
        // Set the initial value of giveBySelect to the transaction.paymenttype field
        const paymentType = ENGrid.getPaymentType();
        if (paymentType) {
            this.logger.log("Setting giveBySelect to " + paymentType);
            const isCard = [
                "card",
                "visa",
                "mastercard",
                "amex",
                "discover",
                "diners",
                "jcb",
                "vi",
                "mc",
                "ax",
                "dc",
                "di",
                "jc",
            ].includes(paymentType.toLowerCase());
            this.transactionGiveBySelect.forEach((giveBySelect) => {
                if (isCard && giveBySelect.value.toLowerCase() === "card") {
                    giveBySelect.checked = true;
                }
                else if (giveBySelect.value.toLowerCase() === paymentType.toLowerCase()) {
                    giveBySelect.checked = true;
                }
            });
        }
    }
    // Returns true if the selected payment type is visible
    // Returns false if the selected payment type is not visible
    isSelectedPaymentVisible() {
        let visible = true;
        this.transactionGiveBySelect.forEach((giveBySelect) => {
            const container = giveBySelect.closest(".en__field--giveBySelect");
            if (giveBySelect.checked && !ENGrid.isVisible(container)) {
                this.logger.log(`Selected Payment Type is not visible: ${giveBySelect.value}`);
                visible = false;
            }
        });
        return visible;
    }
    // Checks if the selected payment type is visible
    // If the selected payment type is not visible, it sets the payment type to the first visible option
    checkPaymentTypeVisibility() {
        window.setTimeout(() => {
            var _a;
            if (!this.isSelectedPaymentVisible()) {
                this.logger.log("Setting payment type to first visible option");
                const firstVisible = Array.from(this.transactionGiveBySelect).find((giveBySelect) => {
                    const container = giveBySelect.closest(".en__field--giveBySelect");
                    return ENGrid.isVisible(container);
                });
                if (firstVisible) {
                    this.logger.log("Setting payment type to ", firstVisible.value);
                    const container = firstVisible.closest(".en__field--giveBySelect");
                    (_a = container.querySelector("label")) === null || _a === void 0 ? void 0 : _a.click();
                    ENGrid.setPaymentType(firstVisible.value);
                }
            }
            else {
                this.logger.log("Selected Payment Type is visible");
            }
        }, 300);
    }
}
