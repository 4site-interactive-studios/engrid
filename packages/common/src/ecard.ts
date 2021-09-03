import { ENGrid, EnForm } from "./";

export class Ecard {
  public _form: EnForm = EnForm.getInstance();

  constructor() {
    if (ENGrid.getPageType() === "ECARD") {
      this._form.onValidate.subscribe(() => this.checkRecipientFields());
    }
  }

  private checkRecipientFields() {
    const addRecipientButton: HTMLButtonElement = document.querySelector(
      ".en__ecarditems__addrecipient"
    ) as HTMLButtonElement;
    // If we find the "+" button and there's no hidden recipient field, click on the button
    if (
      addRecipientButton &&
      !document.querySelector(".ecardrecipient__email")
    ) {
      addRecipientButton.click();
    }
    return true;
  }
}
