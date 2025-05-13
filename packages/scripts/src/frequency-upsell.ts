import {
  DonationAmount,
  DonationFrequency,
  EnForm,
  ENGrid,
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

  getUpsellAmount(): number {
    return this.options!.upsellAmount(this._amount.amount);
  }

  private addEventListeners() {
    // When Donation Amount changes
    this._amount.onAmountChange.subscribe((amount) => {
      if (ENGrid.hasBodyData("has-lightbox")) return;
      // We refresh the modal content with the new amount / upsell amount
      this.upsellModal!.amount = amount;
      this.upsellModal!.upsellAmount = this.getUpsellAmount();
      this.upsellModal!.updateModalContent();
    });

    // When the Modal buttons are clicked
    this.upsellModal?.modal?.addEventListener("click", (e) => {
      const target = e.target as HTMLElement;

      // Upsell is accepted
      if (target.id === "frequency-upsell-yes") {
        this.logger.log("Frequency upsell accepted");
        this._frequency.setFrequency(this.options!.upsellFrequency);
        this._amount.setAmount(this.getUpsellAmount());
        this.options!.onAccept();
        this._form.submitForm();
        return;
      }

      // Upsell is declined
      if (target.id === "frequency-upsell-no") {
        this.logger.log("Frequency upsell declined");
        this.options!.onDecline();
        this._form.submitForm();
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
}
