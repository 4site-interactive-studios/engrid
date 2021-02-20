import { SignalDispatcher } from "strongly-typed-events";

export class EnForm {
  private _onSubmit = new SignalDispatcher();
  private _onError = new SignalDispatcher();
  public submit: boolean = true;

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
    console.log("dispatchSubmit");
  }

  public dispatchError() {
    this._onError.dispatch();
    console.log("dispatchError");
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
      console.log("submitForm");
    }
  }

  public get onSubmit() {
    // console.log("onSubmit");
    return this._onSubmit.asEvent();
  }

  public get onError() {
    // console.log("onError");
    return this._onError.asEvent();
  }
}
