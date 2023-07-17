/**
 * This class will add event listeners to every yes/no radio button or checkbox
 * inside a universal opt-in element (any form block with the CSS class universal-opt-in). When the user clicks on a radio/checkbox
 * button, we will search for every other radio/checkbox button inside the same
 * universal opt-in element and mirror the user's selection.
 * If instead of universal-opt-in you use universal-opt-in_null, the class will
 * not mirror the user's selection when a radio "No" option is selected. Instead,
 * it will unset all other radio buttons.
 */
import { EngridLogger, ENGrid } from ".";

export class UniversalOptIn {
  private logger: EngridLogger = new EngridLogger(
    "UniversalOptIn",
    "#f0f0f0",
    "#d2691e",
    "🪞"
  );
  private _elements: NodeListOf<HTMLElement> = document.querySelectorAll(
    ".universal-opt-in, .universal-opt-in_null"
  );

  constructor() {
    if (!this.shouldRun()) return;
    this.addEventListeners();
  }
  shouldRun() {
    if (this._elements.length === 0) {
      this.logger.log("No universal opt-in elements found. Skipping.");
      return false;
    }
    this.logger.log(
      `Found ${this._elements.length} universal opt-in elements.`
    );
    return true;
  }
  addEventListeners() {
    this._elements.forEach((element) => {
      const yesNoElements = element.querySelectorAll(
        ".en__field__input--radio, .en__field__input--checkbox"
      ) as NodeListOf<HTMLInputElement>;
      if (yesNoElements.length > 0) {
        yesNoElements.forEach((yesNoElement) => {
          yesNoElement.addEventListener("click", () => {
            if (
              yesNoElement instanceof HTMLInputElement &&
              yesNoElement.getAttribute("type") === "checkbox"
            ) {
              const yesNoValue = yesNoElement.checked;
              if (yesNoValue) {
                this.logger.log(
                  "Yes/No " + yesNoElement.getAttribute("type") + " is checked"
                );
                yesNoElements.forEach((yesNoElement2) => {
                  if (yesNoElement === yesNoElement2) return;
                  if (
                    yesNoElement2 instanceof HTMLInputElement &&
                    yesNoElement2.getAttribute("type") === "checkbox"
                  )
                    yesNoElement2.checked = true;
                });
              } else {
                this.logger.log(
                  "Yes/No " +
                    yesNoElement.getAttribute("type") +
                    " is unchecked"
                );
                yesNoElements.forEach((yesNoElement2) => {
                  if (yesNoElement === yesNoElement2) return;
                  if (
                    yesNoElement2 instanceof HTMLInputElement &&
                    yesNoElement2.getAttribute("type") === "checkbox"
                  )
                    yesNoElement2.checked = false;
                });
              }
              return;
            }
            const yesNoValue = yesNoElement.getAttribute("value");
            if (yesNoValue === "Y") {
              this.logger.log(
                "Yes/No " + yesNoElement.getAttribute("type") + " is checked"
              );

              yesNoElements.forEach((yesNoElement2) => {
                const fieldName = yesNoElement2.getAttribute("name");
                const clickedFieldName = yesNoElement.getAttribute("name");
                if (!fieldName || fieldName === clickedFieldName) return;
                ENGrid.setFieldValue(fieldName, "Y");
              });
            } else {
              this.logger.log(
                "Yes/No " + yesNoElement.getAttribute("type") + " is unchecked"
              );
              yesNoElements.forEach((yesNoElement2) => {
                const fieldName = yesNoElement2.getAttribute("name");
                const clickedFieldName = yesNoElement.getAttribute("name");
                if (!fieldName || fieldName === clickedFieldName) return;
                if (element.classList.contains("universal-opt-in")) {
                  ENGrid.setFieldValue(fieldName, "N");
                } else {
                  yesNoElement2.checked = false;
                }
              });
            }
          });
        });
      }
    });
  }
}
