import { ENGrid, EngridLogger } from "./";
export class GiveBySelect {
    constructor() {
        this.logger = new EngridLogger("GiveBySelect", "#FFF", "#333", "🐇");
        this.enFieldGiveBySelect = document.querySelector(".en__field--give-by-select");
        this.transactionGiveBySelect = document.getElementsByName("transaction.giveBySelect");
        if (!this.enFieldGiveBySelect || !this.transactionGiveBySelect)
            return;
        this.transactionGiveBySelect.forEach((giveBySelect) => {
            giveBySelect.addEventListener("change", () => {
                this.logger.log("Changed to " + giveBySelect.value);
                if (giveBySelect.value.toLowerCase() === "card") {
                    ENGrid.setPaymentType("");
                }
                else {
                    ENGrid.setPaymentType(giveBySelect.value);
                }
            });
        });
        // Set the initial value of giveBySelect to the transaction.paymenttype field
        const paymentType = ENGrid.getPaymentType();
        if (paymentType) {
            this.logger.log("Setting giveBySelect to " + paymentType);
            const isCard = [
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
