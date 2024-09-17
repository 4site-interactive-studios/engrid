// Component to allow the user to set custom labels for the checkboxes,
// you can customize the checkbox label on a per-page basis, which is not possible with Engaging Networks
// The .checkbox-label element should be placed right before the checkbox form block
import { EngridLogger } from ".";
export class CheckboxLabel {
    constructor() {
        this.logger = new EngridLogger("CheckboxLabel", "#00CC95", "#2C3E50", "✅");
        this.checkBoxesLabels = document.querySelectorAll(".checkbox-label");
        if (!this.shoudRun())
            return;
        this.logger.log(`Found ${this.checkBoxesLabels.length} custom labels`);
        this.run();
    }
    shoudRun() {
        return this.checkBoxesLabels.length > 0;
    }
    run() {
        this.checkBoxesLabels.forEach((checkboxLabel) => {
            var _a;
            const labelText = (_a = checkboxLabel.textContent) === null || _a === void 0 ? void 0 : _a.trim();
            const checkboxContainer = checkboxLabel.nextElementSibling;
            const checkboxLabelElement = checkboxContainer.querySelector("label");
            if (!checkboxLabelElement || !labelText)
                return;
            checkboxLabelElement.textContent = labelText;
            checkboxLabel.remove();
            this.logger.log(`Set checkbox label to "${labelText}"`);
        });
    }
}
