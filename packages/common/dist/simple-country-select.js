// This class works when the user has added ".simple_country_select" as a class in page builder for the Country select
import * as cookie from "./cookie";
import { ENGrid } from ".";
export class SimpleCountrySelect {
    constructor() {
        this.countryWrapper = document.querySelector(".simple_country_select");
        this.countrySelect = document.querySelector("#en__field_supporter_country");
        this.countriesNames = new Intl.DisplayNames(["en"], {
            type: "region",
        });
        this.country = null;
        const engridAutofill = cookie.get("engrid-autofill");
        const submissionFailed = !!(ENGrid.checkNested(window.EngagingNetworks, "require", "_defined", "enjs", "checkSubmissionFailed") && window.EngagingNetworks.require._defined.enjs.checkSubmissionFailed());
        // Only run if there's no engrid-autofill cookie
        if (!engridAutofill && !submissionFailed) {
            fetch(`https://${window.location.hostname}/cdn-cgi/trace`)
                .then((res) => res.text())
                .then((t) => {
                let data = t.replace(/[\r\n]+/g, '","').replace(/\=+/g, '":"');
                data = '{"' + data.slice(0, data.lastIndexOf('","')) + '"}';
                const jsondata = JSON.parse(data);
                this.country = jsondata.loc;
                this.init();
                // console.log("Country:", this.country);
            });
        }
    }
    init() {
        if (this.countrySelect) {
            if (this.country) {
                // We are setting the country by Name because the ISO code is not always the same. They have 2 and 3 letter codes.
                this.setCountryByName(this.countriesNames.of(this.country));
            }
            let countrySelectLabel = this.countrySelect.options[this.countrySelect.selectedIndex].innerHTML;
            let countrySelectValue = this.countrySelect.options[this.countrySelect.selectedIndex].value;
            // @TODO Update so that it reads "(Outside X?)" where X is the Value of the Country Select. No need for long form version of it.
            if (countrySelectValue.toUpperCase() == "US" ||
                countrySelectValue.toUpperCase() == "USA") {
                countrySelectValue = " US";
            }
            if (countrySelectValue.toUpperCase() == "United States") {
                countrySelectLabel = "the US";
            }
            let countryWrapper = document.querySelector(".simple_country_select");
            if (countryWrapper) {
                // Remove Country Select tab index
                this.countrySelect.tabIndex = -1;
                // Find the address label
                let addressLabel = document.querySelector(".en__field--address1 label");
                // EN does not enforce a labels on fields so we have to check for it
                // @TODO Update so that this follows the same pattern / HTML structure as the Tippy tooltips which are added to labels. REF: https://github.com/4site-interactive-studios/engrid-aiusa/blob/6e4692d4f9a28b9668d6c1bfed5622ac0cc5bdb9/src/scripts/main.js#L42
                if (addressLabel) {
                    let labelText = addressLabel.innerHTML;
                    // Wrap the address label in a div to break out of the flexbox
                    this.wrap(addressLabel, document.createElement("div"));
                    // Add our link INSIDE the address label
                    // Includes both long form and short form variants
                    let newEl = document.createElement("span");
                    newEl.innerHTML =
                        ' <label id="en_custom_field_simple_country_select_long" class="en__field__label"><a href="javascript:void(0)">(Outside ' +
                            countrySelectLabel +
                            '?)</a></label><label id="en_custom_field_simple_country_select_short" class="en__field__label"><a href="javascript:void(0)">(Outside ' +
                            countrySelectValue +
                            "?)</a></label>";
                    addressLabel.innerHTML = `${labelText}${newEl.innerHTML}`;
                    addressLabel.querySelectorAll("a").forEach((el) => {
                        el.addEventListener("click", this.showCountrySelect.bind(this));
                    });
                    //this.insertAfter(newEl, addressLabel);
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
        let addressLabel = document.querySelector(".en__field--address1 label");
        let addressWrapper = (_a = addressLabel.parentElement) === null || _a === void 0 ? void 0 : _a.parentElement;
        addressWrapper.classList.add("country-select-visible");
        this.countrySelect.focus();
        // Reinstate Country Select tab index
        this.countrySelect.removeAttribute("tabIndex");
    }
    setCountryByName(countryName) {
        if (this.countrySelect) {
            let countrySelectOptions = this.countrySelect.options;
            for (let i = 0; i < countrySelectOptions.length; i++) {
                if (countrySelectOptions[i].innerHTML.toLowerCase() ==
                    countryName.toLowerCase()) {
                    this.countrySelect.selectedIndex = i;
                    break;
                }
            }
            const event = new Event("change", { bubbles: true });
            this.countrySelect.dispatchEvent(event);
        }
    }
}
