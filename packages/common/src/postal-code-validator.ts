import { ENGrid } from "./engrid";
import { EnForm } from "./events";
import { EngridLogger } from "./logger";
import { Options } from "./interfaces/options";

// Conditionally validates the postcode field for a US format zip code
// If US is selected as the country, a country has not been selected yet
// or if there is no country field
// Allows blank zip code if zip code is not required.
export class PostalCodeValidator {
  private postalCodeField = ENGrid.getField(
    "supporter.postcode"
  ) as HTMLInputElement;
  private _form: EnForm = EnForm.getInstance();
  private logger = new EngridLogger(
    "Postal Code Validator",
    "white",
    "red",
    "📬"
  );
  private separator: string;
  private regexSeparator: string;
  private supportedSeparators = ["+", "-", " "];

  constructor() {
    this.separator = this.getSeparator();
    this.regexSeparator = this.getRegexSeparator(this.separator);

    if (this.shouldRun()) {
      this.postalCodeField?.addEventListener("blur", () => this.validate());
      this.postalCodeField?.addEventListener("input", () =>
        this.liveValidate()
      );
      this._form.onValidate.subscribe(() => {
        if (!this._form.validate) return;

        this.liveValidate();

        // It seems like we need some delay or EN removes our error message.
        setTimeout(() => {
          this.validate();
        }, 100);

        // We dont need to validate the zip code, or it is valid
        const postalCodeValid =
          !this.shouldValidateUSZipCode() || this.isValidUSZipCode();
        this._form.validate = postalCodeValid;
        if (!postalCodeValid) {
          this.logger.log(`Invalid Zip Code ${this.postalCodeField.value}`);
          this.postalCodeField.scrollIntoView({ behavior: "smooth" });
        }
        return postalCodeValid;
      });
    }
  }

  private shouldRun(): boolean {
    return !!(ENGrid.getOption("PostalCodeValidator") && this.postalCodeField);
  }

  private validate() {
    if (this.shouldValidateUSZipCode() && !this.isValidUSZipCode()) {
      ENGrid.setError(
        ".en__field--postcode",
        `Please enter a valid ZIP Code of ##### or #####${this.separator}####`
      );
    } else {
      ENGrid.removeError(".en__field--postcode");
    }
  }

  private isValidUSZipCode(): boolean {
    const zipCodeRequired = !!document.querySelector(
      ".en__field--postcode.en__mandatory"
    );
    // If zip code is not required in EN Form Block and the field is empty, it is valid
    if (!zipCodeRequired && this.postalCodeField?.value === "") {
      return true;
    }

    const postalCodeRegex = new RegExp(
      `^\\d{5}(${this.regexSeparator}\\d{4})?$`
    );

    return !!this.postalCodeField?.value.match(postalCodeRegex);
  }

  /**
   * Formats the zip code to #####-####  as the user inputs it
   * The separator is determined by the TidyContact option, but defaults to "-"
   */
  private liveValidate() {
    if (!this.shouldValidateUSZipCode()) return;

    let value = this.postalCodeField?.value;
    // If the value is 5 characters or less, remove all non-numeric characters
    if (value.length <= 5) {
      value = value.replace(/\D/g, "");
    }
    // If one of the supported separators is endered as the 6th character, replace it with the official separator
    else if (
      value.length === 6 &&
      this.supportedSeparators.includes(value[5])
    ) {
      // Removing all non-numeric characters
      value = value.replace(/\D/g, "") + this.separator;
    } else {
      // Removing all non-numeric characters
      value = value.replace(/\D/g, "");
      // Adding the separator after the 5th character
      value = value.replace(/(\d{5})(\d)/, `$1${this.separator}$2`);
    }

    //set field value with max 10 characters
    this.postalCodeField.value = value.slice(0, 10);
  }

  private shouldValidateUSZipCode(): boolean {
    // Validating US zip code only if country is US, country has not yet been selected
    // or if there is no country field
    const country = ENGrid.getField("supporter.country")
      ? ENGrid.getFieldValue("supporter.country")
      : "US";

    return ["us", "united states", "usa", ""].includes(country.toLowerCase());
  }

  private getSeparator(): string {
    const tidyContact = ENGrid.getOption(
      "TidyContact"
    ) as Options["TidyContact"];

    if (
      tidyContact &&
      tidyContact.us_zip_divider &&
      this.supportedSeparators.includes(tidyContact.us_zip_divider)
    ) {
      return tidyContact.us_zip_divider;
    }

    return "-";
  }

  private getRegexSeparator(separator: string): string {
    switch (separator) {
      case "+":
        return "\\+";
      case "-":
        return "-";
      case " ":
        return "\\s";
      default:
        this.logger.log(
          `Invalid separator "${separator}" provided to PostalCodeValidator, falling back to "-".`
        );
        return "-";
    }
  }
}
