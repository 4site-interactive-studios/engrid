import { ENGrid } from "./engrid";
import { EnForm } from "./events";
// Validates the postcode field for a US format zip code
// If US is selected as the country, a country has not been selected yet
// or if there is no country field
// Allows blank zip code if zip code is not required.
export class PostalCodeValidator {
    constructor() {
        var _a, _b;
        this.postalCodeField = ENGrid.getField("supporter.postcode");
        this._form = EnForm.getInstance();
        if (this.shouldRun()) {
            (_a = this.postalCodeField) === null || _a === void 0 ? void 0 : _a.addEventListener("blur", () => this.validate());
            (_b = this.postalCodeField) === null || _b === void 0 ? void 0 : _b.addEventListener("input", () => this.liveValidate());
            this._form.onValidate.subscribe(() => {
                // It seems like we need some delay or EN removes our error message.
                setTimeout(() => {
                    this.validate();
                }, 100);
                // We dont need to validate the zip code, or it is valid
                return !this.shouldValidateUSZipCode() || this.isValidUSZipCode();
            });
        }
    }
    shouldRun() {
        return !!this.postalCodeField;
    }
    validate() {
        if (this.shouldValidateUSZipCode() && !this.isValidUSZipCode()) {
            ENGrid.setError(".en__field--postcode", "Please enter a valid zip code.");
        }
        else {
            ENGrid.removeError(".en__field--postcode");
        }
    }
    isValidUSZipCode() {
        var _a, _b;
        const zipCodeRequired = !!document.querySelector(".en__field--postcode.en__mandatory");
        // If zip code is not required in EN Form Block and the field is empty, it is valid
        if (!zipCodeRequired && ((_a = this.postalCodeField) === null || _a === void 0 ? void 0 : _a.value) === "") {
            return true;
        }
        return !!((_b = this.postalCodeField) === null || _b === void 0 ? void 0 : _b.value.match(/^\d{5}(-\d{4})?$/));
    }
    liveValidate() {
        var _a;
        if (this.shouldValidateUSZipCode() &&
            ((_a = this.postalCodeField) === null || _a === void 0 ? void 0 : _a.value.match(/[^0-9-]/))) {
            ENGrid.setError(".en__field--postcode", "Please enter a valid zip code.");
        }
        else {
            ENGrid.removeError(".en__field--postcode");
        }
    }
    shouldValidateUSZipCode() {
        // Validating US zip code only if country is US, country has not yet been selected
        // or if there is no country field
        const country = ENGrid.getField("supporter.country")
            ? ENGrid.getFieldValue("supporter.country")
            : "US";
        return ["US", "United States", ""].includes(country);
    }
}
