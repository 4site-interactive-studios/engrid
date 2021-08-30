import { ENGrid, UpsellPseudoSelectorOptionsDefaults, UpsellBase } from "./";
export class UpsellPseudoSelector extends UpsellBase {
    constructor() {
        super();
        let options = "EngridPseudoSelectorUpsell" in window ? window.EngridPseudoSelectorUpsell : {};
        this.options = Object.assign(Object.assign({}, UpsellPseudoSelectorOptionsDefaults), options);
        if (!this.shouldRun()) {
            if (ENGrid.debug)
                console.log("UpsellPseudoSelector script should NOT run");
            this.hidePseudoselector();
            return;
        }
        // Insert the pseudoselector field
        const siblingField = document.querySelector(this.options.siblingFieldSelector);
        if (siblingField) {
            const pseudoSelectorFieldWrapper = document.createElement("div");
            pseudoSelectorFieldWrapper.classList.add('en__field', 'en__field--checkbox', 'en__field--000000', 'en__field--monthly_upsell_checkbox', 'pseudo-en-field');
            pseudoSelectorFieldWrapper.innerHTML = `
        <div class="en__field en__field--checkbox en__field--000000 en__field--monthly_upsell_checkbox pseudo-en-field">
          <div class="en__field__element en__field__element--checkbox">
            <div class="en__field__item">
              <input class="en__field__input en__field__input--checkbox" id="en__field_supporter_monthly_upsell_checkbox" name="${this.options.pseudoSelectorFieldName}" type="checkbox" value="Y" /> 
              <label class="en__field__label en__field__label--item" for="en__field_supporter_monthly_upsell_checkbox">${this.options.label}</label>
            </div>
          </div>
        </div>
      `;
            siblingField.parentNode.insertBefore(pseudoSelectorFieldWrapper, siblingField.nextSibling);
        }
        // Set the frequency of the form to monthly if 
        const pseudoSelectorField = document.querySelector(`input[name='${this.options.pseudoSelectorFieldName}']`);
        pseudoSelectorField.addEventListener('change', () => {
            const pseudoSelectorField = document.querySelector(`input[name='${this.options.pseudoSelectorFieldName}']`);
            if (pseudoSelectorField && pseudoSelectorField.checked) {
                this.setOriginalAmount(this._amount.amount.toString());
                // TODO: Determine how to know which of these should I be calling
                this._frequency.setFrequency("monthly");
                this._frequency.setRecurrency("Y");
            }
            else {
                this.setOriginalAmount('');
                // TODO: Determine how to know which of these should I be calling
                this._frequency.setFrequency("onetime");
                this._frequency.setRecurrency("N");
            }
            console.log('PS value changed', this._amount.amount, this._frequency.frequency);
        });
        // Hide the pseudoSelector field if we're currently not making a one-time gift
        this._frequency.onFrequencyChange.subscribe((s) => {
            if (s == 'onetime') {
                this.showPseudoselector();
            }
            else {
                this.hidePseudoselector();
                this.setOriginalAmount('');
                window.sessionStorage.removeItem('original');
            }
        });
    }
    hidePseudoselector() {
        const pseudoSelectorFieldWrapper = document.querySelector(`.en__field--monthly_upsell_checkbox`);
        if (pseudoSelectorFieldWrapper) {
            pseudoSelectorFieldWrapper.style.display = 'none';
        }
        const pseudoSelectorField = document.querySelector(`input[name='${this.options.pseudoSelectorFieldName}']`);
        if (pseudoSelectorField) {
            pseudoSelectorField.checked = false;
        }
    }
    showPseudoselector() {
        const pseudoSelectorFieldWrapper = document.querySelector(`.en__field--monthly_upsell_checkbox`);
        if (pseudoSelectorFieldWrapper) {
            pseudoSelectorFieldWrapper.style.display = '';
        }
    }
    shouldRun() {
        return ('EngridPseudoSelectorUpsell' in window &&
            this.options.pseudoSelectorFieldName &&
            //document.querySelector(`input[name='${this.options.pseudoSelectorFieldName}']`) &&
            !!window.pageJson &&
            window.pageJson.pageType == "donation" &&
            window.pageJson.giftProcess == false);
    }
}
