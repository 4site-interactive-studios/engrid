// This class automatically select other radio input when an amount is entered into it.

import { EngridLogger } from ".";

export class OtherAmount {
  private logger: EngridLogger = new EngridLogger(
    "OtherAmount",
    "green",
    "black",
    "💰"
  );
  constructor() {
    "focusin input".split(" ").forEach((e) => {
      // We're attaching this event to the body because sometimes the other amount input is not in the DOM yet and comes via AJAX.
      document.querySelector("body")?.addEventListener(e, (event) => {
        const target = event.target as HTMLInputElement;
        if (target.classList.contains("en__field__input--other")) {
          this.logger.log("Other Amount Field Focused");
          this.setRadioInput();
        }
      });
    });
  }

  private setRadioInput() {
    const target = document.querySelector(
      ".en__field--donationAmt .en__field__input--other"
    ) as HTMLInputElement;
    if (target && target.parentNode && target.parentNode.parentNode) {
      const targetWrapper = target.parentNode as HTMLElement;
      targetWrapper.classList.remove("en__field__item--hidden");
      if (targetWrapper.parentNode) {
        const lastRadioInput = targetWrapper.parentNode.querySelector(
          ".en__field__item:nth-last-child(2) input"
        ) as HTMLInputElement;
        lastRadioInput.checked = !0;
      }
    }
  }
}
