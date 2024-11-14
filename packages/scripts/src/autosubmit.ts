// Automatically submits the page if a URL argument is present

import { ENGrid, EngridLogger, EnForm } from ".";

export class Autosubmit {
  private logger: EngridLogger = new EngridLogger(
    "Autosubmit",
    "#f0f0f0",
    "#ff0000",
    "🚀"
  );

  private _form: EnForm = EnForm.getInstance();

  constructor() {
    if (
      ENGrid.checkNested(
        window.EngagingNetworks,
        "require",
        "_defined",
        "enjs",
        "checkSubmissionFailed"
      ) &&
      !window.EngagingNetworks.require._defined.enjs.checkSubmissionFailed() &&
      ENGrid.getUrlParameter("autosubmit") === "Y"
    ) {
      this.logger.log("Autosubmitting Form");
      // Fix EN ?chain parameter not working with email addresses with + in them
      ENGrid.setFieldValue(
        "supporter.emailAddress",
        ENGrid.getFieldValue("supporter.emailAddress").replace(/\s/g, "+")
      );
      this._form.submitForm();
    }
  }
}
