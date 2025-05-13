import { ENGrid, FrequencyUpsellOptions, Modal } from ".";

export class FrequencyUpsellModal extends Modal {
  private readonly upsellOptions: FrequencyUpsellOptions;
  private _amount: number = 0;
  private _upsellAmount: number = 0;

  constructor(upsellOptions: FrequencyUpsellOptions) {
    super({
      onClickOutside: "bounce",
      addCloseButton: false,
      closeButtonLabel: "",
    });
    this.upsellOptions = upsellOptions;
    this.updateModalContent();
  }

  set amount(value: number) {
    this._amount = value;
  }

  set upsellAmount(value: number) {
    this._upsellAmount = value;
  }

  updateModalContent(): void {
    this.modalContent = this.getModalContent();
    const modalBody = this.modal?.querySelector(".engrid-modal__body");
    if (modalBody) {
      modalBody.innerHTML = "";
      modalBody.insertAdjacentHTML("beforeend", this.modalContent as string);
    }
  }

  getModalContent(): NodeListOf<Element> | HTMLElement | string {
    if (!this.upsellOptions) return "";

    return `
    <h2>${this.replaceAmountTokens(this.upsellOptions.content)}</h2>
    <div class="upsell-buttons">
      <button class="primary" id="frequency-upsell-yes">
        ${this.replaceAmountTokens(this.upsellOptions.yesButton)}
      </button>
      <button class="primary" id="frequency-upsell-no">
         ${this.replaceAmountTokens(this.upsellOptions.noButton)}
      </button>
    </div>
    `;
  }

  replaceAmountTokens(string: string): string {
    const amount = ENGrid.formatNumber(
      this._amount,
      this._amount % 1 == 0 ? 0 : 2,
      ".",
      ""
    );
    const upsellAmount = ENGrid.formatNumber(
      this._upsellAmount,
      this._upsellAmount % 1 == 0 ? 0 : 2,
      ".",
      ""
    );
    return string
      .replace(/{current_amount}/g, amount)
      .replace(/{upsell_amount}/g, upsellAmount);
  }
}
