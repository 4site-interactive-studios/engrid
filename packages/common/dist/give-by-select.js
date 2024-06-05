import { ENGrid, EngridLogger } from "./";
export class GiveBySelect {
    constructor() {
        this.logger = new EngridLogger("GiveBySelect", "#FFF", "#333", "🐇");
        this.transactionGiveBySelect = document.getElementsByName("transaction.giveBySelect");
        this.paymentTypeField = document.querySelector("select[name='transaction.paymenttype']");
        if (!this.transactionGiveBySelect)
            return;
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
}
