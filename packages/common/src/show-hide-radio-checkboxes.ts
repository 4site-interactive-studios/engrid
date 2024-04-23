import { ENGrid, EngridLogger } from ".";

export class ShowHideRadioCheckboxes {
  // All Affected Elements
  public elements: NodeList;
  // Class used on Show/Hide Divs + Input Value
  public classes: string;
  private logger: EngridLogger = new EngridLogger(
    "ShowHideRadioCheckboxes",
    "black",
    "lightblue",
    "👁"
  );

  // Create default data attributes on all fields
  createDataAttributes() {
    this.elements.forEach((item) => {
      if (item instanceof HTMLInputElement) {
        let inputValue = item.value.replace(/\W/g, "");
        document
          .querySelectorAll("." + this.classes + inputValue)
          .forEach((el) => {
            // Consider toggling "hide" class so these fields can be displayed when in a debug state
            if (el instanceof HTMLElement) {
              const fields = el.querySelectorAll(
                "input[type='text'], input[type='number'], input[type='email'], select, textarea"
              );
              if (fields.length > 0) {
                fields.forEach((field) => {
                  if (
                    field instanceof HTMLInputElement ||
                    field instanceof HTMLSelectElement
                  ) {
                    if (!field.hasAttribute("data-original-value")) {
                      field.setAttribute("data-original-value", field.value);
                    }
                    if (!field.hasAttribute("data-value")) {
                      field.setAttribute("data-value", field.value);
                    }
                  }
                });
              }
            }
          });
      }
    });
  }

  // Hide All Divs
  hideAll() {
    this.elements.forEach((item, index) => {
      if (item instanceof HTMLInputElement) this.hide(item);
    });
  }
  // Hide Single Element Div
  hide(item: HTMLInputElement) {
    let inputValue = item.value.replace(/\W/g, "");
    document.querySelectorAll("." + this.classes + inputValue).forEach((el) => {
      // Consider toggling "hide" class so these fields can be displayed when in a debug state
      if (el instanceof HTMLElement) {
        this.toggleValue(el, "hide");
        el.style.display = "none";
        this.logger.log("Hiding", el);
      }
    });
  }
  // Show Single Element Div
  show(item: HTMLInputElement) {
    let inputValue = item.value.replace(/\W/g, "");
    document.querySelectorAll("." + this.classes + inputValue).forEach((el) => {
      // Consider toggling "hide" class so these fields can be displayed when in a debug state
      if (el instanceof HTMLElement) {
        this.toggleValue(el, "show");
        el.style.display = "";
        this.logger.log("Showing", el);
      }
    });
    if (item.type == "checkbox" && !item.checked) {
      this.hide(item);
    }
  }

  // Take the field values and add to a data attribute on the field
  private toggleValue(item: HTMLElement, type: "show" | "hide") {
    if (type == "hide" && !ENGrid.isVisible(item)) return;
    this.logger.log(`toggleValue: ${type}`);
    const fields = item.querySelectorAll(
      "input[type='text'], input[type='number'], input[type='email'], select, textarea"
    );
    if (fields.length > 0) {
      fields.forEach((field) => {
        if (
          field instanceof HTMLInputElement ||
          field instanceof HTMLSelectElement
        ) {
          if (field.name) {
            const fieldValue = ENGrid.getFieldValue(field.name);
            const originalValue = field.getAttribute("data-original-value");
            const dataValue = field.getAttribute("data-value") ?? "";
            if (type === "hide") {
              field.setAttribute("data-value", fieldValue);
              ENGrid.setFieldValue(field.name, originalValue);
            } else {
              ENGrid.setFieldValue(field.name, dataValue);
            }
          }
        }
      });
    }
  }

  getSessionState() {
    try {
      const plainState =
        window.sessionStorage.getItem(`engrid_ShowHideRadioCheckboxesState`) ??
        "";
      return JSON.parse(plainState);
    } catch (err) {
      return [];
    }
  }

  storeSessionState() {
    const state = this.getSessionState();

    [...this.elements].forEach((element) => {
      if (!(element instanceof HTMLInputElement)) return;

      if (element.type == "radio" && element.checked) {
        //remove other items that have the same "class" property
        state.forEach(
          (item: { page: number; class: string }, index: number) => {
            if (item.class == this.classes) {
              state.splice(index, 1);
            }
          }
        );

        //add the current item, with the currently active value
        state.push({
          page: ENGrid.getPageID(),
          class: this.classes,
          value: element.value,
        });

        this.logger.log("storing radio state", state[state.length - 1]);
      }

      if (element.type == "checkbox") {
        //remove other items that have the same "class" property
        state.forEach(
          (item: { page: number; class: string }, index: number) => {
            if (item.class == this.classes) {
              state.splice(index, 1);
            }
          }
        );

        //add the current item, with the first checked value or "N" if none are checked
        state.push({
          page: ENGrid.getPageID(),
          class: this.classes,
          value:
            [...this.elements].find(
              (el): el is HTMLInputElement => (el as HTMLInputElement).checked
            )?.value ?? "N", // First checked value or "N" if none
        });

        this.logger.log("storing checkbox state", state[state.length - 1]);
      }
    });

    window.sessionStorage.setItem(
      `engrid_ShowHideRadioCheckboxesState`,
      JSON.stringify(state)
    );
  }

  constructor(elements: string, classes: string) {
    this.elements = document.getElementsByName(elements);
    this.classes = classes;
    this.createDataAttributes();
    this.hideAll();
    this.storeSessionState();
    for (let i = 0; i < this.elements.length; i++) {
      let element = <HTMLInputElement>this.elements[i];
      if (element.checked) {
        this.show(element);
      }
      element.addEventListener("change", (e: Event) => {
        this.hideAll();
        this.show(element);
        this.storeSessionState();
      });
    }
  }
}
