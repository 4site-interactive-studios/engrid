import { ENGrid, EngridLogger, DonationFrequency } from ".";

export class GiveBySelect {
  private logger: EngridLogger = new EngridLogger(
    "GiveBySelect",
    "#FFF",
    "#333",
    "🐇"
  );
  private transactionGiveBySelect = document.getElementsByName(
    "transaction.giveBySelect"
  ) as NodeListOf<HTMLInputElement>;
  private paymentTypeField = document.querySelector(
    "select[name='transaction.paymenttype']"
  ) as HTMLSelectElement;
  private _frequency: DonationFrequency = DonationFrequency.getInstance();

  constructor() {
    if (!this.transactionGiveBySelect) return;
    this._frequency.onFrequencyChange.subscribe(() =>
      this.checkPaymentTypeVisibility()
    );
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
        } else if (
          giveBySelect.value.toLowerCase() === paymentType.toLowerCase()
        ) {
          giveBySelect.checked = true;
        }
      });
    }
  }
  // Returns true if the selected payment type is visible
  // Returns false if the selected payment type is not visible
  isSelectedPaymentVisible(): boolean {
    let visible = true;
    this.transactionGiveBySelect.forEach((giveBySelect) => {
      const container = giveBySelect.parentElement as HTMLDivElement;
      if (giveBySelect.checked && !ENGrid.isVisible(container)) {
        this.logger.log(
          `Selected Payment Type is not visible: ${giveBySelect.value}`
        );
        visible = false;
      }
    });
    return visible;
  }
  // Checks if the selected payment type is visible
  // If the selected payment type is not visible, it sets the payment type to the first visible option
  checkPaymentTypeVisibility() {
    window.setTimeout(() => {
      if (!this.isSelectedPaymentVisible()) {
        this.logger.log("Setting payment type to first visible option");
        const firstVisible = Array.from(this.transactionGiveBySelect).find(
          (giveBySelect) => {
            const container = giveBySelect.parentElement as HTMLDivElement;
            return ENGrid.isVisible(container);
          }
        );
        if (firstVisible) {
          this.logger.log("Setting payment type to ", firstVisible.value);
          const container = firstVisible.parentElement as HTMLDivElement;
          container.querySelector("label")?.click();
          ENGrid.setPaymentType(firstVisible.value);
        }
      } else {
        this.logger.log("Selected Payment Type is visible");
      }
    }, 300);
  }
}
