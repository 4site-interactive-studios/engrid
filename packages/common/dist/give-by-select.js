import { EngridLogger } from "./";
export class GiveBySelect {
    constructor() {
        this.logger = new EngridLogger("GiveBySelect", "#FFF", "#333", "🐇");
        this.enFieldGiveBySelect = document.querySelector(".en__field--give-by-select");
        this.transactionGiveBySelect = document.getElementsByName("transaction.giveBySelect");
        if (!this.enFieldGiveBySelect || !this.transactionGiveBySelect)
            return;
        Array.from(this.transactionGiveBySelect).forEach((e) => {
            let element = e;
            element.addEventListener("change", () => {
                this.watchGiveBySelect();
            });
        });
    }
    watchGiveBySelect() {
        const enFieldPaymentType = document.querySelector("#en__field_transaction_paymenttype");
        const enFieldGiveBySelectCurrentValue = document.querySelector('input[name="transaction.giveBySelect"]:checked');
        if (enFieldGiveBySelectCurrentValue) {
            switch (enFieldGiveBySelectCurrentValue.value.toLowerCase()) {
                case "ach":
                    enFieldPaymentType.value = "ACH";
                    break;
                case "paypal":
                    enFieldPaymentType.value = "paypal";
                    break;
                case "applepay":
                    enFieldPaymentType.value = "applepay";
                    break;
                case "card":
                    enFieldPaymentType.value = "";
                    break;
                default:
                    this.logger.log(`No match for ${enFieldGiveBySelectCurrentValue.value}`);
                    break;
            }
            const event = new Event("change");
            enFieldPaymentType.dispatchEvent(event);
        }
    }
}
