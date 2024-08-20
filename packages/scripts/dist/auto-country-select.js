// This class works when the user has added ".simple_country_select" as a class in page builder for the Country select
import * as cookie from "./cookie";
import { ENGrid, Country } from ".";
export class AutoCountrySelect {
    constructor() {
        this._countryEvent = Country.getInstance();
        this.countryWrapper = document.querySelector(".simple_country_select");
        this.countrySelect = this._countryEvent
            .countryField;
        this.country = null;
        const engridAutofill = cookie.get("engrid-autofill");
        const submissionFailed = !!(ENGrid.checkNested(window.EngagingNetworks, "require", "_defined", "enjs", "checkSubmissionFailed") && window.EngagingNetworks.require._defined.enjs.checkSubmissionFailed());
        const hasIntlSupport = !!ENGrid.checkNested(window.Intl, "DisplayNames");
        // Only run if there's no engrid-autofill cookie && if it has Intl support && no country data in url
        const locationDataInUrl = ENGrid.getUrlParameter("supporter.country") ||
            ENGrid.getUrlParameter("supporter.region") ||
            (ENGrid.getUrlParameter("ea.url.id") &&
                !ENGrid.getUrlParameter("forwarded"));
        if (!engridAutofill &&
            !submissionFailed &&
            hasIntlSupport &&
            !locationDataInUrl) {
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
        else {
            this.init();
        }
    }
    init() {
        if (this.countrySelect) {
            if (this.country) {
                const countriesNames = new Intl.DisplayNames(["en"], {
                    type: "region",
                });
                // We are setting the country by Name because the ISO code is not always the same. They have 2 and 3 letter codes.
                this.setCountryByName(countriesNames.of(this.country));
            }
        }
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
