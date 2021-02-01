// This class works when the user has added ".simple_country_select" as a class in page builder for the Country select
export default class SimpleCountrySelect {

    public countryWrapper: HTMLDivElement = document.querySelector('.simple_country_select') as HTMLDivElement;
    public countrySelect: HTMLSelectElement = document.querySelector('#en__field_supporter_country') as HTMLSelectElement;
    constructor() {
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
                let addressLabel: HTMLLabelElement = document.querySelector('.en__field--address1 label') as HTMLLabelElement;
                let addressWrapper: HTMLDivElement = addressLabel.parentElement?.parentElement as HTMLDivElement;

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
    private insertAfter(el: any, referenceNode: any) {
        const parentElement = referenceNode.parentNode as HTMLDivElement;
        parentElement.insertBefore(el, referenceNode.nextSibling);
    }

    // Helper function to wrap a target in a new element
    private wrap(el: HTMLLabelElement, wrapper: HTMLDivElement) {
        const parentElement = el.parentNode as HTMLDivElement;
        parentElement.insertBefore(wrapper, el);
        wrapper.appendChild(el);
    }

    public showCountrySelect(e: Event) {
        e.preventDefault();
        this.countryWrapper.classList.add("country-select-visible");
        let addressLabel: HTMLLabelElement = document.querySelector('.en__field--address1 label') as HTMLLabelElement;
        let addressWrapper: HTMLDivElement = addressLabel.parentElement?.parentElement as HTMLDivElement;
        addressWrapper.classList.add("country-select-visible");
        this.countrySelect.focus();

        // Reinstate Country Select tab index
        this.countrySelect.removeAttribute("tabIndex");
    }
}
