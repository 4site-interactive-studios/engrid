import { ENGrid, EngridLogger, ProcessingFees, UpsellOptionsDefaults, DataLayer, } from "./";
import { DonationAmount, DonationFrequency, EnForm } from "./events";
export class UpsellLightbox {
    constructor() {
        this.overlay = document.createElement("div");
        this._form = EnForm.getInstance();
        this._amount = DonationAmount.getInstance();
        this._fees = ProcessingFees.getInstance();
        this._frequency = DonationFrequency.getInstance();
        this._dataLayer = DataLayer.getInstance();
        this.logger = new EngridLogger("UpsellLightbox", "black", "pink", "🪟");
        let options = "EngridUpsell" in window ? window.EngridUpsell : {};
        this.options = Object.assign(Object.assign({}, UpsellOptionsDefaults), options);
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
    renderLightbox() {
        const title = this.options.title
            .replace("{new-amount}", "<span class='upsell_suggestion'></span>")
            .replace("{old-amount}", "<span class='upsell_amount'></span>")
            .replace("{old-frequency}", "<span class='upsell_frequency'></span>");
        const paragraph = this.options.paragraph
            .replace("{new-amount}", "<span class='upsell_suggestion'></span>")
            .replace("{old-amount}", "<span class='upsell_amount'></span>")
            .replace("{old-frequency}", "<span class='upsell_frequency'></span>");
        const yes = this.options.yesLabel
            .replace("{new-amount}", "<span class='upsell_suggestion'></span>")
            .replace("{old-amount}", "<span class='upsell_amount'></span>")
            .replace("{old-frequency}", "<span class='upsell_frequency'></span>");
        const no = this.options.noLabel
            .replace("{new-amount}", "<span class='upsell_suggestion'></span>")
            .replace("{old-amount}", "<span class='upsell_amount'></span>")
            .replace("{old-frequency}", "<span class='upsell_frequency'></span>");
        const markup = `
            <div class="upsellLightboxContainer" id="goMonthly">
              <!-- ideal image size is 480x650 pixels -->
              <div class="background" style="background-image: url('${this.options.image}');"></div>
              <div class="upsellLightboxContent">
              ${this.options.canClose ? `<span id="goMonthlyClose"></span>` : ``}
                <h1>
                  ${title}
                </h1>
                ${this.options.otherAmount
            ? `
                <div class="upsellOtherAmount">
                  <div class="upsellOtherAmountLabel">
                    <p>
                      ${this.options.otherLabel}
                    </p>
                  </div>
                  <div class="upsellOtherAmountInput">
                    <input href="#" id="secondOtherField" name="secondOtherField" type="text" value="" inputmode="decimal" aria-label="Enter your custom donation amount" autocomplete="off" data-lpignore="true" aria-required="true" size="12">
                    <small>Minimum ${this.getAmountTxt(this.options.minAmount)}</small>
                  </div>
                </div>
                `
            : ``}

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
        const closeButton = this.overlay.querySelector("#goMonthlyClose");
        const yesButton = this.overlay.querySelector("#upsellYesButton a");
        const noButton = this.overlay.querySelector("#upsellNoButton button");
        yesButton.addEventListener("click", this.continue.bind(this));
        noButton.addEventListener("click", this.continue.bind(this));
        if (closeButton)
            closeButton.addEventListener("click", this.close.bind(this));
        this.overlay.addEventListener("click", (e) => {
            if (e.target instanceof Element &&
                e.target.id == this.overlay.id &&
                this.options.canClose) {
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
    shouldRun() {
        // const hideModal = cookie.get("hideUpsell"); // Get cookie
        // if it's a first page of a Donation page
        return (
        // !hideModal &&
        !this.shouldSkip() &&
            "EngridUpsell" in window &&
            !!window.pageJson &&
            window.pageJson.pageNumber == 1 &&
            ["donation", "premiumgift"].includes(window.pageJson.pageType));
    }
    shouldSkip() {
        if ("EngridUpsell" in window && window.EngridUpsell.skipUpsell) {
            return true;
        }
        return this.options.skipUpsell;
    }
    popupOtherField() {
        var _a, _b;
        const value = parseFloat((_b = (_a = this.overlay.querySelector("#secondOtherField")) === null || _a === void 0 ? void 0 : _a.value) !== null && _b !== void 0 ? _b : "");
        const live_upsell_amount = document.querySelectorAll("#upsellYesButton .upsell_suggestion");
        const upsellAmount = this.getUpsellAmount();
        if (!isNaN(value) && value > 0) {
            this.checkOtherAmount(value);
        }
        else {
            this.checkOtherAmount(upsellAmount);
        }
        live_upsell_amount.forEach((elem) => (elem.innerHTML = this.getAmountTxt(upsellAmount + this._fees.calculateFees(upsellAmount))));
    }
    liveAmounts() {
        const live_upsell_amount = document.querySelectorAll(".upsell_suggestion");
        const live_amount = document.querySelectorAll(".upsell_amount");
        const upsellAmount = this.getUpsellAmount();
        const suggestedAmount = upsellAmount + this._fees.calculateFees(upsellAmount);
        live_upsell_amount.forEach((elem) => (elem.innerHTML = this.getAmountTxt(suggestedAmount)));
        live_amount.forEach((elem) => (elem.innerHTML = this.getAmountTxt(this._amount.amount + this._fees.fee)));
    }
    liveFrequency() {
        const live_upsell_frequency = document.querySelectorAll(".upsell_frequency");
        live_upsell_frequency.forEach((elem) => (elem.innerHTML = this.getFrequencyTxt()));
    }
    // Return the Suggested Upsell Amount
    getUpsellAmount() {
        var _a, _b;
        const amount = this._amount.amount;
        const otherAmount = parseFloat((_b = (_a = this.overlay.querySelector("#secondOtherField")) === null || _a === void 0 ? void 0 : _a.value) !== null && _b !== void 0 ? _b : "");
        if (otherAmount > 0) {
            return otherAmount > this.options.minAmount
                ? otherAmount
                : this.options.minAmount;
        }
        let upsellAmount = 0;
        for (let i = 0; i < this.options.amountRange.length; i++) {
            let val = this.options.amountRange[i];
            if (upsellAmount == 0 && amount <= val.max) {
                upsellAmount = val.suggestion;
                if (upsellAmount === 0)
                    return 0;
                if (typeof upsellAmount !== "number") {
                    const suggestionMath = upsellAmount.replace("amount", amount.toFixed(2));
                    upsellAmount = parseFloat(Function('"use strict";return (' + suggestionMath + ")")());
                }
                break;
            }
        }
        return upsellAmount > this.options.minAmount
            ? upsellAmount
            : this.options.minAmount;
    }
    shouldOpen() {
        const upsellAmount = this.getUpsellAmount();
        const paymenttype = ENGrid.getFieldValue("transaction.paymenttype") || "";
        // If frequency is not onetime or
        // the modal is already opened or
        // there's no suggestion for this donation amount,
        // we should not open
        if (this.freqAllowed() &&
            !this.shouldSkip() &&
            !this.options.disablePaymentMethods.includes(paymenttype.toLowerCase()) &&
            !this.overlay.classList.contains("is-submitting") &&
            upsellAmount > 0) {
            this.logger.log("Upsell Frequency " + this._frequency.frequency);
            this.logger.log("Upsell Amount " + this._amount.amount);
            this.logger.log("Upsell Suggested Amount " + upsellAmount);
            return true;
        }
        return false;
    }
    // Return true if the current frequency is allowed by the options
    freqAllowed() {
        const freq = this._frequency.frequency;
        const allowed = [];
        if (this.options.oneTime)
            allowed.push("onetime");
        if (this.options.annual)
            allowed.push("annual");
        return allowed.includes(freq);
    }
    open() {
        this.logger.log("Upsell script opened");
        if (!this.shouldOpen()) {
            // In the circumstance when the form fails to validate via server-side validation, the page will reload
            // When that happens, we should place the original amount saved in sessionStorage into the upsell original amount field
            let original = window.sessionStorage.getItem("original");
            if (original &&
                document.querySelectorAll(".en__errorList .en__error").length > 0) {
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
    setOriginalAmount(original) {
        if (this.options.upsellOriginalGiftAmountFieldName) {
            let enFieldUpsellOriginalAmount = document.querySelector(".en__field__input.en__field__input--hidden[name='" +
                this.options.upsellOriginalGiftAmountFieldName +
                "']");
            if (!enFieldUpsellOriginalAmount) {
                let pageform = document.querySelector("form.en__component--page");
                if (pageform) {
                    let input = document.createElement("input");
                    input.setAttribute("type", "hidden");
                    input.setAttribute("name", this.options.upsellOriginalGiftAmountFieldName);
                    input.classList.add("en__field__input", "en__field__input--hidden");
                    pageform.appendChild(input);
                    enFieldUpsellOriginalAmount = document.querySelector('.en__field__input.en__field__input--hidden[name="' +
                        this.options.upsellOriginalGiftAmountFieldName +
                        '"]');
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
    continue(e) {
        var _a;
        e.preventDefault();
        if (e.target instanceof Element &&
            ((_a = document.querySelector("#upsellYesButton")) === null || _a === void 0 ? void 0 : _a.contains(e.target))) {
            this.logger.success("Upsold");
            this.setOriginalAmount(this._amount.amount.toString());
            const upsoldAmount = this.getUpsellAmount();
            const originalAmount = this._amount.amount;
            this._frequency.setFrequency("monthly");
            this._amount.setAmount(upsoldAmount);
            this._dataLayer.addEndOfGiftProcessEvent("ENGRID_UPSELL", {
                eventValue: true,
                originalAmount: originalAmount,
                upsoldAmount: upsoldAmount,
                frequency: "monthly",
            });
            this._dataLayer.addEndOfGiftProcessVariable("ENGRID_UPSELL", true);
            this._dataLayer.addEndOfGiftProcessVariable("ENGRID_UPSELL_ORIGINAL_AMOUNT", originalAmount);
            this._dataLayer.addEndOfGiftProcessVariable("ENGRID_UPSELL_DONATION_FREQUENCY", "MONTHLY");
        }
        else {
            this.setOriginalAmount("");
            window.sessionStorage.removeItem("original");
            this._dataLayer.addEndOfGiftProcessVariable("ENGRID_UPSELL", false);
            this._dataLayer.addEndOfGiftProcessVariable("ENGRID_UPSELL_DONATION_FREQUENCY", "ONE-TIME");
        }
        this._form.submitForm();
    }
    // Close the lightbox (no cookies)
    close(e) {
        e.preventDefault();
        // cookie.set("hideUpsell", "1", { expires: 1 }); // Create one day cookie
        this.overlay.classList.add("is-hidden");
        ENGrid.setBodyData("has-lightbox", false);
        if (this.options.submitOnClose) {
            this._form.submitForm();
        }
        else {
            this._form.dispatchError();
        }
    }
    getAmountTxt(amount = 0) {
        var _a, _b, _c, _d;
        const symbol = (_a = ENGrid.getCurrencySymbol()) !== null && _a !== void 0 ? _a : "$";
        const dec_separator = (_b = ENGrid.getOption("DecimalSeparator")) !== null && _b !== void 0 ? _b : ".";
        const thousands_separator = (_c = ENGrid.getOption("ThousandsSeparator")) !== null && _c !== void 0 ? _c : "";
        const dec_places = amount % 1 == 0 ? 0 : (_d = ENGrid.getOption("DecimalPlaces")) !== null && _d !== void 0 ? _d : 2;
        const amountTxt = ENGrid.formatNumber(amount, dec_places, dec_separator, thousands_separator);
        return amount > 0 ? symbol + amountTxt : "";
    }
    getFrequencyTxt() {
        const freqTxt = {
            onetime: "one-time",
            monthly: "monthly",
            annual: "annual",
        };
        const frequency = this._frequency.frequency;
        return frequency in freqTxt ? freqTxt[frequency] : frequency;
    }
    checkOtherAmount(value) {
        const otherInput = document.querySelector(".upsellOtherAmountInput");
        if (otherInput) {
            if (value >= this.options.minAmount) {
                otherInput.classList.remove("is-invalid");
            }
            else {
                otherInput.classList.add("is-invalid");
            }
        }
    }
}
