import { ENGrid, EngridLogger } from ".";
export class ShowHideRadioCheckboxes {
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
                        const fields = el.querySelectorAll("input[type='text'], input[type='number'], input[type='email'], select, textarea");
                        if (fields.length > 0) {
                            fields.forEach((field) => {
                                if (field instanceof HTMLInputElement ||
                                    field instanceof HTMLSelectElement) {
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
            if (item instanceof HTMLInputElement)
                this.hide(item);
        });
    }
    // Hide Single Element Div
    hide(item) {
        let inputValue = item.value.replace(/\W/g, "");
        document.querySelectorAll("." + this.classes + inputValue).forEach((el) => {
            // Consider toggling "hide" class so these fields can be displayed when in a debug state
            if (el instanceof HTMLElement) {
                this.toggleValue(el, "hide");
                el.style.display = "none";
                this.logger.log("Hiding", el);
                const input = el.querySelector("input");
                if (input instanceof HTMLInputElement) {
                    input.setAttribute("aria-required", "false");
                    this.logger.log("aria-required set to FALSE", input);
                }
            }
        });
    }
    // Show Single Element Div
    show(item) {
        let inputValue = item.value.replace(/\W/g, "");
        document.querySelectorAll("." + this.classes + inputValue).forEach((el) => {
            // Consider toggling "hide" class so these fields can be displayed when in a debug state
            if (el instanceof HTMLElement) {
                this.toggleValue(el, "show");
                el.style.display = "";
                this.logger.log("Showing", el);
                const input = el.querySelector("input");
                if (input instanceof HTMLInputElement) {
                    input.setAttribute("aria-required", "true");
                    this.logger.log("aria-required set to TRUE", input);
                }
            }
        });
        if (item.type == "checkbox" && !item.checked) {
            this.hide(item);
        }
    }
    // Take the field values and add to a data attribute on the field
    toggleValue(item, type) {
        if (type == "hide" && !ENGrid.isVisible(item))
            return;
        this.logger.log(`toggleValue: ${type}`);
        const fields = item.querySelectorAll("input[type='text'], input[type='number'], input[type='email'], select, textarea");
        if (fields.length > 0) {
            fields.forEach((field) => {
                var _a;
                if (field instanceof HTMLInputElement ||
                    field instanceof HTMLSelectElement) {
                    if (field.name) {
                        const fieldValue = ENGrid.getFieldValue(field.name);
                        const originalValue = field.getAttribute("data-original-value");
                        const dataValue = (_a = field.getAttribute("data-value")) !== null && _a !== void 0 ? _a : "";
                        if (type === "hide") {
                            field.setAttribute("data-value", fieldValue);
                            ENGrid.setFieldValue(field.name, originalValue);
                        }
                        else {
                            ENGrid.setFieldValue(field.name, dataValue);
                        }
                    }
                }
            });
        }
    }
    getSessionState() {
        var _a;
        try {
            const plainState = (_a = window.sessionStorage.getItem(`engrid_ShowHideRadioCheckboxesState`)) !== null && _a !== void 0 ? _a : "";
            return JSON.parse(plainState);
        }
        catch (err) {
            return [];
        }
    }
    storeSessionState() {
        const state = this.getSessionState();
        [...this.elements].forEach((element) => {
            var _a, _b;
            if (!(element instanceof HTMLInputElement))
                return;
            if (element.type == "radio" && element.checked) {
                //remove other items that have the same "class" property
                state.forEach((item, index) => {
                    if (item.class == this.classes) {
                        state.splice(index, 1);
                    }
                });
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
                state.forEach((item, index) => {
                    if (item.class == this.classes) {
                        state.splice(index, 1);
                    }
                });
                //add the current item, with the first checked value or "N" if none are checked
                state.push({
                    page: ENGrid.getPageID(),
                    class: this.classes,
                    value: (_b = (_a = [...this.elements].find((el) => el.checked)) === null || _a === void 0 ? void 0 : _a.value) !== null && _b !== void 0 ? _b : "N", // First checked value or "N" if none
                });
                this.logger.log("storing checkbox state", state[state.length - 1]);
            }
        });
        window.sessionStorage.setItem(`engrid_ShowHideRadioCheckboxesState`, JSON.stringify(state));
    }
    constructor(elements, classes) {
        this.logger = new EngridLogger("ShowHideRadioCheckboxes", "black", "lightblue", "👁");
        this.elements = document.getElementsByName(elements);
        this.classes = classes;
        this.createDataAttributes();
        this.hideAll();
        this.storeSessionState();
        for (let i = 0; i < this.elements.length; i++) {
            let element = this.elements[i];
            if (element.checked) {
                this.show(element);
            }
            element.addEventListener("change", (e) => {
                this.hideAll();
                this.show(element);
                this.storeSessionState();
            });
        }
    }
}
