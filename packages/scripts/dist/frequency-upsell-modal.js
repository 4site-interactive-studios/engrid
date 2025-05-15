/*
 * FrequencyUpsellModal - this is class that creates the modal for the frequency upsell.
 * This component is intentionally "dumb" and only creates the modal renders its content.
 * Logic for showing the modal and handling the upsell is in the FrequencyUpsell class.
 */
import { ENGrid, Modal } from ".";
export class FrequencyUpsellModal extends Modal {
    constructor(upsellOptions) {
        super({
            onClickOutside: "bounce",
            customClass: `engrid--frequency-upsell-modal ${upsellOptions.customClass}`,
            showCloseX: false,
        });
        this._amountWithFees = 0;
        this._upsellAmountWithFees = 0;
        this.upsellOptions = upsellOptions;
        this.updateModalContent();
    }
    set amountWithFees(value) {
        this._amountWithFees = value;
    }
    set upsellAmountWithFees(value) {
        this._upsellAmountWithFees = value;
    }
    updateModalContent() {
        var _a;
        this.modalContent = this.getModalContent();
        const modalBody = (_a = this.modal) === null || _a === void 0 ? void 0 : _a.querySelector(".engrid-modal__body");
        if (modalBody) {
            modalBody.innerHTML = "";
            modalBody.insertAdjacentHTML("beforeend", this.modalContent);
        }
    }
    getModalContent() {
        if (!this.upsellOptions)
            return "";
        return `
    <div class="frequency-upsell-modal__secondary-content"></div>
    <div class="frequency-upsell-modal__content">
      <div class="frequency-upsell-modal__text">
        <h2 class="frequency-upsell-modal__title">${this.replaceAmountTokens(this.upsellOptions.title)}</h2>
        <p class="frequency-upsell-modal__para">${this.replaceAmountTokens(this.upsellOptions.paragraph)}</p>
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
    replaceAmountTokens(string) {
        const amount = ENGrid.formatNumber(this._amountWithFees, this._amountWithFees % 1 == 0 ? 0 : 2, ".", "");
        const upsellAmount = ENGrid.formatNumber(this._upsellAmountWithFees, this._upsellAmountWithFees % 1 == 0 ? 0 : 2, ".", "");
        return string
            .replace(/{current_amount}/g, amount)
            .replace(/{upsell_amount}/g, upsellAmount);
    }
}
