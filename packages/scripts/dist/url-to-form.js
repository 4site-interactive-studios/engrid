// Component that allows to set a field value from URL parameters
// Workflow:
// 1. Loop through all the URL parameters
// 2. Check if there's a match with the field name
// 3. If there's a match AND the field is empty, set the value
import { ENGrid, EngridLogger } from ".";
export class UrlToForm {
    constructor() {
        this.logger = new EngridLogger("UrlToForm", "white", "magenta", "🔗");
        this.urlParams = new URLSearchParams(document.location.search);
        if (!this.shouldRun())
            return;
        this.urlParams.forEach((value, key) => {
            const field = document.getElementsByName(key)[0];
            if (field) {
                if (field.type === "checkbox") {
                    field.checked = value === "true" || value === "Y" || value === "1";
                    ENGrid.setFieldValue(key, field.checked);
                    this.logger.log(`Set: ${key} to ${field.checked}`);
                }
                else if (!["text", "textarea", "email"].includes(field.type) ||
                    !field.value) {
                    ENGrid.setFieldValue(key, value);
                    this.logger.log(`Set: ${key} to ${value}`);
                }
            }
        });
    }
    shouldRun() {
        return !!document.location.search && this.hasFields();
    }
    hasFields() {
        const ret = [...this.urlParams.keys()].map((key) => {
            return document.getElementsByName(key).length > 0;
        });
        return ret.includes(true);
    }
}
