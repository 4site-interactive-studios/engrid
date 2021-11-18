// This class removes any non-numeric characters from the credit card field

import { EnForm } from "./events";

export class CreditCardNumbers {
  public _form: EnForm = EnForm.getInstance();

  private ccField: HTMLInputElement = document.getElementById(
    "en__field_transaction_ccnumber"
  ) as HTMLInputElement;

  constructor() {
    if (this.ccField) {
      this._form.onSubmit.subscribe(() => this.onlyNumbersCC());
    }
  }

  private onlyNumbersCC() {
    const onlyNumbers = this.ccField.value.replace(/\D/g, "");
    this.ccField.value = onlyNumbers;
    return true;
  }
}
