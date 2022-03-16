import { EngridLogger } from ".";
export class ShowHideRadioCheckboxes {
    constructor(elements, classes) {
        this.logger = new EngridLogger("ShowHideRadioCheckboxes", "black", "lightblue", "👁");
        this.elements = document.getElementsByName(elements);
        this.classes = classes;
        this.hideAll();
        this.logger.log("New:", this.classes, this.elements);
        for (let i = 0; i < this.elements.length; i++) {
            let element = this.elements[i];
            if (element.checked) {
                this.show(element);
            }
            element.addEventListener("change", (e) => {
                this.hideAll();
                this.show(element);
            });
        }
    }
    // Hide All Divs
    hideAll() {
        this.elements.forEach((item, index) => {
            if (item instanceof HTMLInputElement)
                this.hide(item);
        });
    }
    // Hide Single Element Div
    hide(item) {
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
    show(item) {
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
}
