// Component that adds has-value and has-focus classes to form inputs
import { EngridLogger } from ".";
export class InputHasValueAndFocus {
    constructor() {
        this.logger = new EngridLogger("InputHasValueAndFocus", "yellow", "#333", "🌈");
        this.formInputs = document.querySelectorAll(".en__field--text, .en__field--email:not(.en__field--checkbox), .en__field--telephone, .en__field--number, .en__field--textarea, .en__field--select, .en__field--checkbox");
        if (this.shouldRun()) {
            this.run();
        }
    }
    shouldRun() {
        return this.formInputs.length > 0;
    }
    run() {
        this.formInputs.forEach((el) => {
            const input = el.querySelector("input, textarea, select");
            if (input && input.value) {
                el.classList.add("has-value");
            }
            this.bindEvents(el);
        });
    }
    bindEvents(el) {
        const input = el.querySelector("input, textarea, select");
        if (!input) {
            return;
        }
        input.addEventListener("focus", () => {
            this.log("Focus added", input);
            el.classList.add("has-focus");
        });
        input.addEventListener("blur", () => {
            this.log("Focus removed", input);
            el.classList.remove("has-focus");
        });
        input.addEventListener("input", () => {
            if (input.value) {
                this.log("Value added", input);
                el.classList.add("has-value");
            }
            else {
                this.log("Value removed", input);
                el.classList.remove("has-value");
            }
        });
    }
    log(message, input) {
        this.logger.log(`${message} on ${input.name}: ${input.value}`);
    }
}
