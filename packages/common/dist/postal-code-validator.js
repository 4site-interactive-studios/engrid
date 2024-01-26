import { ENGrid } from "./engrid";
import { EnForm } from "./events";
import { EngridLogger } from "./logger";
// Conditionally validates the postcode field for a US format zip code
// If US is selected as the country, a country has not been selected yet
// or if there is no country field
// Allows blank zip code if zip code is not required.
export class PostalCodeValidator {
    constructor() {
        var _a, _b;
        this.postalCodeField = ENGrid.getField("supporter.postcode");
        this._form = EnForm.getInstance();
        this.logger = new EngridLogger("Postal Code Validator", "white", "red", "📬");
        this.supportedSeparators = ["+", "-", " "];
        this.separator = this.getSeparator();
        this.regexSeparator = this.getRegexSeparator(this.separator);
        if (this.shouldRun()) {
            (_a = this.postalCodeField) === null || _a === void 0 ? void 0 : _a.addEventListener("blur", () => this.validate());
            (_b = this.postalCodeField) === null || _b === void 0 ? void 0 : _b.addEventListener("input", () => this.liveValidate());
            this._form.onValidate.subscribe(() => {
                if (!this._form.validate)
                    return;
                this.liveValidate();
                // It seems like we need some delay or EN removes our error message.
                setTimeout(() => {
                    this.validate();
                }, 100);
                // We dont need to validate the zip code, or it is valid
                const postalCodeValid = !this.shouldValidateUSZipCode() || this.isValidUSZipCode();
                this._form.validate = postalCodeValid;
                if (!postalCodeValid) {
                    this.logger.log(`Invalid Zip Code ${this.postalCodeField.value}`);
                    this.postalCodeField.scrollIntoView({ behavior: "smooth" });
                }
                return postalCodeValid;
            });
        }
    }
    shouldRun() {
        return !!(ENGrid.getOption("PostalCodeValidator") && this.postalCodeField);
    }
    validate() {
        if (this.shouldValidateUSZipCode() && !this.isValidUSZipCode()) {
            ENGrid.setError(".en__field--postcode", `Please enter a valid ZIP Code of ##### or #####${this.separator}####`);
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
        const postalCodeRegex = new RegExp(`^\\d{5}(${this.regexSeparator}\\d{4})?$`);
        return !!((_b = this.postalCodeField) === null || _b === void 0 ? void 0 : _b.value.match(postalCodeRegex));
    }
    /**
     * Formats the zip code to #####-####  as the user inputs it
     * The separator is determined by the TidyContact option, but defaults to "-"
     */
    liveValidate() {
        var _a;
        if (!this.shouldValidateUSZipCode())
            return;
        let value = (_a = this.postalCodeField) === null || _a === void 0 ? void 0 : _a.value;
        // Removing all non-numeric characters and separators in the wrong position
        value = value.replace(/[^0-9\s+-]|(?<!^.{5})[\s+-]/g, "");
        //replace + and space with - and insert a dash after the 5th character if a 6th character is entered
        if (value.match(/\d{5}/)) {
            value = value.replace(/[\s+]/g, this.separator);
            value = value.replace(/(\d{5})(\d)/, `$1${this.separator}$2`);
        }
        //set field value with max 10 characters
        this.postalCodeField.value = value.slice(0, 10);
    }
    shouldValidateUSZipCode() {
        // Validating US zip code only if country is US, country has not yet been selected
        // or if there is no country field
        const country = ENGrid.getField("supporter.country")
            ? ENGrid.getFieldValue("supporter.country")
            : "US";
        return ["us", "united states", "usa", ""].includes(country.toLowerCase());
    }
    getSeparator() {
        const tidyContact = ENGrid.getOption("TidyContact");
        if (tidyContact &&
            tidyContact.us_zip_divider &&
            this.supportedSeparators.includes(tidyContact.us_zip_divider)) {
            return tidyContact.us_zip_divider;
        }
        return "-";
    }
    getRegexSeparator(separator) {
        switch (separator) {
            case "+":
                return "\\+";
            case "-":
                return "-";
            case " ":
                return "\\s";
            default:
                this.logger.log(`Invalid separator "${separator}" provided to PostalCodeValidator, falling back to "-".`);
                return "-";
        }
    }
}
