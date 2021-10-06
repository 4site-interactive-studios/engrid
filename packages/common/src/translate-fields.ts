import { TranslateOptions, TranslateOptionsDefaults } from ".";

// This class works when the user has added ".simple_country_select" as a class in page builder for the Country select
export class TranslateFields {
  public countrySelect: HTMLSelectElement = document.querySelector(
    "#en__field_supporter_country"
  ) as HTMLSelectElement;
  private options: TranslateOptions;
  constructor() {
    let options: TranslateOptions =
      "EngridTranslate" in window ? window.EngridTranslate : {};
    this.options = TranslateOptionsDefaults;
    if (options) {
      for (let key in options) {
        this.options[key] = [...this.options[key], ...options[key]];
      }
    }
    if (this.countrySelect) {
      this.countrySelect.addEventListener(
        "change",
        this.translateFields.bind(this)
      );
    }
  }

  private translateFields() {
    this.resetTranslatedFields();
    if (this.countrySelect.value in this.options) {
      this.options[this.countrySelect.value].forEach((field) => {
        console.log(field);
        this.translateField(field.field, field.translation);
      });
    }
    // Translate the "To:"
    const recipient_block = document.querySelectorAll(".recipient-block");
    if (!!recipient_block.length) {
      switch (this.countrySelect.value) {
        case "FR":
        case "FRA":
          recipient_block.forEach((elem) => (elem.innerHTML = "À:"));
          break;
        case "DE":
        case "DEU":
          recipient_block.forEach((elem) => (elem.innerHTML = "Zu:"));
          break;
        case "NL":
        case "NLD":
          recipient_block.forEach((elem) => (elem.innerHTML = "Aan:"));
          break;
      }
    }
    // Translate the State Field
    this.setStateField(this.countrySelect.value);
  }
  private translateField(name: string, translation: string) {
    const field = document.querySelector(`[name="${name}"]`);
    if (field) {
      const fieldWrapper = field.closest(".en__field");
      if (fieldWrapper) {
        const fieldLabel = fieldWrapper.querySelector(
          ".en__field__label"
        ) as HTMLElement;
        if (field instanceof HTMLInputElement && field.placeholder != "") {
          if (!fieldLabel || fieldLabel.innerHTML == field.placeholder) {
            field.dataset.original = field.placeholder;
            field.placeholder = translation;
          }
        }
        if (fieldLabel) {
          fieldLabel.dataset.original = fieldLabel.innerHTML;
          fieldLabel.innerHTML = translation;
        }
      }
    }
  }
  private resetTranslatedFields() {
    const fields = document.querySelectorAll(
      "[data-original]"
    ) as NodeListOf<HTMLElement>;
    fields.forEach((field) => {
      if (field instanceof HTMLInputElement && field.dataset.original) {
        field.placeholder = field.dataset.original;
      } else {
        field.innerHTML = <string>field.dataset.original;
      }
      field.removeAttribute("data-original");
    });
  }
  private setStateField(country: string) {
    switch (country) {
      case "BR":
      case "BRA":
        this.setStateValues("Estado", null);
        break;
      case "FR":
      case "FRA":
        this.setStateValues("Région", null);
        break;
      case "GB":
      case "GBR":
        this.setStateValues("State/Region", null);
        break;
      case "DE":
      case "DEU":
        this.setStateValues("Bundesland", null);
        break;
      case "NL":
      case "NLD":
        this.setStateValues("Provincie", null);
        break;
      case "AU":
      case "AUS":
        this.setStateValues("Province/State", [
          { label: "Select Province/State", value: "" },
          { label: "New South Wales", value: "NSW" },
          { label: "Victoria", value: "VIC" },
          { label: "Queensland", value: "QLD" },
          { label: "South Australia", value: "SA" },
          { label: "Western Australia", value: "WA" },
          { label: "Tasmania", value: "TAS" },
          { label: "Northern Territory", value: "NT" },
          { label: "Australian Capital Territory", value: "ACT" },
        ]);
        break;
      case "US":
      case "USA":
        this.setStateValues("State", [
          { label: "Select State", value: "" },
          { label: "Alabama", value: "AL" },
          { label: "Alaska", value: "AK" },
          { label: "Arizona", value: "AZ" },
          { label: "Arkansas", value: "AR" },
          { label: "California", value: "CA" },
          { label: "Colorado", value: "CO" },
          { label: "Connecticut", value: "CT" },
          { label: "Delaware", value: "DE" },
          { label: "District of Columbia", value: "DC" },
          { label: "Florida", value: "FL" },
          { label: "Georgia", value: "GA" },
          { label: "Hawaii", value: "HI" },
          { label: "Idaho", value: "ID" },
          { label: "Illinois", value: "IL" },
          { label: "Indiana", value: "IN" },
          { label: "Iowa", value: "IA" },
          { label: "Kansas", value: "KS" },
          { label: "Kentucky", value: "KY" },
          { label: "Louisiana", value: "LA" },
          { label: "Maine", value: "ME" },
          { label: "Maryland", value: "MD" },
          { label: "Massachusetts", value: "MA" },
          { label: "Michigan", value: "MI" },
          { label: "Minnesota", value: "MN" },
          { label: "Mississippi", value: "MS" },
          { label: "Missouri", value: "MO" },
          { label: "Montana", value: "MT" },
          { label: "Nebraska", value: "NE" },
          { label: "Nevada", value: "NV" },
          { label: "New Hampshire", value: "NH" },
          { label: "New Jersey", value: "NJ" },
          { label: "New Mexico", value: "NM" },
          { label: "New York", value: "NY" },
          { label: "North Carolina", value: "NC" },
          { label: "North Dakota", value: "ND" },
          { label: "Ohio", value: "OH" },
          { label: "Oklahoma", value: "OK" },
          { label: "Oregon", value: "OR" },
          { label: "Pennsylvania", value: "PA" },
          { label: "Rhode Island", value: "RI" },
          { label: "South Carolina", value: "SC" },
          { label: "South Dakota", value: "SD" },
          { label: "Tennessee", value: "TN" },
          { label: "Texas", value: "TX" },
          { label: "Utah", value: "UT" },
          { label: "Vermont", value: "VT" },
          { label: "Virginia", value: "VA" },
          { label: "Washington", value: "WA" },
          { label: "West Virginia", value: "WV" },
          { label: "Wisconsin", value: "WI" },
          { label: "Wyoming", value: "WY" },
        ]);
        break;
      default:
        this.setStateValues("Province/State", null);
        break;
    }
  }
  private setStateValues(
    label: string,
    values: { label: string; value: string }[] | null
  ) {
    const stateField = document.querySelector("#en__field_supporter_region");
    const stateWrapper = stateField ? stateField.closest(".en__field") : null;
    if (stateWrapper) {
      const stateLabel = stateWrapper.querySelector(".en__field__label");
      const elementWrapper = stateWrapper.querySelector(".en__field__element");
      if (stateLabel) {
        stateLabel.innerHTML = label;
      }
      if (elementWrapper) {
        if (values?.length) {
          const select = document.createElement("select");
          select.name = "supporter.region";
          select.id = "en__field_supporter_region";
          select.classList.add("en__field__input");
          select.classList.add("en__field__input--select");
          select.autocomplete = "address-level1";
          values.forEach((value) => {
            const option = document.createElement("option");
            option.value = value.value;
            option.innerHTML = value.label;
            select.appendChild(option);
          });
          elementWrapper.innerHTML = "";
          elementWrapper.appendChild(select);
        } else {
          elementWrapper.innerHTML = "";
          const input = document.createElement("input");
          input.type = "text";
          input.name = "supporter.region";
          input.placeholder = label;
          input.id = "en__field_supporter_region";
          input.classList.add("en__field__input");
          input.classList.add("en__field__input--text");
          input.autocomplete = "address-level1";
          elementWrapper.appendChild(input);
        }
      }
    }
  }
}
