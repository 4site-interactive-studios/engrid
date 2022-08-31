// This Component is supposed to be used as a helper for Arria Attributes

export class AriaAttributes {
  constructor() {
    this.addRequired();
    this.addLabel();
  }

  private addRequired() {
    const mandatoryFields = document.querySelectorAll(
      ".en__mandatory .en__field__input"
    );
    mandatoryFields.forEach((field) => {
      field.setAttribute("aria-required", "true");
    });
  }

  private addLabel() {
    const otherAmount = document.querySelector(
      ".en__field__input--otheramount"
    ) as HTMLInputElement;
    if (otherAmount) {
      otherAmount.setAttribute(
        "aria-label",
        "Enter your custom donation amount"
      );
    }
    // Split selects usually don't have a label, so let's make the first option the label
    const splitSelects = document.querySelectorAll(
      ".en__field__input--splitselect"
    );
    splitSelects.forEach((select) => {
      const firstOption = select.querySelector("option") as HTMLOptionElement;
      if (
        firstOption &&
        firstOption.value === "" &&
        !firstOption.textContent?.toLowerCase()?.includes("select") &&
        !firstOption.textContent?.toLowerCase()?.includes("choose")
      ) {
        select.setAttribute("aria-label", firstOption.textContent || "");
      }
    });
  }
}
