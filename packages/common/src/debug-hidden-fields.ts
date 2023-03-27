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
    const fields = document.querySelectorAll(
      ".en__component--row [type='hidden'], .engrid-added-input[type='hidden']"
    ) as NodeListOf<HTMLInputElement>;

    if (fields.length > 0) {
      this.logger.log(
        `Switching the following type 'hidden' fields to type 'text':  ${[
          ...fields,
        ]
          .map((f) => f.name)
          .join(", ")}`
      );

      fields.forEach((el) => {
        el.type = "text";
        el.setAttribute("unhidden", "");
        const label = document.createElement("label");
        label.textContent = "Hidden field:" + el.name;
        el.insertAdjacentElement("beforebegin", label);
      });
    }
  }
}
