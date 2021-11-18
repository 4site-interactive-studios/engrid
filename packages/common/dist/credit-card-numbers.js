// This class removes any non-numeric characters from the credit card field
import { EnForm } from "./events";
export class CreditCardNumbers {
    constructor() {
        this._form = EnForm.getInstance();
        this.ccField = document.getElementById("en__field_transaction_ccnumber");
        if (this.ccField) {
            this._form.onSubmit.subscribe(() => this.onlyNumbersCC());
        }
    }
    onlyNumbersCC() {
        const onlyNumbers = this.ccField.value.replace(/\D/g, "");
        this.ccField.value = onlyNumbers;
        return true;
    }
}
