import {
  ENGrid,
  EngridLogger,
  ProcessingFees,
  UpsellOptions,
  UpsellOptionsDefaults,
  DataLayer,
} from ".";
import { DonationAmount, DonationFrequency, EnForm } from "./events";

export class UpsellLightbox {
  private options: UpsellOptions;
  private overlay: HTMLDivElement = document.createElement("div");
  private _form: EnForm = EnForm.getInstance();
  public _amount: DonationAmount = DonationAmount.getInstance();
  public _fees: ProcessingFees = ProcessingFees.getInstance();
  private _frequency: DonationFrequency = DonationFrequency.getInstance();
  private _dataLayer: DataLayer = DataLayer.getInstance();
  private _suggestAmount: number = 0;
  private _upsellFrequency: string = "monthly";

  private logger: EngridLogger = new EngridLogger(
    "UpsellLightbox",
    "black",
    "pink",
    "🪟"
  );

  constructor() {
    let options = "EngridUpsell" in window ? window.EngridUpsell : {};
    this.options = { ...UpsellOptionsDefaults, ...options };
    //Disable for "applepay" via Vantiv payment method. Adding it to the array like this so it persists
    //even if the client provides custom options.
    this.options.disablePaymentMethods.push("applepay");
    if (!this.shouldRun()) {
      this.logger.log("Upsell script should NOT run");
      // If we're not on a Donation Page, get out
      return;
    }
    this.overlay.id = "enModal";
    this.overlay.classList.add("is-hidden");
    this.overlay.classList.add("image-" + this.options.imagePosition);
    this.renderLightbox();
    this._form.onSubmit.subscribe(() => this.open());
  }
  private parseMergeTags(str: string): string {
    return str
      .replace(/\{new-amount\}/g, "<span class='upsell_suggestion'></span>")
      .replace(
        /\{new-frequency\}/g,
        "<span class='upsell_suggestion_frequency'></span>"
      )
      .replace(/\{old-amount\}/g, "<span class='upsell_amount'></span>")
      .replace(/\{old-frequency\}/g, "<span class='upsell_frequency'></span>");
  }
  private renderLightbox() {
    const title = this.parseMergeTags(this.options.title);
    const paragraph = this.parseMergeTags(this.options.paragraph);
    const yes = this.parseMergeTags(this.options.yesLabel);
    const no = this.parseMergeTags(this.options.noLabel);
    const other = this.parseMergeTags(this.options.otherLabel);
    const markup = `
            <div class="upsellLightboxContainer" id="goMonthly">
              <!-- ideal image size is 480x650 pixels -->
              <div class="background" style="background-image: url('${
                this.options.image
              }');"></div>
              <div class="upsellLightboxContent">
              ${
                this.options.canClose ? `<span id="goMonthlyClose"></span>` : ``
              }
                <h1>
                  ${title}
                </h1>
                ${
                  this.options.otherAmount
                    ? `
                <div class="upsellOtherAmount">
                  <div class="upsellOtherAmountLabel">
                    <p>
                      ${other}
                    </p>
                  </div>
                  <div class="upsellOtherAmountInput">
                    <input href="#" id="secondOtherField" name="secondOtherField" type="text" value="" inputmode="decimal" aria-label="Enter your custom donation amount" autocomplete="off" data-lpignore="true" aria-required="true" size="12">
                    <small>Minimum ${this.getAmountTxt(
                      this.options.minAmount
                    )}</small>
                  </div>
                </div>
                `
                    : ``
                }

                <p>
                  ${paragraph}
                </p>
                <!-- YES BUTTON -->
                <div id="upsellYesButton">
                  <a class="pseduo__en__submit_button" href="#">
                    <div>
                    <span class='loader-wrapper'><span class='loader loader-quart'></span></span>
                    <span class='label'>${yes}</span>
                    </div>
                  </a>
                </div>
                <!-- NO BUTTON -->
                <div id="upsellNoButton">
                  <button title="Close (Esc)" type="button">
                    <div>
                    <span class='loader-wrapper'><span class='loader loader-quart'></span></span>
                    <span class='label'>${no}</span>
                    </div>
                  </button>
                </div>
              </div>
            </div>
            `;

    this.overlay.innerHTML = markup;
    const closeButton = this.overlay.querySelector(
      "#goMonthlyClose"
    ) as HTMLElement;
    const yesButton = this.overlay.querySelector(
      "#upsellYesButton a"
    ) as HTMLLinkElement;
    const noButton = this.overlay.querySelector(
      "#upsellNoButton button"
    ) as HTMLButtonElement;
    yesButton.addEventListener("click", this.continue.bind(this));
    noButton.addEventListener("click", this.continue.bind(this));
    if (closeButton)
      closeButton.addEventListener("click", this.close.bind(this));
    this.overlay.addEventListener("click", (e: Event) => {
      if (
        e.target instanceof Element &&
        e.target.id == this.overlay.id &&
        this.options.canClose
      ) {
        this.close(e);
      }
    });
    document.addEventListener("keyup", (e) => {
      if (e.key === "Escape" && closeButton) {
        closeButton.click();
      }
    });
    document.body.appendChild(this.overlay);
    const otherField = document.querySelector("#secondOtherField");
    if (otherField) {
      otherField.addEventListener("keyup", this.popupOtherField.bind(this));
    }
    this.logger.log("Upsell script rendered");
  }
  // Should we run the script?
  private shouldRun() {
    // if it's a first page of a Donation page
    return (
      // !hideModal &&
      !this.shouldSkip() &&
      "EngridUpsell" in window &&
      !!window.pageJson &&
      window.pageJson.pageNumber == 1 &&
      ["donation", "premiumgift"].includes(window.pageJson.pageType)
    );
  }
  private shouldSkip() {
    if ("EngridUpsell" in window && window.EngridUpsell.skipUpsell) {
      return true;
    }
    return this.options.skipUpsell;
  }

