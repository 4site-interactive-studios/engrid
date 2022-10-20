// Automatically submits the page if a URL argument is present

import { ENGrid, EngridLogger } from ".";

export class autosubmit {
  private logger: EngridLogger = new EngridLogger(
    "Autosubmit",
    "#333333",
    "#f0f0f0",
    "🙈"
  );

  constructor() {
    this.autosubmit();
  }

  private autosubmit() {
    // Check for server side errors
    const serverSideError =
      window.EngagingNetworks.require._defined.enjs.checkSubmissionFailed();

    // Get URL Parameters
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);

    if (!serverSideError && urlParams.get("autosubmit") == "Y") {
      if (ENGrid.debug)
        this.logger.log('"autosubmit=Y" argument is present in URL');
      const submitButton = document.querySelector(
        "form .en__submit button"
      ) as HTMLButtonElement;
      if (submitButton) {
        submitButton.click();
      }
    }
  }
}
