import { ENGrid, EngridLogger } from ".";
export class ShowHideRadioCheckboxes {
    constructor(elements, classes) {
        this.logger = new EngridLogger("ShowHideRadioCheckboxes", "black", "lightblue", "👁");
        this.elements = document.getElementsByName(elements);
        this.classes = classes;
        this.hideAll();
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
                this.toggleValue(el, "hide");
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
    toggleValue(item, type) {
        const fields = item.querySelectorAll("input, select, textarea");
        if (fields.length > 0) {
            fields.forEach((field) => {
                var _a;
                if (field instanceof HTMLInputElement ||
                    field instanceof HTMLSelectElement) {
                    if (field.name) {
                        const fieldValue = ENGrid.getFieldValue(field.name);
                        if (!field.hasAttribute("data-original-value")) {
                            field.setAttribute("data-original-value", fieldValue);
                        }
                        const originalValue = field.getAttribute("data-original-value");
                        const dataValue = (_a = field.getAttribute("data-value")) !== null && _a !== void 0 ? _a : "";
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
}
