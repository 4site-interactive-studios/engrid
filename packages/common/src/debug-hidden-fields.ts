// Switches hidden fields to be type text when debug mode is enabled.

import { EngridLogger } from ".";

export class DebugHiddenFields {
  private logger: EngridLogger = new EngridLogger(
    "Debug hidden fields",
    "#f0f0f0",
    "#ff0000",
    "🫣"
  );

  constructor() {
    // Query all hidden input elements within the specified selectors
    const fields = document.querySelectorAll(
      ".en__component--row [type='hidden'][class*='en_'], .engrid-added-input[type='hidden']"
    ) as NodeListOf<HTMLInputElement>;

    // Check if there are any hidden fields
    if (fields.length > 0) {
      // Log the names of the hidden fields being changed to type 'text'
      this.logger.log(
        `Switching the following type 'hidden' fields to type 'text':  ${[
          ...fields,
        ]
          .map((f) => f.name)
          .join(", ")}`
      );

      // Iterate through each hidden input element
      fields.forEach((el) => {
        // Change the input type to 'text' and add the required classes
        el.type = "text";
        el.classList.add("en__field__input", "en__field__input--text");

        // Create a new label element and set its text and classes
        const label = document.createElement("label");
        label.textContent = "Hidden field: " + el.name;
        label.classList.add("en__field__label");

        // Create a new 'div' element for the input field and add the required classes
        const fieldElement = document.createElement("div");
        fieldElement.classList.add(
          "en__field__element",
          "en__field__element--text"
        );

        // Create a new 'div' container for the label and input field, and add the required classes and attribute
        const fieldContainer = document.createElement("div");
        fieldContainer.classList.add("en__field", "en__field--text", "hide");
        fieldContainer.dataset.unhidden = "";
        fieldContainer.appendChild(label);
        fieldContainer.appendChild(fieldElement);

        // Insert the new field container before the original input element and move the input element into the field element div
        if (el.parentNode) {
          el.parentNode.insertBefore(fieldContainer, el);
          fieldElement.appendChild(el);
        }
      });
    }
  }
}
