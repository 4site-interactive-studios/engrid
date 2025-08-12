/*
 * FrequencyUpsell component which creates a modal to upsell the frequency of the donation
 * This is typically used to upsell a single donation into an annual donation, but the component
 * options can be configured to upsell any frequency to any other frequency. The upsell amount can also be configured
 * See FrequencyUpsellOptions for more details.
 */
import { DonationAmount, DonationFrequency, EnForm, EngridLogger, FrequencyUpsellModal, FrequencyUpsellOptionsDefaults, ProcessingFees, } from ".";
export class FrequencyUpsell {
    constructor() {
        this.logger = new EngridLogger("FrequencyUpsell", "lightgray", "darkblue", "🏦");
        this.upsellModal = null;
        this.options = null;
        this._frequency = DonationFrequency.getInstance();
        this._amount = DonationAmount.getInstance();
        this._fee = ProcessingFees.getInstance();
        this._form = EnForm.getInstance();
        this.modalSeen = false;
        if (!this.shouldRun()) {
            this.logger.log("FrequencyUpsell not running");
            return;
        }
        this.options = Object.assign(Object.assign({}, FrequencyUpsellOptionsDefaults), window.EngridFrequencyUpsell);
        this.logger.log("FrequencyUpsell initialized", this.options);
        this.upsellModal = new FrequencyUpsellModal(this.options);
        this.createFrequencyField();
        this.addEventListeners();
    }
    /**
     * Check if the FrequencyUpsell should run:
     * - Check if the FrequencyUpsell is enabled in the window object
     * - Check that we don't have an EngridUpsell active on this page
     * - Check that we don't have an EngagingNetworks upsell active on this page
     * @returns {boolean} - true if the FrequencyUpsell should run, false otherwise
     */
    shouldRun() {
        return (window.EngridFrequencyUpsell &&
            !window.EngridUpsell &&
            (!window.EngagingNetworks.upsell ||
                window.EngagingNetworks.upsell.length === 0));
    }
    /**
     * Get the upsell amount with/without fees
     * We want to display to the user the amount with fees, but we need to set the donation amount to the value without fees
     * @param {boolean} withFee - true if we want to include the fees in the upsell amount
     * @returns {number} - The upsell amount with fees
     */
    getUpsellAmount(withFee) {
        if (withFee) {
            const upsellAmount = this.options.upsellAmount(this._amount.amount);
            return upsellAmount + this._fee.calculateFees(upsellAmount);
        }
        return this.options.upsellAmount(this._amount.amount);
    }
    addEventListeners() {
        var _a, _b;
        // When the Modal buttons are clicked
        (_b = (_a = this.upsellModal) === null || _a === void 0 ? void 0 : _a.modal) === null || _b === void 0 ? void 0 : _b.addEventListener("click", (e) => {
            const target = e.target;
            // Upsell is accepted
            if (target.id === "frequency-upsell-yes") {
                this.logger.log("Frequency upsell accepted");
                this._frequency.setFrequency(this.options.upsellFrequency);
                this._amount.setAmount(this.getUpsellAmount(false));
                this.options.onAccept();
                this._form.submitForm();
                this.upsellModal.close();
                return;
            }
            // Upsell is declined
            if (target.id === "frequency-upsell-no") {
                this.logger.log("Frequency upsell declined");
                this.options.onDecline();
                this._form.submitForm();
                this.upsellModal.close();
                return;
            }
        });
        // When the form is submitted
        this._form.onSubmit.subscribe(() => {
            var _a;
            // If we have a frequency we want to upsell on & the modal isn't already open
            // Since frequency in the event class doesn't have a specific type, I need to cast our options array to a general string array
            if (this.options.upsellFromFrequency.includes(this._frequency.frequency) &&
                !this.modalSeen) {
                // Open the modal and prevent form submission
                this.upsellModal.amountWithFees =
                    this._amount.amount + this._fee.calculateFees(this._amount.amount);
                this.upsellModal.upsellAmountWithFees = this.getUpsellAmount(true);
                this.upsellModal.updateModalContent();
                this.logger.log("Frequency upsell modal opened");
                (_a = this.upsellModal) === null || _a === void 0 ? void 0 : _a.open();
                this.options.onOpen();
                this.modalSeen = true;
                this._form.submit = false;
                return false;
            }
            // If not opening, continue with the form submission
            this._form.submit = true;
            return true;
        });
    }
    /**
     * Create the frequency field for the upsell, if it does not exist on the page already
     * This is required by DonationFrequency to set the frequency
     */
    createFrequencyField() {
        const frequencyField = document.querySelector(`input[name="transaction.recurrfreq"][value="${this.options.upsellFrequency.toUpperCase()}"]`);
        if (frequencyField)
            return;
        const frequencyFieldContainer = document.querySelector(".en__field--recurrfreq .en__field__element");
        frequencyFieldContainer === null || frequencyFieldContainer === void 0 ? void 0 : frequencyFieldContainer.insertAdjacentHTML("beforeend", `
      <div class="en__field__item hide">
        <input type="radio" name="transaction.recurrfreq" value="${this.options.upsellFrequency.toUpperCase()}" class="en__field__input en__field__input--radio">
      </div>
    `);
    }
}
