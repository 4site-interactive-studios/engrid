// Switches hidden fields to be type text when debug mode is enabled.
import { EngridLogger } from ".";
export class DebugHiddenFields {
    constructor() {
        this.logger = new EngridLogger("Debug hidden fields", "#f0f0f0", "#ff0000", "🫣");
        this.logger.log("Switching all type 'hidden' fields to type 'text'");
        const fields = document.querySelectorAll("[type='hidden']");
        if (fields.length > 0) {
            fields.forEach((el) => {
                el.type = "text";
                el.setAttribute("unhidden", "");
                const label = document.createElement("label");
                label.textContent = el.name;
                el.insertAdjacentElement("beforebegin", label);
            });
        }
    }
}
