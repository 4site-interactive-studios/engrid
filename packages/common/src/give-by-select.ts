import { EngridLogger } from "./";

export class GiveBySelect {
  private logger: EngridLogger = new EngridLogger(
    "GiveBySelect",
    "#FFF",
    "#333",
    "🐇"
  );
  private enFieldGiveBySelect = document.querySelector(
    ".en__field--give-by-select"
  ) as HTMLElement;
  private transactionGiveBySelect = document.getElementsByName(
    "transaction.giveBySelect"
  ) as NodeListOf<HTMLInputElement>;

  constructor() {
    if (!this.enFieldGiveBySelect || !this.transactionGiveBySelect) return;
    this.transactionGiveBySelect.forEach((giveBySelect) => {
      giveBySelect.addEventListener("change", () => {
        this.logger.log("Changed to " + giveBySelect.value);
        this.watchGiveBySelect();
      });
    });
  }
  private watchGiveBySelect() {
    const enFieldPaymentType = document.querySelector(
      "#en__field_transaction_paymenttype"
    ) as HTMLSelectElement;
    const enFieldGiveBySelectCurrentValue = document.querySelector(
      'input[name="transaction.giveBySelect"]:checked'
    ) as HTMLInputElement;
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
          this.logger.log(
            `No match for ${enFieldGiveBySelectCurrentValue.value}`
          );
          break;
      }
      const event = new Event("change");
      enFieldPaymentType.dispatchEvent(event);
    }
  }
}
