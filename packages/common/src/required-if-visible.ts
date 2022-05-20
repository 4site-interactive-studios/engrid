import { EnForm, ENGrid, EngridLogger } from "./";

export class RequiredIfVisible {
  private logger: EngridLogger = new EngridLogger(
    "RequiredIfVisible",
    "#FFFFFF",
    "#811212",
    "🚥"
  );
  private _form: EnForm = EnForm.getInstance();
  private requiredIfVisibleElements = document.querySelectorAll(
    `
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
    `
  ) as NodeListOf<HTMLElement>;

  constructor() {
    if (!this.shouldRun()) return;
    this._form.onValidate.subscribe(this.validate.bind(this));
  }
  private shouldRun() {
    return this.requiredIfVisibleElements.length > 0;
  }
  private validate() {
    this.requiredIfVisibleElements.forEach((field) => {
      ENGrid.removeError(field);
      if (ENGrid.isVisible(field)) {
        this.logger.log(`${field.getAttribute("class")} is visible`);
        const fieldElement = field.querySelector("input, select, textarea");
        if (
          fieldElement &&
          !ENGrid.getFieldValue(fieldElement.getAttribute("name") as string)
        ) {
          const fieldLabel = field.querySelector(
            ".en__field__label"
          ) as HTMLLabelElement;
          if (fieldLabel) {
            this.logger.log(`${fieldLabel.innerText} is required`);
            ENGrid.setError(field, `${fieldLabel.innerText} is required`);
          } else {
            this.logger.log(`${fieldElement.getAttribute("name")} is required`);
            ENGrid.setError(field, `This field is required`);
          }
          this._form.validate = false;
        }
      }
    });
  }
}
