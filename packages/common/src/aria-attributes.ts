import { ENGrid } from "./";

export class AriaAttributes {
  private mandatoryFields = document.querySelectorAll(
    ".en__mandatory .en__field__input"
  );

  constructor() {
    if (!this.shouldRun()) {
      return;
    }

    this.addRequired();
  }

  addRequired() {
    this.mandatoryFields.forEach((field) => {
      field.setAttribute("aria-required", "true");
    });
  }

  shouldRun() {
    return this.mandatoryFields.length > 0;
  }
}
