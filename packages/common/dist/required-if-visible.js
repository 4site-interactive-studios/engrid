import { EnForm, ENGrid, EngridLogger } from "./";
export class RequiredIfVisible {
    constructor() {
        this.logger = new EngridLogger("RequiredIfVisible", "#FFFFFF", "#811212", "🚥");
        this._form = EnForm.getInstance();
        this.requiredIfVisibleElements = document.querySelectorAll(`
    .i-required .en__field,
    .i1-required .en__field:nth-of-type(1),
    .i2-required .en__field:nth-of-type(2),
    .i3-required .en__field:nth-of-type(3),
    .i4-required .en__field:nth-of-type(4),
    .i5-required .en__field:nth-of-type(5),
    .i6-required .en__field:nth-of-type(6),
    .i7-required .en__field:nth-of-type(7),
    .i8-required .en__field:nth-of-type(8),
    .i9-required .en__field:nth-of-type(9),
    .i10-required .en__field:nth-of-type(10),
    .i11-required .en__field:nth-of-type(11)
    `);
        if (!this.shouldRun())
            return;
        this._form.onValidate.subscribe(this.validate.bind(this));
    }
    shouldRun() {
        return this.requiredIfVisibleElements.length > 0;
    }
    validate() {
        this.requiredIfVisibleElements.forEach((field) => {
            ENGrid.removeError(field);
            if (ENGrid.isVisible(field)) {
                this.logger.log(`${field.getAttribute("class")} is visible`);
                const fieldElement = field.querySelector("input, select, textarea");
                if (fieldElement &&
                    !ENGrid.getFieldValue(fieldElement.getAttribute("name"))) {
                    const fieldLabel = field.querySelector(".en__field__label");
                    if (fieldLabel) {
                        this.logger.log(`${fieldLabel.innerText} is required`);
                        ENGrid.setError(field, `${fieldLabel.innerText} is required`);
                    }
                    else {
                        this.logger.log(`${fieldElement.getAttribute("name")} is required`);
                        ENGrid.setError(field, `This field is required`);
                    }
                    this._form.validate = false;
                }
            }
        });
    }
}
