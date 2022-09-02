// a11y means accessibility
// This Component is supposed to be used as a helper for Arria Attributes & Other Accessibility Features
export class A11y {
    constructor() {
        this.addRequired();
        this.addLabel();
        this.addGroupRole();
    }
    addGroupRole() {
        // Add role="group" to all EN Radio fields
        const radioFields = document.querySelectorAll(".en__field--radio");
        radioFields.forEach((field) => {
            field.setAttribute("role", "group");
            // Add random ID to the label
            const label = field.querySelector("label");
            if (label) {
                label.setAttribute("id", `en__field__label--${Math.random().toString(36).slice(2, 7)}`);
                field.setAttribute("aria-labelledby", label.id);
            }
        });
    }
    addRequired() {
        const mandatoryFields = document.querySelectorAll(".en__mandatory .en__field__input");
        mandatoryFields.forEach((field) => {
            field.setAttribute("aria-required", "true");
        });
    }
    addLabel() {
        const otherAmount = document.querySelector(".en__field__input--otheramount");
        if (otherAmount) {
            otherAmount.setAttribute("aria-label", "Enter your custom donation amount");
        }
        // Split selects usually don't have a label, so let's make the first option the label
        const splitSelects = document.querySelectorAll(".en__field__input--splitselect");
        splitSelects.forEach((select) => {
            var _a, _b, _c, _d;
            const firstOption = select.querySelector("option");
            if (firstOption &&
                firstOption.value === "" &&
                !((_b = (_a = firstOption.textContent) === null || _a === void 0 ? void 0 : _a.toLowerCase()) === null || _b === void 0 ? void 0 : _b.includes("select")) &&
                !((_d = (_c = firstOption.textContent) === null || _c === void 0 ? void 0 : _c.toLowerCase()) === null || _d === void 0 ? void 0 : _d.includes("choose"))) {
                select.setAttribute("aria-label", firstOption.textContent || "");
            }
        });
    }
}
