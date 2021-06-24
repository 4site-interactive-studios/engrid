// This class works when the user has added ".simple_country_select" as a class in page builder for the Country select
export class SimpleCountrySelect {
    constructor() {
        var _a;
        this.countryWrapper = document.querySelector('.simple_country_select');
        this.countrySelect = document.querySelector('#en__field_supporter_country');
        if (this.countrySelect) {
            let countrySelecLabel = this.countrySelect.options[this.countrySelect.selectedIndex].innerHTML;
            let countrySelecValue = this.countrySelect.options[this.countrySelect.selectedIndex].value;
            if (countrySelecValue == "US") {
                countrySelecValue = " US";
            }
            if (countrySelecLabel == "United States") {
                countrySelecLabel = "the United States";
            }
            let countryWrapper = document.querySelector('.simple_country_select');
            if (countryWrapper) {
                // Remove Country Select tab index
                this.countrySelect.tabIndex = -1;
                // Find the address label
                let addressLabel = document.querySelector('.en__field--address1 label');
                let addressWrapper = (_a = addressLabel.parentElement) === null || _a === void 0 ? void 0 : _a.parentElement;
                // EN does not enforce a labels on fields so we have to check for it
                if (addressLabel) {
                    // Wrap the address label in a div to break out of the flexbox
                    this.wrap(addressLabel, document.createElement('div'));
                    // Add our link after the address label
                    // Includes both long form and short form variants
                    let newEl = document.createElement('span');
                    newEl.innerHTML = ' <label id="en_custom_field_simple_country_select_long" class="en__field__label"><a href="javascript:void(0)">(Outside ' + countrySelecLabel + '?)</a></label><label id="en_custom_field_simple_country_select_short" class="en__field__label"><a href="javascript:void(0)">(Outside ' + countrySelecValue + '?)</a></label>';
                    newEl.querySelectorAll("a").forEach(el => {
                        el.addEventListener("click", this.showCountrySelect.bind(this));
                    });
                    this.insertAfter(newEl, addressLabel);
                }
            }
        }
    }
    // Helper function to insert HTML after a node
    insertAfter(el, referenceNode) {
        const parentElement = referenceNode.parentNode;
        parentElement.insertBefore(el, referenceNode.nextSibling);
    }
    // Helper function to wrap a target in a new element
    wrap(el, wrapper) {
        const parentElement = el.parentNode;
        parentElement.insertBefore(wrapper, el);
        wrapper.appendChild(el);
    }
    showCountrySelect(e) {
        var _a;
        e.preventDefault();
        this.countryWrapper.classList.add("country-select-visible");
        let addressLabel = document.querySelector('.en__field--address1 label');
        let addressWrapper = (_a = addressLabel.parentElement) === null || _a === void 0 ? void 0 : _a.parentElement;
        addressWrapper.classList.add("country-select-visible");
        this.countrySelect.focus();
        // Reinstate Country Select tab index
        this.countrySelect.removeAttribute("tabIndex");
    }
}
