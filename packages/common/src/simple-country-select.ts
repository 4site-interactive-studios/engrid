// This class works when the user has added ".simple_country_select" as a class in page builder for the Country select
import * as cookie from "./cookie";
export class SimpleCountrySelect {
  public countryWrapper: HTMLDivElement = document.querySelector(
    ".simple_country_select"
  ) as HTMLDivElement;
  public countrySelect: HTMLSelectElement = document.querySelector(
    "#en__field_supporter_country"
  ) as HTMLSelectElement;
  private countriesNames = new (Intl as any).DisplayNames(["en"], {
    type: "region",
  });
  private country = null;
  constructor() {
    const engridAutofill = cookie.get("engrid-autofill");
    // Only run if there's no engrid-autofill cookie
    if (
      !engridAutofill &&
      !window.EngagingNetworks.require._defined.enjs.checkSubmissionFailed()
    ) {
      fetch("https://www.cloudflare.com/cdn-cgi/trace")
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

  private init() {
    if (this.countrySelect) {
      if (this.country) {
        // We are setting the country by Name because the ISO code is not always the same. They have 2 and 3 letter codes.
        this.setCountryByName(this.countriesNames.of(this.country));
      }
      let countrySelectLabel =
        this.countrySelect.options[this.countrySelect.selectedIndex].innerHTML;
      let countrySelectValue =
        this.countrySelect.options[this.countrySelect.selectedIndex].value;

      // @TODO Update so that it reads "(Outside X?)" where X is the Value of the Country Select. No need for long form version of it.
      if (countrySelectValue == "US") {
        countrySelectValue = " US";
      }

      if (countrySelectLabel == "United States") {
        countrySelectLabel = "the United States";
      }

      let countryWrapper = document.querySelector(".simple_country_select");

      if (countryWrapper) {
        // Remove Country Select tab index
        this.countrySelect.tabIndex = -1;

        // Find the address label
        let addressLabel: HTMLLabelElement = document.querySelector(
          ".en__field--address1 label"
        ) as HTMLLabelElement;

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
    let addressLabel: HTMLLabelElement = document.querySelector(
      ".en__field--address1 label"
    ) as HTMLLabelElement;
    let addressWrapper: HTMLDivElement = addressLabel.parentElement
      ?.parentElement as HTMLDivElement;
    addressWrapper.classList.add("country-select-visible");
    this.countrySelect.focus();

    // Reinstate Country Select tab index
    this.countrySelect.removeAttribute("tabIndex");
  }
  private setCountryByName(countryName: string) {
    if (this.countrySelect) {
      let countrySelectOptions = this.countrySelect.options;
      for (let i = 0; i < countrySelectOptions.length; i++) {
        if (
          countrySelectOptions[i].innerHTML.toLowerCase() ==
          countryName.toLowerCase()
        ) {
          this.countrySelect.selectedIndex = i;
          break;
        }
      }
      const event = new Event("change", { bubbles: true });
      this.countrySelect.dispatchEvent(event);
    }
  }
}
