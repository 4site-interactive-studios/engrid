import { SignalDispatcher } from "strongly-typed-events";
import { ENGrid } from "../";
export class EnForm {
    constructor() {
        this._onSubmit = new SignalDispatcher();
        this._onValidate = new SignalDispatcher();
        this._onError = new SignalDispatcher();
        this.submit = true;
        this.validate = true;
    }
    static getInstance() {
        if (!EnForm.instance) {
            EnForm.instance = new EnForm();
        }
        return EnForm.instance;
    }
    dispatchSubmit() {
        this._onSubmit.dispatch();
        if (ENGrid.debug)
            console.log("dispatchSubmit");
    }
    dispatchValidate() {
        this._onValidate.dispatch();
        if (ENGrid.debug)
            console.log("dispatchValidate");
    }
    dispatchError() {
        this._onError.dispatch();
        if (ENGrid.debug)
            console.log("dispatchError");
    }
    submitForm() {
        const enForm = document.querySelector("form .en__submit button");
        if (enForm) {
            // Add submitting class to modal
            const enModal = document.getElementById("enModal");
            if (enModal)
                enModal.classList.add("is-submitting");
            enForm.click();
            if (ENGrid.debug)
                console.log("submitForm");
        }
    }
    get onSubmit() {
        // if(ENGrid.debug) console.log("onSubmit");
        return this._onSubmit.asEvent();
    }
    get onError() {
        // if(ENGrid.debug) console.log("onError");
        return this._onError.asEvent();
    }
    get onValidate() {
        // if(ENGrid.debug) console.log("onError");
        return this._onValidate.asEvent();
    }
}
