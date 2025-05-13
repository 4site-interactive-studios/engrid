import { ENGrid, Modal } from ".";
export class FrequencyUpsellModal extends Modal {
    constructor(upsellOptions) {
        super({
            onClickOutside: "bounce",
            addCloseButton: false,
            closeButtonLabel: "",
        });
        this._amount = 0;
        this._upsellAmount = 0;
        this.upsellOptions = upsellOptions;
        this.updateModalContent();
    }
    set amount(value) {
        this._amount = value;
    }
    set upsellAmount(value) {
        this._upsellAmount = value;
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
    replaceAmountTokens(string) {
        const amount = ENGrid.formatNumber(this._amount, this._amount % 1 == 0 ? 0 : 2, ".", "");
        const upsellAmount = ENGrid.formatNumber(this._upsellAmount, this._upsellAmount % 1 == 0 ? 0 : 2, ".", "");
        return string
            .replace(/{current_amount}/g, amount)
            .replace(/{upsell_amount}/g, upsellAmount);
    }
}
