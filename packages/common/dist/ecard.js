import { ENGrid, EnForm } from "./";
export class Ecard {
    constructor() {
        this._form = EnForm.getInstance();
        if (ENGrid.getPageType() === "ECARD") {
            this._form.onValidate.subscribe(() => this.checkRecipientFields());
        }
    }
    checkRecipientFields() {
        const addRecipientButton = document.querySelector(".en__ecarditems__addrecipient");
        // If we find the "+" button and there's no hidden recipient field, click on the button
        if (addRecipientButton &&
            !document.querySelector(".ecardrecipient__email")) {
            addRecipientButton.click();
        }
        return true;
    }
}
