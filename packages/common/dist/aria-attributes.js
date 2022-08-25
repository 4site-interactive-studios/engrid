export class AriaAttributes {
    constructor() {
        this.mandatoryFields = document.querySelectorAll(".en__mandatory .en__field__input");
        if (!this.shouldRun()) {
            return;
        }
        this.addRequired();
    }
    addRequired() {
        this.mandatoryFields.forEach((field) => {
            field.setAttribute("aria-required", "true");
        });
    }
    shouldRun() {
        return this.mandatoryFields.length > 0;
    }
}