  private popupOtherField() {
    const value = parseFloat(
      this.overlay.querySelector<HTMLInputElement>("#secondOtherField")
        ?.value ?? ""
    );
    const live_upsell_amount = document.querySelectorAll(
      "#upsellYesButton .upsell_suggestion"
    );
    const { amount: upsellAmount } = this.resolveUpsell();

    if (!isNaN(value) && value > 0) {
      this.checkOtherAmount(value);
    } else {
      this.checkOtherAmount(upsellAmount);
    }
    live_upsell_amount.forEach(
      (elem) =>
        (elem.innerHTML = this.getAmountTxt(
          upsellAmount + this._fees.calculateFees(upsellAmount)
        ))
    );
  }

  private liveAmounts() {
    const live_upsell_amount = document.querySelectorAll(".upsell_suggestion");
    const live_amount = document.querySelectorAll(".upsell_amount");
    const { amount: upsellAmount } = this.resolveUpsell();
    const suggestedAmount =
      upsellAmount + this._fees.calculateFees(upsellAmount);

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
    const live_upsell_suggestion_frequency = document.querySelectorAll(
      ".upsell_suggestion_frequency"
    );
    live_upsell_frequency.forEach(
      (elem) => (elem.innerHTML = this.getFrequencyTxt())
    );
    live_upsell_suggestion_frequency.forEach(
      (elem) => (elem.innerHTML = this.getFrequencyTxt(this._upsellFrequency))
    );
  }

  // Resolve the upsell amount and target frequency in a single pass and keep
  // the cached _suggestAmount / _upsellFrequency in sync with the current
  // donation amount and any value entered in the "other amount" field.
  private resolveUpsell() {
    const amount = this._amount.amount;
    const otherAmount = parseFloat(
      this.overlay.querySelector<HTMLInputElement>("#secondOtherField")
        ?.value ?? ""
    );
    const defaultFrequency = this.options.upsellToFrequency ?? "monthly";

    let upsellAmount: number;
    let upsellFrequency: string;

    if (otherAmount > 0) {
      // An "other" amount overrides the amount but keeps the frequency that
      // was already shown when the lightbox opened
      upsellAmount =
        otherAmount > this.options.minAmount
          ? otherAmount
          : this.options.minAmount;
      upsellFrequency = this._upsellFrequency;
    } else {
      upsellAmount = 0;
      upsellFrequency = defaultFrequency;
      for (let i = 0; i < this.options.amountRange.length; i++) {
        const val = this.options.amountRange[i];
        if (upsellAmount == 0 && amount <= val.max) {
          if (val.suggestion === 0) {
            upsellAmount = 0;
          } else if (typeof val.suggestion === "number") {
            upsellAmount = val.suggestion;
          } else {
            const suggestionMath = val.suggestion.replace(
              "amount",
              amount.toFixed(2)
            );
            upsellAmount = parseFloat(
              Function('"use strict";return (' + suggestionMath + ")")()
            );
          }
          upsellFrequency = val.frequency ?? defaultFrequency;
          break;
        }
      }
      upsellAmount =
        upsellAmount > this.options.minAmount
          ? upsellAmount
          : this.options.minAmount;
    }

    this._suggestAmount = upsellAmount;
    this._upsellFrequency = upsellFrequency;
    return { amount: upsellAmount, frequency: upsellFrequency };
  }

