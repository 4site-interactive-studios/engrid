import { SignalDispatcher } from "strongly-typed-events";
import { EngridLogger } from "..";

export class EnForm {
  private logger: EngridLogger = new EngridLogger("EnForm");
  private _onIntentSubmit = new SignalDispatcher();
  private _onSubmit = new SignalDispatcher();
  private _onValidate = new SignalDispatcher();
  private _onError = new SignalDispatcher();
  public submit: boolean = true;
  public submitPromise: boolean | Promise<any> = false;
  public validate: boolean = true;
  public validatePromise: boolean | Promise<any> = false;

  private static instance: EnForm;

  private constructor() {}

  public static getInstance(): EnForm {
    if (!EnForm.instance) {
      EnForm.instance = new EnForm();
    }

    return EnForm.instance;
  }

  public dispatchIntentSubmit() {
    this._onIntentSubmit.dispatch();
    this.logger.log("dispatchIntentSubmit");
  }

  public dispatchSubmit() {
    this._onSubmit.dispatch();
    this.logger.log("dispatchSubmit");
  }

  public dispatchValidate() {
    this._onValidate.dispatch();
    this.logger.log("dispatchValidate");
  }

  public dispatchError() {
    this._onError.dispatch();
    this.logger.log("dispatchError");
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
      this.logger.log("submitForm");
    }
  }

  /**
   * onIntentSubmit is dispatched when a submit button is clicked,
   * or a digital wallet submission is initiated,
   * but before server-side validation or the actual submit event.
   * This allows you to run code at the moment the user intends to submit,
   * such as triggering data formatting, analytics events, or other pre-submit actions.
   * Actions that rely on fully processed form data or validation results should use the onSubmit event instead.
   * Note: onSubmit will also dispatch onIntentSubmit, so do not repeat actions in both events.
   */
  public get onIntentSubmit() {
    return this._onIntentSubmit.asEvent();
  }

  /**
   * onSubmit is dispatched when the form is submitted, after validation has passed.
   * This is the main event to listen to for form submissions, as it indicates that the user has successfully submitted the form and all validation checks have been passed.
   * This event uses window.enOnSubmit, which is called by Engaging Networks' JavaScript when the form is submitted.
   * At the time of writing, enOnSubmit does not trigger when a user submits via a digital wallet, use onIntentSubmit to listen for those submission attempts.
   * Note: onSubmit will also dispatch onIntentSubmit, so do not repeat actions in both events.
   */
  public get onSubmit() {
    return this._onSubmit.asEvent();
  }

  /**
   * onValidate is dispatched using window.enOnValidate, which is called by Engaging Networks' JavaScript
   * when the form is being validated, before submission. This only occurs after ENgrid's client-side validation has passed, but before server-side validation.
   */
  public get onError() {
    return this._onError.asEvent();
  }

  /**
   * onError is dispatched using window.enOnError, which is called by Engaging Networks' JavaScript when a server-side validation error occurs on form submission.
   * This allows you to listen for validation errors and respond accordingly, such as displaying custom error messages or triggering analytics events.
   */
  public get onValidate() {
    return this._onValidate.asEvent();
  }
}
