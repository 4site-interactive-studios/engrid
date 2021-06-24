import { SignalDispatcher } from "strongly-typed-events";
export class EnForm {
    constructor() {
        this._onSubmit = new SignalDispatcher();
        this._onError = new SignalDispatcher();
        this.submit = true;
    }
    static getInstance() {
        if (!EnForm.instance) {
            EnForm.instance = new EnForm();
        }
        return EnForm.instance;
    }
    dispatchSubmit() {
        this._onSubmit.dispatch();
        console.log("dispatchSubmit");
    }
    dispatchError() {
        this._onError.dispatch();
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
            console.log("submitForm");
        }
    }
    get onSubmit() {
        // console.log("onSubmit");
        return this._onSubmit.asEvent();
    }
    get onError() {
        // console.log("onError");
        return this._onError.asEvent();
    }
}
