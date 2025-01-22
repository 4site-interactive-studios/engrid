// This component is responsible for showing a ladder of checkboxes, one at a time, to the user.
// If the page is not embedded in an iframe, and there are EN's Opt-In fields on the page, we will store the values to sessionStorage upon Form Submit.
// If the page is embedded in an iframe and on a Thank You Page, we will look for .optin-ladder elements, compare the values to sessionStorage, and show the next checkbox in the ladder, removing all but the first match.
// If the page is embedded in an iframe and on a Thank You Page, and the child iFrame is also a Thank You Page, we will look for a sessionStorage that has the current ladder step and the total number of steps.
// If the current step is less than the total number of steps, we will redirect to the first page. If the current step is equal to the total number of steps, we will show the Thank You Page.
import { EngridLogger, ENGrid, EnForm } from ".";

export class OptInLadder {
  private logger: EngridLogger = new EngridLogger(
    "OptInLadder",
    "lightgreen",
    "darkgreen",
    "✔"
  );
  private _form: EnForm = EnForm.getInstance();

  constructor() {
    if (!this.inIframe()) {
      this.runAsParent();
    } else if (ENGrid.getPageNumber() === 1) {
      this.runAsChildRegular();
    } else {
      this.runAsChildThankYou();
    }
  }

  private runAsParent() {
    this.logger.log("Running as Parent");
    if (ENGrid.getPageNumber() === ENGrid.getPageCount()) {
      // We are on the Thank You Page as a Parent
      // Check autoinject iFrame
      const optInLadderOptions = ENGrid.getOption("OptInLadder");
      if (!optInLadderOptions || !optInLadderOptions.iframeUrl) {
        this.logger.log("Options not found");
        return;
      }
      // Create an iFrame
      const iframe = document.createElement("iframe");
      iframe.src = optInLadderOptions.iframeUrl;
      iframe.style.width = "100%";
      iframe.style.height = "0";
      iframe.scrolling = "no";
      iframe.frameBorder = "0";
      iframe.allowFullscreen = true;
      iframe.allow = "payment";
      iframe.classList.add("opt-in-ladder-iframe");
      iframe.classList.add("engrid-iframe");
      // If the page already has an iFrame with the same class, we don't need to add another one
      const existingIframe = document.querySelector(".opt-in-ladder-iframe");
      if (existingIframe) {
        this.logger.log("iFrame already exists");
        return;
      }
      // Check if the current page is part of the excludePageIDs
      if (
        optInLadderOptions.excludePageIDs &&
        optInLadderOptions.excludePageIDs.includes(ENGrid.getPageID())
      ) {
        this.logger.log("Current page is excluded");
        return;
      }
      // Append the iFrame to the proper placement
      const placementQuerySelector =
        optInLadderOptions.placementQuerySelector || ".body-top";
      const placement = document.querySelector(placementQuerySelector);
      if (!placement) {
        this.logger.error("Placement not found");
        return;
      }
      placement.appendChild(iframe);
    } else {
      // Grab all the checkboxes with the name starting with "supporter.questions"
      const checkboxes = document.querySelectorAll(
        'input[name^="supporter.questions"]'
      );
      if (checkboxes.length === 0) {
        this.logger.log("No checkboxes found");
        return;
      }
      this._form.onSubmit.subscribe(() => {
        // Save the checkbox values to sessionStorage
        this.saveOptInsToSessionStorage("parent");
      });
      if (ENGrid.getPageNumber() === 1) {
        // Delete items from sessionStorage
        this.clearSessionStorage();
      }
    }
  }

  private runAsChildRegular() {
    if (!this.isEmbeddedThankYouPage()) {
      this.logger.log("Not Embedded on a Thank You Page");
      return;
    }
    const optInHeaders = document.querySelectorAll(
      ".en__component--copyblock.optin-ladder"
    ) as NodeListOf<HTMLElement>;
    const optInFormBlocks = document.querySelectorAll(
      ".en__component--formblock.optin-ladder"
    ) as NodeListOf<HTMLElement>;
    if (optInHeaders.length === 0 && optInFormBlocks.length === 0) {
      this.logger.log("No optin-ladder elements found");
      return;
    }
    // Check if the e-mail field exist and is not empty
    const emailField = ENGrid.getField(
      "supporter.emailAddress"
    ) as HTMLInputElement;
    if (!emailField || !emailField.value) {
      this.logger.log("Email field is empty");
      // Since this is a OptInLadder page with no e-mail address, hide the page
      this.hidePage();
      return;
    }
    const sessionStorageCheckboxValues = JSON.parse(
      sessionStorage.getItem("engrid.supporter.questions") || "{}"
    );
    let currentStep = 0;
    let totalSteps = optInHeaders.length;
    let currentHeader: HTMLElement | null = null;
    let currentFormBlock: HTMLElement | null = null;
    for (let i = 0; i < optInHeaders.length; i++) {
      const header = optInHeaders[i] as HTMLElement;
      // Get the optin number from the .optin-ladder-XXXX class
      const optInNumber = header.className.match(/optin-ladder-(\d+)/);
      if (!optInNumber) {
        this.logger.error(
          `No optin number found in ${header.innerText.trim()}`
        );
        return;
      }
      const optInIndex = optInNumber[1];
      // Get the checkbox FormBlock
      const formBlock = document.querySelector(
        `.en__component--formblock.optin-ladder:has(.en__field--${optInIndex})`
      );
      if (!formBlock) {
        this.logger.log(`No form block found for ${header.innerText.trim()}`);
        // Remove the header if there is no form block
        header.remove();
        // Increment the current step
        currentStep++;
        continue;
      }
      // Check if the optInIndex is in sessionStorage
      if (sessionStorageCheckboxValues[optInIndex] === "Y") {
        // If the checkbox is checked, remove the header and form block
        header.remove();
        formBlock.remove();
        // Increment the current step
        currentStep++;
        continue;
      }
      // If there's a header and a form block, end the loop
      currentHeader = header;
      currentFormBlock = formBlock as HTMLElement;
      currentStep++;
      break;
    }
    if (!currentHeader || !currentFormBlock) {
      this.logger.log("No optin-ladder elements found");
      // Set the current step to the total steps to avoid redirecting to the first page
      currentStep = totalSteps;
      this.saveStepToSessionStorage(currentStep, totalSteps);
      // hide the page
      this.hidePage();
      return;
    }
    // Show the current header and form block, while removing the rest
    optInHeaders.forEach((header) => {
      if (header !== currentHeader) {
        header.remove();
      } else {
        header.style.display = "block";
      }
    });
    optInFormBlocks.forEach((formBlock) => {
      if (formBlock !== currentFormBlock) {
        formBlock.remove();
      } else {
        formBlock.style.display = "block";
      }
    });
    // Save the current step to sessionStorage
    this.saveStepToSessionStorage(currentStep, totalSteps);
    // On form submit, save the checkbox values to sessionStorage
    this._form.onSubmit.subscribe(() => {
      this.saveOptInsToSessionStorage("child");

      // Save the current step to sessionStorage
      currentStep++;
      this.saveStepToSessionStorage(currentStep, totalSteps);
    });
  }

