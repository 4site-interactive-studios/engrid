import { SignalDispatcher } from "strongly-typed-events";
import { ENGrid } from "../";

export class EnForm {
  private _onSubmit = new SignalDispatcher();
  private _onValidate = new SignalDispatcher();
  private _onError = new SignalDispatcher();
  public submit: boolean = true;
  public validate: boolean = true;

  private static instance: EnForm;

  private constructor() { }

  public static getInstance(): EnForm {
    if (!EnForm.instance) {
      EnForm.instance = new EnForm();
    }

    return EnForm.instance;
  }

  public dispatchSubmit() {
    this._onSubmit.dispatch();
    if (ENGrid.debug) console.log("dispatchSubmit");
  }

  public dispatchValidate() {
    this._onValidate.dispatch();
    if (ENGrid.debug) console.log("dispatchValidate");
  }

  public dispatchError() {
    this._onError.dispatch();
    if (ENGrid.debug) console.log("dispatchError");
  }

  public submitForm() {
    const enForm = document.querySelector(
      "form .en__submit button"
    ) as HTMLButtonElement;
    if (enForm) {
      // Add submitting class to modal
      const enModal = document.getElementById("enModal");
      if (enModal) enModal.classList.add("is-submitting");
      enForm.click();
      if (ENGrid.debug) console.log("submitForm");
    }
  }

  public get onSubmit() {
    // if(ENGrid.debug) console.log("onSubmit");
    return this._onSubmit.asEvent();
  }

  public get onError() {
    // if(ENGrid.debug) console.log("onError");
    return this._onError.asEvent();
  }

  public get onValidate() {
    // if(ENGrid.debug) console.log("onError");
    return this._onValidate.asEvent();
  }
}
