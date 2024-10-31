// This component will add a checkbox to the donation form that will allow the user to upgrade their donation to a monthly donation.

import {
  ENGrid,
  EngridLogger,
  ProcessingFees,
  UpsellOptions,
  UpsellOptionsDefaults,
  DataLayer,
} from ".";
import { DonationAmount, DonationFrequency } from "./events";

export class UpsellCheckbox {
  private options: UpsellOptions;
  private checkboxOptions:
    | false
    | { label: string; location: string; cssClass: string } = false;
  private checkboxOptionsDefaults = {
    label: "Make my gift a monthly gift of <strong>{new-amount}/mo</strong>",
    location: "before .en__component .en__submit",
    cssClass: "",
  };
  public _amount: DonationAmount = DonationAmount.getInstance();
  public _fees: ProcessingFees = ProcessingFees.getInstance();
  private _frequency: DonationFrequency = DonationFrequency.getInstance();
  private _dataLayer: DataLayer = DataLayer.getInstance();
  private checkboxContainer: HTMLElement | null = null;
  private oldAmount: number = 0;
  private oldFrequency: string = "one-time";
  private resetCheckbox: boolean = false;

  private logger: EngridLogger = new EngridLogger(
    "UpsellCheckbox",
    "black",
    "LemonChiffon",
    "✅"
  );

  constructor() {
    let options = "EngridUpsell" in window ? window.EngridUpsell : {};
    this.options = { ...UpsellOptionsDefaults, ...options };

    if (this.options.upsellCheckbox === false) {
      this.logger.log("Skipped");
      return;
    }

    // To avoid using both UpsellLightbox and UpsellCheckbox at the same time, set window.EngridUpsell.skipUpsell to true if there's an upsellCheckbox
    if ("upsellCheckbox" in options && options.upsellCheckbox !== false) {
      window.EngridUpsell.skipUpsell = true; // Skip the upsell lightbox
    }

    this.checkboxOptions = {
      ...this.checkboxOptionsDefaults,
      ...this.options.upsellCheckbox,
    };

    if (!this.shouldRun()) {
      this.logger.log("should NOT run");
      // If we're not on a Donation Page, get out
      return;
    }
    this.renderCheckbox();
    this.updateLiveData();
    this._frequency.onFrequencyChange.subscribe(() => this.updateLiveData());
    this._frequency.onFrequencyChange.subscribe(() =>
      this.resetUpsellCheckbox()
    );
    this._amount.onAmountChange.subscribe(() => this.updateLiveData());
    this._amount.onAmountChange.subscribe(() => this.resetUpsellCheckbox());
    this._fees.onFeeChange.subscribe(() => this.updateLiveData());
  }
  private updateLiveData() {
    this.liveAmounts();
    this.liveFrequency();
  }
  private resetUpsellCheckbox() {
    // Only reset the upsell checkbox if it has been checked
    if (!this.resetCheckbox) return;
    this.logger.log("Reset");
    // Uncheck the upsell checkbox
    const checkbox =
      this.checkboxContainer?.querySelector<HTMLInputElement>(
        "#upsellCheckbox"
      );
    if (checkbox) {
      checkbox.checked = false;
    }
    // Hide the upsell checkbox
    this.checkboxContainer?.classList.add("recurring-frequency-y-hide");
    this.oldAmount = 0;
    this.oldFrequency = "one-time";
    this.resetCheckbox = false;
  }
  private renderCheckbox() {
    if (this.checkboxOptions === false) return;
    const label = this.checkboxOptions.label
      .replace("{new-amount}", " <span class='upsell_suggestion'></span>")
      .replace("{old-amount}", " <span class='upsell_amount'></span>")
      .replace("{old-frequency}", " <span class='upsell_frequency'></span>");
    const formBlock = document.createElement("div");
    formBlock.classList.add(
      "en__component",
      "en__component--formblock",
      "recurring-frequency-y-hide",
      "engrid-upsell-checkbox"
    );
    if (this.checkboxOptions.cssClass)
      formBlock.classList.add(this.checkboxOptions.cssClass);
    formBlock.innerHTML = `
    <div class="en__field en__field--checkbox">
      <div class="en__field__element en__field__element--checkbox">
        <div class="en__field__item">
            <input type="checkbox" class="en__field__input en__field__input--checkbox" name="upsellCheckbox" id="upsellCheckbox" value="Y">
            <label class="en__field__label en__field__label--item" for="upsellCheckbox" style="gap: 0.5ch">${label}</label>
        </div>
      </div>
    </div>`;

    const checkbox =
      formBlock.querySelector<HTMLInputElement>("#upsellCheckbox");
    if (checkbox)
      checkbox.addEventListener("change", this.toggleCheck.bind(this));
    const position = this.checkboxOptions.location.split(" ")[0];
    // Location is everything after the first space
    const location = this.checkboxOptions.location
      .split(" ")
      .slice(1)
      .join(" ")
      .trim();

    const target = document.querySelector(location);
    this.checkboxContainer = formBlock;
    if (target) {
      if (position === "before") {
        this.logger.log("rendered before");
        target.before(formBlock);
      } else {
        this.logger.log("rendered after");
        target.after(formBlock);
      }
    } else {
      this.logger.error("could not render - target not found");
    }
  }
  // Should we run the script?
  private shouldRun() {
    // if it's a first page of a Donation page
    return ENGrid.getPageNumber() === 1 && ENGrid.getPageType() === "DONATION";
  }