  private shouldOpen() {
    const { amount: upsellAmount, frequency: upsellFrequency } =
      this.resolveUpsell();
    const paymenttype = ENGrid.getFieldValue("transaction.paymenttype") || "";
    // If frequency is not allowed, or
    // the modal is already opened, or
    // there's no suggestion for this donation amount, or
    // the target upsell frequency is not available on the form,
    // we should not open
    if (
      this.freqAllowed() &&
      !this.shouldSkip() &&
      !this.options.disablePaymentMethods.includes(paymenttype.toLowerCase()) &&
      !this.overlay.classList.contains("is-submitting") &&
      upsellAmount > 0 &&
      this._frequency.frequencies.includes(upsellFrequency)
    ) {
      this.logger.log("Upsell Frequency " + this._frequency.frequency);
      this.logger.log("Upsell Amount " + this._amount.amount);
      this.logger.log("Upsell Suggested Amount " + upsellAmount);
      this.logger.log("Upsell Suggested Frequency " + upsellFrequency);

      return true;
    }
    return false;
  }

  // Return true if the current frequency is allowed by the options
  private freqAllowed() {
    const freq = this._frequency.frequency;
    const allowed = [];
    if (this.options.oneTime) allowed.push("onetime");
    if (this.options.monthly) allowed.push("monthly");
    if (this.options.annual) allowed.push("annual");
    return allowed.includes(freq);
  }

  private open() {
    this.logger.log("Upsell script opened");
    if (!this.shouldOpen()) {
      // In the circumstance when the form fails to validate via server-side validation, the page will reload
      // When that happens, we should place the original amount saved in sessionStorage into the upsell original amount field
      let original = window.sessionStorage.getItem("original");
      if (
        original &&
        document.querySelectorAll(".en__errorList .en__error").length > 0
      ) {
        this.setOriginalAmount(original);
      }

      // Returning true will give the "go ahead" to submit the form
      this._form.submit = true;
      return true;
    }
    this.liveAmounts();
    this.liveFrequency();
    this.overlay.classList.remove("is-hidden");
    this._form.submit = false;
    ENGrid.setBodyData("has-lightbox", "");
    return false;
  }

  // Set the original amount into a hidden field using the upsellOriginalGiftAmountFieldName, if provided
  private setOriginalAmount(original: string) {
    if (this.options.upsellOriginalGiftAmountFieldName) {
      let enFieldUpsellOriginalAmount = document.querySelector(
        ".en__field__input.en__field__input--hidden[name='" +
          this.options.upsellOriginalGiftAmountFieldName +
          "']"
      );
      if (!enFieldUpsellOriginalAmount) {
        let pageform = document.querySelector("form.en__component--page");
        if (pageform) {
          let input = document.createElement("input");
          input.setAttribute("type", "hidden");
          input.setAttribute(
            "name",
            this.options.upsellOriginalGiftAmountFieldName
          );
          input.classList.add("en__field__input", "en__field__input--hidden");
          pageform.appendChild(input);
          enFieldUpsellOriginalAmount = document.querySelector(
            '.en__field__input.en__field__input--hidden[name="' +
              this.options.upsellOriginalGiftAmountFieldName +
              '"]'
          );
        }
      }
      if (enFieldUpsellOriginalAmount) {
        // save it to a session variable just in case this page reloaded due to server-side validation error
        window.sessionStorage.setItem("original", original);
        enFieldUpsellOriginalAmount.setAttribute("value", original);
      }
    }
  }

