// This component uses EN's Custom Validators on the client side to validate form fields.
// It's currently behind a feature flag, so it's not enabled by default.
// To enable it, add the following to your options:
// ENValidators: true
import { EnForm, ENGrid, EngridLogger } from "./";
export class ENValidators {
  private _form: EnForm = EnForm.getInstance();
  private _enElements:
    | {
        id: string;
        container: HTMLDivElement;
        field: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
        regex: string;
        message: string;
      }[]
    | null = null;

  private logger: EngridLogger = new EngridLogger(
    "ENValidators",
    "white",
    "darkolivegreen",
    "🧐"
  );
  constructor() {
    if (!this.loadValidators()) {
      // This is an error to flag a racing condition. If the script is loaded before the validators are loaded, it will not work.
      this.logger.error("Not Loaded");
      return;
    }
    if (!this.shouldRun()) {
      // If there's no custom validators, get out
      this.logger.log("Not Needed");
      return;
    }
    this._form.onValidate.subscribe(this.enOnValidate.bind(this));
  }
  loadValidators() {
    if (
      !ENGrid.checkNested(
        window.EngagingNetworks,
        "require",
        "_defined",
        "enValidation",
        "validation",
        "validators"
      )
    ) {
      return false;
    }

    // Loop through the array validators and add them to this._enElements
    const validators =
      window.EngagingNetworks.require._defined.enValidation.validation
        .validators;
    this._enElements = validators.reduce(
      (
        acc: any[],
        validator: {
          field: string;
          type: string;
          format: string;
          regex: string;
          message: string;
          isVisible: void;
        }
      ) => {
        if ("type" in validator && validator.type === "CUST") {
          const container = document.querySelector(
            ".en__field--" + validator.field
          ) as HTMLDivElement;
          const field = container
            ? container.querySelector("input, select, textarea")
            : null;
          if (field) {
            field.addEventListener(
              "input",
              this.liveValidate.bind(
                this,
                container,
                field,
                validator.regex,
                validator.message
              )
            );
            acc.push({
              container: container,
              field: field,
              regex: validator.regex,
              message: validator.message,
            });
          }
        }
        return acc;
      },
      []
    );
    return true;
  }
  // Should we run the script?
  shouldRun() {
    return (
      ENGrid.getOption("ENValidators") &&
      this._enElements &&
      this._enElements.length > 0
    );
  }

  // Don't submit the form if any of the fields are invalid
  enOnValidate() {
    if (!this._enElements || this._form.validate === false) {
      return;
    }
    this._enElements.forEach((element) => {
      const fieldValidation = this.liveValidate(
        element.container,
        element.field,
        element.regex,
        element.message
      );
      if (!fieldValidation) {
        this._form.validate = false;
        element.field.focus();
        return;
      }
    });
    this._form.validate = true;
  }

  // Validate the field on the fly
  liveValidate(
    container: HTMLDivElement,
    field: Element,
    regex: string,
    message: string
  ) {
    const value = ENGrid.getFieldValue(field.getAttribute("name") || "");
    // Do not validate empty fields, that's the job of the required validator
    if (value === "") {
      return true;
    }
    this.logger.log(
      `Live Validate ${field.getAttribute("name")} with ${regex}`
    );
    // compare the value of the field with the regex
    if (!value.match(regex)) {
      // If the value is not valid, add the error message
      ENGrid.setError(container, message);
      return false;
    }
    // If the value is valid, remove the error message
    ENGrid.removeError(container);
    return true;
  }
}
