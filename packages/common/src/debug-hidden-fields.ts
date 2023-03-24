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
    this.logger.log("Switching all type 'hidden' fields to type 'text'");

    const fields = document.querySelectorAll(
      "[type='hidden']"
    ) as NodeListOf<HTMLInputElement>;

    if (fields.length > 0) {
      fields.forEach((el) => {
        el.type = "text";
        el.setAttribute("unhidden", "");
      });
    }
  }
}
