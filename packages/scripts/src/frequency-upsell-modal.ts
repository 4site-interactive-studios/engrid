/*
 * FrequencyUpsellModal - this is class that creates the modal for the frequency upsell.
 * This component is intentionally "dumb" and only creates the modal renders its content.
 * Logic for showing the modal and handling the upsell is in the FrequencyUpsell class.
 */
import { ENGrid, FrequencyUpsellOptions, Modal } from ".";

export class FrequencyUpsellModal extends Modal {
  private readonly upsellOptions: FrequencyUpsellOptions;
  private _amountWithFees: number = 0;
  private _upsellAmountWithFees: number = 0;

  constructor(upsellOptions: FrequencyUpsellOptions) {
    super({
      onClickOutside: "bounce",
      customClass: `engrid--frequency-upsell-modal ${upsellOptions.customClass}`,
      showCloseX: false,
    });
    this.upsellOptions = upsellOptions;
    this.updateModalContent();
  }

  set amountWithFees(value: number) {
    this._amountWithFees = value;
  }

  set upsellAmountWithFees(value: number) {
    this._upsellAmountWithFees = value;
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
    <div class="frequency-upsell-modal__secondary-content"></div>
    <div class="frequency-upsell-modal__content">
      <div class="frequency-upsell-modal__text">
        <h2 class="frequency-upsell-modal__title">${this.replaceAmountTokens(
          this.upsellOptions.title
        )}</h2>
        <p class="frequency-upsell-modal__para">${this.replaceAmountTokens(
          this.upsellOptions.paragraph
        )}</p>
      </div>
      <div class="frequency-upsell-modal__buttons">
        <button class="primary frequency-upsell-modal__button" id="frequency-upsell-yes">
          ${this.replaceAmountTokens(this.upsellOptions.yesButton)}
        </button>
        <button class="primary frequency-upsell-modal__button" id="frequency-upsell-no">
           ${this.replaceAmountTokens(this.upsellOptions.noButton)}
        </button>
      </div>
    </div>
    `;
  }

  replaceAmountTokens(string: string): string {
    const amount = ENGrid.formatNumber(
      this._amountWithFees,
      this._amountWithFees % 1 == 0 ? 0 : 2,
      ".",
      ""
    );
    const upsellAmount = ENGrid.formatNumber(
      this._upsellAmountWithFees,
      this._upsellAmountWithFees % 1 == 0 ? 0 : 2,
      ".",
      ""
    );
    return string
      .replace(/{current_amount}/g, amount)
      .replace(/{upsell_amount}/g, upsellAmount);
  }
}
