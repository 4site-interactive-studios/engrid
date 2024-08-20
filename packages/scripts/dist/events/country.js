import { SimpleEventDispatcher } from "strongly-typed-events";
import { ENGrid } from "../engrid";
export class Country {
    constructor() {
        this._onCountryChange = new SimpleEventDispatcher();
        this._country = "";
        this._field = null;
        // Run only if it is a Page with a Country field
        this._field = document.getElementById("en__field_supporter_country");
        if (!this._field) {
            return;
        }
        document.addEventListener("change", (e) => {
            const element = e.target;
            if (element && element.name == "supporter.country") {
                this.country = element.value;
            }
        });
        // Set the country to the current value on the field
        this.country = ENGrid.getFieldValue("supporter.country");
    }
    static getInstance() {
        if (!Country.instance) {
            Country.instance = new Country();
        }
        return Country.instance;
    }
    get countryField() {
        return this._field;
    }
    get onCountryChange() {
        return this._onCountryChange.asEvent();
    }
    get country() {
        return this._country;
    }
    // Every time we set a country, trigger the onCountryChange event
    set country(value) {
        this._country = value;
        this._onCountryChange.dispatch(this._country);
    }
}
