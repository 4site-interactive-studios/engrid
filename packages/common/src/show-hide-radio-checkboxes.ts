import { EngridLogger } from ".";

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
        el.style.display = "";
        this.logger.log("Showing", el);
      }
    });
    if (item.type == "checkbox" && !item.checked) {
      this.hide(item);
    }
  }

  constructor(elements: string, classes: string) {
    this.elements = document.getElementsByName(elements);
    this.classes = classes;
    this.hideAll();
    this.logger.log("New:", this.classes, this.elements);
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