  private runAsChildThankYou() {
    if (!this.isEmbeddedThankYouPage()) {
      this.logger.log("Not Embedded on a Thank You Page");
      return;
    }
    const hasOptInLadderStop = sessionStorage.getItem(
      "engrid.optin-ladder-stop"
    );
    if (hasOptInLadderStop) {
      this.logger.log("OptInLadder has been stopped");
      return;
    }
    const sessionStorageOptInLadder = JSON.parse(
      sessionStorage.getItem("engrid.optin-ladder") || "{}"
    );
    const currentStep = sessionStorageOptInLadder.step || 0;
    const totalSteps = sessionStorageOptInLadder.totalSteps || 0;
    if (currentStep <= totalSteps) {
      this.logger.log(
        `Current step ${currentStep} is less or equal to total steps ${totalSteps}`
      );
      this.hidePage();
      // Redirect to the first page
      window.location.href = this.getFirstPageUrl();
      return;
    } else {
      this.logger.log(
        `Current step ${currentStep} is greater than total steps ${totalSteps}`
      );
      // Remove the session storage
      this.clearSessionStorage();
    }
  }

  private inIframe() {
    try {
      return window.self !== window.top;
    } catch (e) {
      return true;
    }
  }

  private saveStepToSessionStorage(step: number, totalSteps: number) {
    sessionStorage.setItem(
      "engrid.optin-ladder",
      JSON.stringify({ step, totalSteps })
    );
    this.logger.log(`Saved step ${step} of ${totalSteps} to sessionStorage`);
  }

  private getFirstPageUrl() {
    // Get the current URL and replace the last path with 1?chain
    const url = new URL(window.location.href);
    const path = url.pathname.split("/");
    path.pop();
    path.push("1");
    return url.origin + path.join("/") + "?chain";
  }

  private saveOptInsToSessionStorage(type: "parent" | "child" = "parent") {
    // Grab all the checkboxes with the name starting with "supporter.questions"
    const checkboxes = document.querySelectorAll(
      'input[name^="supporter.questions"]'
    );
    if (checkboxes.length === 0) {
      this.logger.log("No checkboxes found");
      return;
    }
    const sessionStorageCheckboxValues = JSON.parse(
      sessionStorage.getItem("engrid.supporter.questions") || "{}"
    );
    let hasDeny = false;
    // Loop through all the checkboxes and store the value in sessionStorage
    (checkboxes as NodeListOf<HTMLInputElement>).forEach((checkbox) => {
      if (checkbox.checked) {
        const index = checkbox.name.split(".")[2];
        sessionStorageCheckboxValues[index] = "Y";
      } else {
        hasDeny = true;
      }
    });
    sessionStorage.setItem(
      "engrid.supporter.questions",
      JSON.stringify(sessionStorageCheckboxValues)
    );
    this.logger.log(
      `Saved checkbox values to sessionStorage: ${JSON.stringify(
        sessionStorageCheckboxValues
      )}`
    );
    if (type === "child" && hasDeny) {
      // Add a deny value to the sessionStorage to stop the ladder
      sessionStorage.setItem("engrid.optin-ladder-stop", "Y");
    }
  }
  private isEmbeddedThankYouPage() {
    return ENGrid.getBodyData("embedded") === "thank-you-page-donation";
  }
  private hidePage() {
    const engridPage = document.querySelector("#engrid") as HTMLElement;
    if (engridPage) {
      engridPage.classList.add("hide");
    }
  }
  private clearSessionStorage() {
    sessionStorage.removeItem("engrid.supporter.questions");
    sessionStorage.removeItem("engrid.optin-ladder");
    sessionStorage.removeItem("engrid.optin-ladder-stop");
  }
}
