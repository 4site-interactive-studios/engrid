// Component that adds 4Site Special Features to the Supporter Hub Page

import { ENGrid, EngridLogger, EnForm } from "./";

export class SupporterHub {
  private logger: EngridLogger = new EngridLogger(
    "SupporterHub",
    "black",
    "pink",
    "🛖"
  );
  private _form: EnForm = EnForm.getInstance();
  constructor() {
    if (!this.shoudRun()) return;
    this.logger.log("Enabled");
    this.watch();
  }
  shoudRun() {
    return (
      "pageJson" in window &&
      "pageType" in window.pageJson &&
      window.pageJson.pageType === "supporterhub"
    );
  }
  watch() {
    const form = ENGrid.enForm;
    // Create a observer to watch the Form for overlays
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === "childList") {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeName === "DIV") {
              const overlay = node as HTMLDivElement;
              if (
                overlay.classList.contains("en__hubOverlay") ||
                overlay.classList.contains("en__hubPledge__panels")
              ) {
                this.logger.log("Overlay found");
                this.creditCardUpdate(node as HTMLDivElement);
                this.amountLabelUpdate(node as HTMLDivElement);
              }
            }
          });
        }
      });
    });
    // Start observing the Link ID #plaid-link-button
    observer.observe(form, {
      childList: true,
      subtree: true,
    });
    // Run the Credit Card Update function in case the overlay is already present on page load
    const hubOverlay = document.querySelector(".en__hubOverlay");
    if (hubOverlay) {
      this.creditCardUpdate(hubOverlay as HTMLDivElement);
      this.amountLabelUpdate(hubOverlay as HTMLDivElement);
    }
  }
  creditCardUpdate(overlay: HTMLDivElement) {
    window.setTimeout(() => {
      // Check if the overlay has Credit Card field and Update Button
      const ccField = overlay.querySelector(
          "#en__hubPledge__field--ccnumber"
        ) as HTMLInputElement,
        updateButton = overlay.querySelector(
          ".en__hubUpdateCC__toggle"
        ) as HTMLButtonElement;
      if (ccField && updateButton) {
        // When field gets focus, click the update button
        ccField.addEventListener("focus", () => {
          this.logger.log("Credit Card field focused");
          updateButton.click();
        });
      }
    }, 300);
  }
  amountLabelUpdate(overlay: HTMLDivElement) {
    window.setTimeout(() => {
      // Check if the overlay has Amounts, and set the currency symbol updated attribute
      const amountContainer = overlay.querySelector(
        ".en__field--donationAmt"
      ) as HTMLDivElement;
      if (amountContainer) {
        amountContainer
          .querySelectorAll(".en__field__element--radio .en__field__item")
          .forEach((node) => {
            node.setAttribute("data-engrid-currency-symbol-updated", "true");
          });
      }
    }, 300);
  }
}
