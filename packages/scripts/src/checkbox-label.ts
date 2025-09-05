// Component to allow the user to set custom labels for the checkboxes,
// you can customize the checkbox label on a per-page basis, which is not possible with Engaging Networks
// The .checkbox-label element should be placed right before the checkbox form block

import { EngridLogger } from ".";

export class CheckboxLabel {
  private logger: EngridLogger = new EngridLogger(
    "CheckboxLabel",
    "#00CC95",
    "#2C3E50",
    "✅"
  );
  private checkBoxesLabels: NodeListOf<HTMLDivElement> =
    document.querySelectorAll(".checkbox-label");
  constructor() {
    if (!this.shoudRun()) return;
    this.logger.log(`Found ${this.checkBoxesLabels.length} custom labels`);
    this.run();
  }
  shoudRun() {
    return this.checkBoxesLabels.length > 0;
  }
  run() {
    this.checkBoxesLabels.forEach((checkboxLabel) => {
      const labelHTML = checkboxLabel.innerHTML.trim();
      const checkboxContainer =
        checkboxLabel.nextElementSibling as HTMLDivElement;
      const checkboxLabelElement = checkboxContainer.querySelector(
        "label:last-child"
      ) as HTMLLabelElement;
      if (!checkboxLabelElement || !labelHTML) return;
      checkboxLabelElement.innerHTML = `<div class="engrid-custom-checkbox-label">${labelHTML}</div>`;
      // Remove the original label element
      checkboxLabel.remove();
      this.logger.log(`Set checkbox label to "${labelHTML}"`);
    });
  }
}