  private showCheckbox() {
    if (this.checkboxContainer) this.checkboxContainer.classList.remove("hide");
  }

  private hideCheckbox() {
    if (this.checkboxContainer) this.checkboxContainer.classList.add("hide");
  }

  private liveAmounts() {
    // Only update live data if the current frequency is one-time
    if (this._frequency.frequency !== "onetime") return;
    const live_upsell_amount = document.querySelectorAll(".upsell_suggestion");
    const live_amount = document.querySelectorAll(".upsell_amount");
    const upsellAmount = this.getUpsellAmount();
    const suggestedAmount =
      upsellAmount + this._fees.calculateFees(upsellAmount);

    if (suggestedAmount > 0) {
      this.showCheckbox();
    } else {
      this.hideCheckbox();
    }

    live_upsell_amount.forEach(
      (elem) => (elem.innerHTML = this.getAmountTxt(suggestedAmount))
    );
    live_amount.forEach(
      (elem) =>
        (elem.innerHTML = this.getAmountTxt(
          this._amount.amount + this._fees.fee
        ))
    );
  }

  private liveFrequency() {
    const live_upsell_frequency =
      document.querySelectorAll(".upsell_frequency");
    live_upsell_frequency.forEach(
      (elem) => (elem.innerHTML = this.getFrequencyTxt())
    );
  }

  // Return the Suggested Upsell Amount
  private getUpsellAmount(): number {
    const amount = this._amount.amount;
    let upsellAmount: string | number = 0;

    for (let i = 0; i < this.options.amountRange.length; i++) {
      let val = this.options.amountRange[i];
      if (upsellAmount == 0 && amount <= val.max) {
        upsellAmount = val.suggestion;
        if (upsellAmount === 0) return 0;
        if (typeof upsellAmount !== "number") {
          const suggestionMath = upsellAmount.replace(
            "amount",
            amount.toFixed(2)
          );
          upsellAmount = parseFloat(
            Function('"use strict";return (' + suggestionMath + ")")()
          );
        }
        break;
      }
    }
    return upsellAmount > this.options.minAmount
      ? upsellAmount
      : this.options.minAmount;
  }

