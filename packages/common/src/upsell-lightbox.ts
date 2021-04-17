import * as cookie from "./cookie";
import { ENGrid, UpsellOptions, UpsellOptionsDefaults } from "./";
import { DonationAmount, DonationFrequency, EnForm } from "./events";

export class UpsellLightbox extends ENGrid {
  private options: UpsellOptions;
  private debug: boolean;
  private overlay: HTMLDivElement = document.createElement("div");
  private _form: EnForm = EnForm.getInstance();
  public _amount: DonationAmount = DonationAmount.getInstance();
  private _frequency: DonationFrequency = DonationFrequency.getInstance();
  constructor() {
    super();
    let options = "EngridUpsell" in window ? window.EngridUpsell : {};
    this.options = { ...UpsellOptionsDefaults, ...options };
    this.debug = UpsellLightbox.getOption('Debug') || false;
    if (!this.shouldRun()) {
      if (this.debug) console.log("Upsell script should NOT run");
      // If we're not on a Donation Page, get out
      return;
    }
    this.overlay.id = "enModal";
    this.overlay.classList.add("is-hidden");
    this.overlay.classList.add("image-" + this.options.imagePosition);
    this.renderLightbox();
    this._form.onSubmit.subscribe(() => this.open());
  }
  private renderLightbox() {
    const title = this.options.title
      .replace("{new-amount}", "<span class='upsell_suggestion'></span>")
      .replace("{old-amount}", "<span class='upsell_amount'></span>");
    const paragraph = this.options.paragraph
      .replace("{new-amount}", "<span class='upsell_suggestion'></span>")
      .replace("{old-amount}", "<span class='upsell_amount'></span>");
    const yes = this.options.yesLabel
      .replace("{new-amount}", "<span class='upsell_suggestion'></span>")
      .replace("{old-amount}", "<span class='upsell_amount'></span>");
    const no = this.options.noLabel
      .replace("{new-amount}", "<span class='upsell_suggestion'></span>")
      .replace("{old-amount}", "<span class='upsell_amount'></span>");
    const markup = `
            <div class="upsellLightboxContainer" id="goMonthly">
              <!-- ideal image size is 480x650 pixels -->
              <div class="background" style="background-image: url('${this.options.image
      }');"></div>
              <div class="upsellLightboxContent">
              ${this.options.canClose ? `<span id="goMonthlyClose"></span>` : ``
      }
                <h1>
                  ${title}
                </h1>
                ${this.options.otherAmount
        ? `
                <p>
                  <span>${this.options.otherLabel}</span>
                  <input href="#" id="secondOtherField" name="secondOtherField" size="12" type="number" inputmode="numeric" step="1" value="">
                </p>
                `
        : ``
      }

                <p>
                  ${paragraph}
                </p>
                <!-- YES BUTTON -->
                <div id="upsellYesButton">
                  <a href="#">
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
    const closeButton = this.overlay.querySelector("#goMonthlyClose") as HTMLElement;
    const yesButton = this.overlay.querySelector("#upsellYesButton a") as HTMLLinkElement;
    const noButton = this.overlay.querySelector("#upsellNoButton button") as HTMLButtonElement;
    yesButton.addEventListener("click", this.continue.bind(this));
    noButton.addEventListener("click", this.continue.bind(this));
    if (closeButton)
      closeButton.addEventListener("click", this.close.bind(this));
    this.overlay.addEventListener("click", (e: Event) => {
      if (e.target instanceof Element && e.target.id == this.overlay.id && this.options.canClose) {
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
    if (this.debug) console.log("Upsell script rendered");
  }
  // Should we run the script?
  private shouldRun() {
    // const hideModal = cookie.get("hideUpsell"); // Get cookie
    // if it's a first page of a Donation page
    return (
      // !hideModal &&
      'EngridUpsell' in window &&
      !!window.pageJson &&
      window.pageJson.pageNumber == 1 &&
      window.pageJson.pageType == "donation"
    );
  }

  private popupOtherField() {
    const value = parseFloat(this.overlay.querySelector<HTMLInputElement>("#secondOtherField")?.value ?? "");
    const live_upsell_amount = document.querySelectorAll(
      "#upsellYesButton .upsell_suggestion"
    );

    if (!isNaN(value) && value > 0) {
      live_upsell_amount.forEach(
        (elem) => (elem.innerHTML = "$" + value.toFixed(2))
      );
    } else {
      live_upsell_amount.forEach(
        (elem) => (elem.innerHTML = "$" + this.getUpsellAmount().toFixed(2))
      );
    }
  }

  private liveAmounts() {
    const live_upsell_amount = document.querySelectorAll(".upsell_suggestion");
    const live_amount = document.querySelectorAll(".upsell_amount");
    const suggestedAmount = this.getUpsellAmount();

    live_upsell_amount.forEach(
      (elem) => (elem.innerHTML = "$" + suggestedAmount.toFixed(2))
    );
    live_amount.forEach(
      (elem) => (elem.innerHTML = "$" + this._amount.amount.toFixed(2))
    );
  }

  // Return the Suggested Upsell Amount
  private getUpsellAmount() {
    const amount = this._amount.amount;
    const otherAmount = parseFloat(this.overlay.querySelector<HTMLInputElement>("#secondOtherField")?.value ?? "");
    if (otherAmount > 0) {
      return otherAmount;
    }
    let upsellAmount: string | number = 0;
    this.options.amountRange.forEach((val) => {
      if (upsellAmount == 0 && amount <= val.max) {
        upsellAmount = val.suggestion;
        if (typeof val.suggestion != 'number') {
          const suggestionMath = val.suggestion.replace("amount", amount.toFixed(2));
          upsellAmount = Function('"use strict";return (' + suggestionMath + ')')();
        }
      }
    });
    return upsellAmount;
  }
  private shouldOpen() {
    const freq = this._frequency.frequency;
    const upsellAmount = this.getUpsellAmount();
    // If frequency is not onetime or
    // the modal is already opened or
    // there's no suggestion for this donation amount,
    // we should not open
    if (
      freq == "onetime" &&
      !this.overlay.classList.contains("is-submitting") &&
      upsellAmount > 0
    ) {
      if (this.debug) {
        console.log("Upsell Frequency", this._frequency.frequency);
        console.log("Upsell Amount", this._amount.amount);
        console.log("Upsell Suggested Amount", upsellAmount);
      }
      return true;
    }
    return false;
  }

  private open() {
    if (this.debug) console.log("Upsell Script Triggered");
    if (!this.shouldOpen()) {
      // Returning true will give the "go ahead" to submit the form
      this._form.submit = true;
      return true;
    }
    this.liveAmounts();
    this.overlay.classList.remove("is-hidden");
    this._form.submit = false;
    return false;
  }
  // Proceed to the next page (upsold or not)
  private continue(e: Event) {
    e.preventDefault();
    if (e.target instanceof Element && document.querySelector("#upsellYesButton")?.contains(e.target)) {
      if (this.debug) console.log("Upsold");
      this._frequency.setFrequency("monthly");
      this._amount.setAmount(this.getUpsellAmount());
    }
    this._form.submitForm();
  }
  // Close the lightbox (no cookies)
  private close(e: Event) {
    e.preventDefault();
    // cookie.set("hideUpsell", "1", { expires: 1 }); // Create one day cookie
    this.overlay.classList.add("is-hidden");
    if (this.options.submitOnClose) {
      this._form.submitForm();
    } else {
      this._form.dispatchError();
    }
  }
}