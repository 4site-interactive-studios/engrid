// This class automatically select other radio input when an amount is entered into it.

export class OtherAmount {
  private otherAmountField: HTMLInputElement = document.querySelector(
    ".en__field__input--other"
  ) as HTMLInputElement;

  constructor() {
    if (this.otherAmountField) {
      "focus input".split(" ").forEach((e) => {
        document.querySelector("body")?.addEventListener(e, (event) => {
          if (event.target === this.otherAmountField) {
            this.setRadioInput();
          }
        });
      });
    }
  }

  private setRadioInput() {
    const target = this.otherAmountField;
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
