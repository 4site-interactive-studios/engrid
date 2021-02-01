import { DonationAmount, EnForm, DonationFrequency, ProcessingFees } from "@4site/engrid-events";

export class LiveVariables {
  public _amount: DonationAmount = DonationAmount.getInstance();
  public _fees: ProcessingFees = ProcessingFees.getInstance();
  private _frequency: DonationFrequency = DonationFrequency.getInstance();
  private _form: EnForm = EnForm.getInstance();
  private multiplier: number = 1 / 12;


  constructor(submitLabel: string) {
    this._amount.onAmountChange.subscribe(() => this.changeSubmitButton(submitLabel));
    this._amount.onAmountChange.subscribe(() => this.changeLiveAmount());
    this._amount.onAmountChange.subscribe(() => this.changeLiveUpsellAmount());
    this._fees.onFeeChange.subscribe(() => this.changeLiveAmount());
    this._fees.onFeeChange.subscribe(() => this.changeLiveUpsellAmount());
    this._fees.onFeeChange.subscribe(() => this.changeSubmitButton(submitLabel));
    this._frequency.onFrequencyChange.subscribe(() => this.changeLiveFrequency());
    this._frequency.onFrequencyChange.subscribe(() =>
      this.changeSubmitButton(submitLabel)
    );
    this._form.onSubmit.subscribe(() => this.loadingSubmitButton());
    this._form.onError.subscribe(() => this.changeSubmitButton(submitLabel));

    // Watch the monthly-upsell links
    document.addEventListener("click", (e: Event) => {
      const element = e.target as HTMLInputElement;
      if (element) {
        if (element.classList.contains("monthly-upsell")) {
          this.upsold(e);
        } else if (element.classList.contains("form-submit")) {
          e.preventDefault();
          this._form.submitForm();
        }
      }
    });
  }

  private getAmountTxt(amount: number = 0) {
    const amountTxt = Number.isInteger(amount)
      ? "$" + amount
      : "$" + amount.toFixed(2);
    return amount > 0 ? amountTxt : "";
  }

  private getUpsellAmountTxt(amount: number = 0) {
    const amountTxt = "$" + Math.ceil(amount / 5) * 5;
    return amount > 0 ? amountTxt : "";
  }

  private getUpsellAmountRaw(amount: number = 0) {
    const amountRaw = Math.ceil(amount / 5) * 5;
    return amount > 0 ? amountRaw.toString() : "";
  }

  public changeSubmitButton(submitLabel: string) {
    const submit = document.querySelector(
      ".dynamic-giving-button button"
    ) as HTMLButtonElement;
    const amount = this.getAmountTxt(this._amount.amount + this._fees.fee);

    if (amount) {
      const frequency = this._frequency.frequency == "single" ? "" : " Monthly";
      const label =
        amount != ""
          ? submitLabel + " " + amount + frequency
          : submitLabel + " Now";
      submit.innerHTML = label;
    }
  }
  public loadingSubmitButton() {
    const submit = document.querySelector(
      ".en__submit button"
    ) as HTMLButtonElement;
    let submitButtonOriginalHTML = submit.innerHTML;
    let submitButtonProcessingHTML =
      "<span class='loader-wrapper'><span class='loader loader-quart'></span><span class='submit-button-text-wrapper'>" +
      submitButtonOriginalHTML +
      "</span></span>";
    submitButtonOriginalHTML = submit.innerHTML;
    submit.innerHTML = submitButtonProcessingHTML;
    return true;
  }

  public changeLiveAmount() {
    const value = this._amount.amount + this._fees.fee;
    const live_amount = document.querySelectorAll(".live-giving-amount");
    live_amount.forEach(elem => (elem.innerHTML = this.getAmountTxt(value)));
  }

  public changeLiveUpsellAmount() {
    const value = (this._amount.amount + this._fees.fee) * this.multiplier;
    const live_upsell_amount = document.querySelectorAll(
      ".live-giving-upsell-amount"
    );

    live_upsell_amount.forEach(
      elem => (elem.innerHTML = this.getUpsellAmountTxt(value))
    );

    const live_upsell_amount_raw = document.querySelectorAll(
      ".live-giving-upsell-amount-raw"
    );
    live_upsell_amount_raw.forEach(
      elem => (elem.innerHTML = this.getUpsellAmountRaw(value))
    );
  }

  public changeLiveFrequency() {
    const live_frequency = document.querySelectorAll(".live-giving-frequency");
    live_frequency.forEach(
      elem =>
      (elem.innerHTML =
        this._frequency.frequency == "single" ? "" : "monthly")
    );
  }

  // Watch for a clicks on monthly-upsell link
  private upsold(e: Event) {
    // Find and select monthly giving
    const enFieldRecurrpay = document.querySelector(
      ".en__field--recurrpay input[value='Y']"
    ) as HTMLInputElement;
    if (enFieldRecurrpay) {
      enFieldRecurrpay.checked = true;
    }

    // Find the hidden radio select that needs to be selected when entering an "Other" amount
    const enFieldOtherAmountRadio = document.querySelector(
      ".en__field--donationAmt input[value='other']"
    ) as HTMLInputElement;
    if (enFieldOtherAmountRadio) {
      enFieldOtherAmountRadio.checked = true;
    }

    // Enter the other amount and remove the "en__field__item--hidden" class from the input's parent
    const enFieldOtherAmount = document.querySelector(
      "input[name='transaction.donationAmt.other']"
    ) as HTMLInputElement;
    if (enFieldOtherAmount) {
      // @TODO Needs to use getUpsellAmountRaw to set value

      enFieldOtherAmount.value = this.getUpsellAmountRaw(
        this._amount.amount * this.multiplier
      );
      this._amount.load();
      this._frequency.load();
      if (enFieldOtherAmount.parentElement) {
        enFieldOtherAmount.parentElement.classList.remove(
          "en__field__item--hidden"
        );
      }
    }

    const target = e.target as HTMLLinkElement;
    if (target && target.classList.contains("form-submit")) {
      e.preventDefault();
      // Form submit
      this._form.submitForm();
    }
  }
}
