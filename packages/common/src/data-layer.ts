// This class automatically select other radio input when an amount is entered into it.

import { EngridLogger, ENGrid, EnForm } from ".";

export class DataLayer {
  private logger: EngridLogger = new EngridLogger(
    "DataLayer",
    "#f1e5bc",
    "#009cdc",
    "📊"
  );
  private dataLayer = (window as any).dataLayer || [];
  private _form: EnForm = EnForm.getInstance();
  constructor() {
    if (!this.shouldRun()) {
      // If we're not on a Donation Page, get out
      return;
    }
    this.onLoad();
    this._form.onSubmit.subscribe(() => this.onSubmit());
  }
  private shouldRun() {
    return ENGrid.getPageType() === "DONATION";
  }
  private onLoad() {
    if (ENGrid.getGiftProcess()) {
      this.logger.log("EN_SUCCESSFUL_DONATION");
      this.dataLayer.push({
        event: "EN_SUCCESSFUL_DONATION",
      });
    } else {
      this.logger.log("EN_PAGE_VIEW");
      this.dataLayer.push({
        event: "EN_PAGE_VIEW",
      });
    }
  }
  private onSubmit() {
    const optIn = document.querySelector(
      ".en__field__item:not(.en__field--question) input[name^='supporter.questions'][type='checkbox']:checked"
    );
    if (optIn) {
      this.logger.log("EN_SUBMISSION_WITH_EMAIL_OPTIN");
      this.dataLayer.push({
        event: "EN_SUBMISSION_WITH_EMAIL_OPTIN",
      });
    } else {
      this.logger.log("EN_SUBMISSION_WITHOUT_EMAIL_OPTIN");
      this.dataLayer.push({
        event: "EN_SUBMISSION_WITHOUT_EMAIL_OPTIN",
      });
    }
  }
}
