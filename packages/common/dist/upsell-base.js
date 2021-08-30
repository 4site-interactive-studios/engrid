import { DonationAmount, DonationFrequency } from "./events";
export class UpsellBase {
    constructor() {
        this._amount = DonationAmount.getInstance();
        this._frequency = DonationFrequency.getInstance();
        // In the circumstance when the form fails to validate via server-side validation, the page will reload
        // When that happens, we should place the original amount saved in sessionStorage into the upsell original amount field
        let original = window.sessionStorage.getItem('original');
        if (original && document.querySelectorAll('.en__errorList .en__error').length > 0) {
            this.setOriginalAmount(original);
        }
    }
    // Set the original amount into a hidden field using the upsellOriginalGiftAmountFieldName, if provided
    setOriginalAmount(original) {
        if (this.options.upsellOriginalGiftAmountFieldName) {
            let enFieldUpsellOriginalAmount = document.querySelector(".en__field__input.en__field__input--hidden[name='" + this.options.upsellOriginalGiftAmountFieldName + "']");
            if (!enFieldUpsellOriginalAmount) {
                let pageform = document.querySelector("form.en__component--page");
                if (pageform) {
                    let input = document.createElement("input");
                    input.setAttribute("type", "hidden");
                    input.setAttribute("name", this.options.upsellOriginalGiftAmountFieldName);
                    input.classList.add('en__field__input', 'en__field__input--hidden');
                    pageform.appendChild(input);
                    enFieldUpsellOriginalAmount = document.querySelector('.en__field__input.en__field__input--hidden[name="' + this.options.upsellOriginalGiftAmountFieldName + '"]');
                }
            }
            console.log('efuoa', enFieldUpsellOriginalAmount);
            if (enFieldUpsellOriginalAmount) {
                // save it to a session variable just in case this page reloaded due to server-side validation error
                window.sessionStorage.setItem('original', original);
                enFieldUpsellOriginalAmount.setAttribute("value", original);
            }
        }
    }
}
