/*
 * FrequencyUpsell component which creates a modal to upsell the frequency of the donation
 * This is typically used to upsell a single donation into an annual donation, but the component
 * options can be configured to upsell any frequency to any other frequency. The upsell amount can also be configured
 * See FrequencyUpsellOptions for more details.
 */
import {
  DonationAmount,
  DonationFrequency,
  EnForm,
  EngridLogger,
  FrequencyUpsellModal,
  FrequencyUpsellOptions,
  FrequencyUpsellOptionsDefaults,
  ProcessingFees,
} from ".";

export class FrequencyUpsell {
  private logger: EngridLogger = new EngridLogger(
    "FrequencyUpsell",
    "lightgray",
    "darkblue",
    "🏦"
  );
  private upsellModal: FrequencyUpsellModal | null = null;
  private readonly options: FrequencyUpsellOptions | null = null;
  private _frequency: DonationFrequency = DonationFrequency.getInstance();
  private _amount: DonationAmount = DonationAmount.getInstance();
  private _fee: ProcessingFees = ProcessingFees.getInstance();
  private _form: EnForm = EnForm.getInstance();
  private modalSeen: boolean = false;

  constructor() {
    if (!this.shouldRun()) {
      this.logger.log("FrequencyUpsell not running");
      return;
    }
    this.options = {
      ...FrequencyUpsellOptionsDefaults,
      ...window.EngridFrequencyUpsell,
    };
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
  shouldRun(): boolean {
    return (
      window.EngridFrequencyUpsell &&
      !window.EngridUpsell &&
      (!window.EngagingNetworks.upsell ||
        window.EngagingNetworks.upsell.length === 0)
    );
  }

  /**
   * Get the upsell amount with/without fees
   * We want to display to the user the amount with fees, but we need to set the donation amount to the value without fees
   * @param {boolean} withFee - true if we want to include the fees in the upsell amount
   * @returns {number} - The upsell amount with fees
   */
  getUpsellAmount(withFee: boolean): number {
    if (withFee) {
      const upsellAmount = this.options!.upsellAmount(this._amount.amount);
      return upsellAmount + this._fee.calculateFees(upsellAmount);
    }
    return this.options!.upsellAmount(this._amount.amount);
  }

  private addEventListeners(): void {
    // When the Modal buttons are clicked
    this.upsellModal?.modal?.addEventListener("click", (e) => {
      const target = e.target as HTMLElement;

      // Upsell is accepted
      if (target.id === "frequency-upsell-yes") {
        this.logger.log("Frequency upsell accepted");
        this._frequency.setFrequency(this.options!.upsellFrequency);
        this._amount.setAmount(this.getUpsellAmount(false));
        this.options!.onAccept();
        this._form.submitForm();
        this.upsellModal!.close();
        return;
      }

      // Upsell is declined
      if (target.id === "frequency-upsell-no") {
        this.logger.log("Frequency upsell declined");
        this.options!.onDecline();
        this._form.submitForm();
        this.upsellModal!.close();
        return;
      }
    });

    // When the form is submitted
    this._form.onSubmit.subscribe(() => {
      // If we have a frequency we want to upsell on & the modal isn't already open
      // Since frequency in the event class doesn't have a specific type, I need to cast our options array to a general string array
      if (
        (this.options!.upsellFromFrequency as string[]).includes(
          this._frequency.frequency
        ) &&
        !this.modalSeen
      ) {
        // Open the modal and prevent form submission
        this.upsellModal!.amountWithFees =
          this._amount.amount + this._fee.calculateFees(this._amount.amount);
        this.upsellModal!.upsellAmountWithFees = this.getUpsellAmount(true);
        this.upsellModal!.updateModalContent();
        this.logger.log("Frequency upsell modal opened");
        this.upsellModal?.open();
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
  private createFrequencyField(): void {
    const frequencyField = document.querySelector(
      `input[name="transaction.recurrfreq"][value="${this.options!.upsellFrequency.toUpperCase()}"]`
    );

    if (frequencyField) return;

    const frequencyFieldContainer = document.querySelector(
      ".en__field--recurrfreq .en__field__element"
    );
    frequencyFieldContainer?.insertAdjacentHTML(
      "beforeend",
      `
      <div class="en__field__item hide">
        <input type="radio" name="transaction.recurrfreq" value="${this.options!.upsellFrequency.toUpperCase()}" class="en__field__input en__field__input--radio">
      </div>
    `
    );
  }
}