  // Proceed to the next page (upsold or not)
  private toggleCheck(e: Event) {
    e.preventDefault();
    if ((e.target as HTMLInputElement).checked) {
      this.logger.success("Upsold");
      const upsoldAmount = this.getUpsellAmount();
      const originalAmount = this._amount.amount;
      this.oldAmount = originalAmount;
      this.oldFrequency = this._frequency.frequency;
      // If we're checking the upsell checkbox, remove the class that hides it on different frequencies
      this.checkboxContainer?.classList.remove("recurring-frequency-y-hide");
      this._frequency.setFrequency("monthly");
      this._amount.setAmount(upsoldAmount);
      this._dataLayer.addEndOfGiftProcessEvent("ENGRID_UPSELL_CHECKBOX", {
        eventValue: true,
        originalAmount: originalAmount,
        upsoldAmount: upsoldAmount,
        frequency: "monthly",
      });
      this._dataLayer.addEndOfGiftProcessVariable(
        "ENGRID_UPSELL_CHECKBOX",
        true
      );
      this._dataLayer.addEndOfGiftProcessVariable(
        "ENGRID_UPSELL_ORIGINAL_AMOUNT",
        originalAmount
      );
      this._dataLayer.addEndOfGiftProcessVariable(
        "ENGRID_UPSELL_DONATION_FREQUENCY",
        "MONTHLY"
      );
      this.renderConversionField(
        "upsellSuccess",
        "onetime",
        originalAmount,
        "monthly",
        upsoldAmount,
        "monthly",
        upsoldAmount
      );
      // Set the resetCheckbox flag to true so it will reset if the user changes the amount or frequency
      window.setTimeout(() => {
        this.resetCheckbox = true;
      }, 500);
    } else {
      this.resetCheckbox = false;
      this.logger.success("Not Upsold");
      this._amount.setAmount(this.oldAmount);
      this._frequency.setFrequency(this.oldFrequency);
      this.checkboxContainer?.classList.add("recurring-frequency-y-hide");
      this._dataLayer.addEndOfGiftProcessVariable(
        "ENGRID_UPSELL_CHECKBOX",
        false
      );
      this._dataLayer.addEndOfGiftProcessVariable(
        "ENGRID_UPSELL_DONATION_FREQUENCY",
        "ONE-TIME"
      );
      this.renderConversionField(
        "upsellFail",
        this._frequency.frequency,
        this._amount.amount,
        "monthly",
        this._amount.amount,
        this._frequency.frequency,
        this._amount.amount
      );
    }
  }
  private getAmountTxt(amount: number = 0) {
    const symbol = ENGrid.getCurrencySymbol() ?? "$";
    const dec_separator = ENGrid.getOption("DecimalSeparator") ?? ".";
    const thousands_separator = ENGrid.getOption("ThousandsSeparator") ?? "";
    const dec_places =
      amount % 1 == 0 ? 0 : ENGrid.getOption("DecimalPlaces") ?? 2;
    const amountTxt = ENGrid.formatNumber(
      amount,
      dec_places,
      dec_separator,
      thousands_separator
    );
    return amount > 0 ? <string>symbol + amountTxt : "";
  }
  private getFrequencyTxt() {
    const freqTxt = {
      onetime: "one-time",
      monthly: "monthly",
      annual: "annual",
    };
    const frequency = this._frequency.frequency as keyof typeof freqTxt;
    return frequency in freqTxt ? freqTxt[frequency] : frequency;
  }
  private renderConversionField(
    event: string, // The event that triggered the conversion
    freq: string, // The frequency of the donation (onetime, monthly, annual)
    amt: number, // The original amount of the donation (before the upsell)
    sugFreq: string, // The suggested frequency of the upsell (monthly)
    sugAmt: number, // The suggested amount of the upsell
    subFreq: string, // The submitted frequency of the upsell (onetime, monthly, annual)
    subAmt: number // The submitted amount of the upsell
  ) {
    if (this.options.conversionField === "") return;
    const conversionField =
      (document.querySelector(
        "input[name='" + this.options.conversionField + "']"
      ) as HTMLInputElement) ||
      (ENGrid.createHiddenInput(
        this.options.conversionField
      ) as HTMLInputElement);
    if (!conversionField) {
      this.logger.error("Could not find or create the conversion field");
      return;
    }
    const conversionValue = `event:${event},freq:${freq},amt:${amt},sugFreq:${sugFreq},sugAmt:${sugAmt},subFreq:${subFreq},subAmt:${subAmt}`;
    conversionField.value = conversionValue;
    this.logger.log(`Conversion Field ${event}`, conversionValue);
  }
}
