import { ENGrid } from "./engrid";
import { EnForm } from "./events";
import { EngridLogger } from "./logger";

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

  constructor() {
    if (this.shouldRun()) {
      this.postalCodeField?.addEventListener("blur", () => this.validate());
      this.postalCodeField?.addEventListener("input", () =>
        this.liveValidate()
      );
      this._form.onValidate.subscribe(() => {
        if (!this._form.validate) return;

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
      ENGrid.setError(".en__field--postcode", "Please enter a valid zip code.");
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
    return !!this.postalCodeField?.value.match(/^\d{5}(-\d{4})?$/);
  }

  private liveValidate() {
    if (
      this.shouldValidateUSZipCode() &&
      this.postalCodeField?.value.match(/[^0-9-]/)
    ) {
      ENGrid.setError(".en__field--postcode", "Please enter a valid zip code.");
    } else {
      ENGrid.removeError(".en__field--postcode");
    }
  }

  private shouldValidateUSZipCode(): boolean {
    // Validating US zip code only if country is US, country has not yet been selected
    // or if there is no country field
    const country = ENGrid.getField("supporter.country")
      ? ENGrid.getFieldValue("supporter.country")
      : "US";

    return ["US", "United States", ""].includes(country);
  }
}