  // Proceed to the next page (upsold or not)
  private continue(e: Event) {
    e.preventDefault();
    if (
      e.target instanceof Element &&
      document.querySelector("#upsellYesButton")?.contains(e.target)
    ) {
      this.logger.success("Upsold");
      this.setOriginalAmount(this._amount.amount.toString());
      const { amount: upsoldAmount, frequency: upsellFrequency } =
        this.resolveUpsell();
      const originalAmount = this._amount.amount;
      const originalFrequency = this._frequency.frequency;
      this._frequency.setFrequency(upsellFrequency);
      this._amount.setAmount(upsoldAmount);
      this._dataLayer.addEndOfGiftProcessEvent("ENGRID_UPSELL", {
        eventValue: true,
        originalFrequency: originalFrequency,
        originalAmount: originalAmount,
        upsoldAmount: upsoldAmount,
        frequency: upsellFrequency,
      });
      this._dataLayer.addEndOfGiftProcessVariable("ENGRID_UPSELL", true);
      this._dataLayer.addEndOfGiftProcessVariable(
        "ENGRID_UPSELL_ORIGINAL_AMOUNT",
        originalAmount
      );
      this._dataLayer.addEndOfGiftProcessVariable(
        "ENGRID_UPSELL_ORIGINAL_FREQUENCY",
        this.getFrequencyTxt(originalFrequency).toUpperCase()
      );
      this._dataLayer.addEndOfGiftProcessVariable(
        "ENGRID_UPSELL_DONATION_FREQUENCY",
        this.getFrequencyTxt(upsellFrequency).toUpperCase()
      );
      this.renderConversionField(
        "upsellSuccess",
        originalFrequency,
        originalAmount,
        upsellFrequency,
        this._suggestAmount,
        upsellFrequency,
        upsoldAmount
      );
    } else {
      this.setOriginalAmount("");
      window.sessionStorage.removeItem("original");
      this._dataLayer.addEndOfGiftProcessVariable("ENGRID_UPSELL", false);
      this._dataLayer.addEndOfGiftProcessVariable(
        "ENGRID_UPSELL_DONATION_FREQUENCY",
        this.getFrequencyTxt(this._frequency.frequency).toUpperCase()
      );
      this.renderConversionField(
        "upsellFail",
        this._frequency.frequency,
        this._amount.amount,
        this._upsellFrequency,
        this._suggestAmount,
        this._frequency.frequency,
        this._amount.amount
      );
    }
    this._form.submitForm();
  }
  // Close the lightbox
  private close(e: Event) {
    e.preventDefault();
    this.overlay.classList.add("is-hidden");
    ENGrid.setBodyData("has-lightbox", false);
    if (this.options.submitOnClose) {
      this.renderConversionField(
        "upsellFail",
        this._frequency.frequency,
        this._amount.amount,
        this._upsellFrequency,
        this._suggestAmount,
        this._frequency.frequency,
        this._amount.amount
      );
      this._form.submitForm();
    } else {
      this._form.dispatchError();
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
  private getFrequencyTxt(frequency: string = this._frequency.frequency) {
    const freqTxt = {
      onetime: "one-time",
      monthly: "monthly",
      quarterly: "quarterly",
      semi_annual: "semi-annual",
      annual: "annual",
    };
    const freq = frequency as keyof typeof freqTxt;
    return freq in freqTxt ? freqTxt[freq] : frequency;
  }
  private checkOtherAmount(value: number) {
    const otherInput = document.querySelector(".upsellOtherAmountInput");
    if (otherInput) {
      if (value >= this.options.minAmount) {
        otherInput.classList.remove("is-invalid");
      } else {
        otherInput.classList.add("is-invalid");
      }
    }
  }
  private renderConversionField(
    event: string, // The event that triggered the conversion
    freq: string, // The frequency of the donation (onetime, monthly, annual)
    amt: number, // The original amount of the donation (before the upsell)
    sugFreq: string, // The suggested frequency of the upsell
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
