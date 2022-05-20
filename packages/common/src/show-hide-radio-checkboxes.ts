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

  // Hide All Divs
  hideAll() {
    this.elements.forEach((item, index) => {
      if (item instanceof HTMLInputElement) this.hide(item);
    });
  }
  // Hide Single Element Div
  hide(item: HTMLInputElement) {
    let inputValue = item.value.replace(/\s/g, "");
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
    let inputValue = item.value.replace(/\s/g, "");
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
    const fields = item.querySelectorAll("input, select, textarea");
    if (fields.length > 0) {
      fields.forEach((field) => {
        if (
          field instanceof HTMLInputElement ||
          field instanceof HTMLSelectElement
        ) {
          if (field.name) {
            const fieldValue = ENGrid.getFieldValue(field.name);
            if (!field.hasAttribute("data-original-value")) {
              field.setAttribute("data-original-value", fieldValue);
            }
            const originalValue = field.getAttribute("data-original-value");
            const dataValue = field.getAttribute("data-value") ?? "";
            if (type === "hide" && ENGrid.isVisible(field)) {
              field.setAttribute("data-value", fieldValue);
              ENGrid.setFieldValue(field.name, originalValue);
            }
            if (type === "show" && !ENGrid.isVisible(field)) {
              field.setAttribute("data-value", "");
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
