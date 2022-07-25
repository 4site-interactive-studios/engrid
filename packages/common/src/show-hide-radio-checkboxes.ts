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

  constructor(elements: string, classes: string) {
    this.elements = document.getElementsByName(elements);
    this.classes = classes;
    this.createDataAttributes();
    this.hideAll();
    for (let i = 0; i < this.elements.length; i++) {
      let element = <HTMLInputElement>this.elements[i];
      if (element.checked) {
        this.show(element);
      }
      element.addEventListener("change", (e: Event) => {
        this.hideAll();
        this.show(element);
      });
    }
  }
}
