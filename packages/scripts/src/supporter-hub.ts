// Component that adds 4Site Special Features to the Supporter Hub Page

import { ENGrid, EngridLogger, EnForm } from ".";

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
    this.preventDuplicateSubmits();
    this.pageAltsAndArias();
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
                this.dialogAltsAndArias(node as HTMLDivElement);
              }
            }
          });
          mutation.removedNodes.forEach((node) => {
            if (node.nodeName === "DIV") {
              const overlay = node as HTMLDivElement;
              if (
                overlay.classList.contains("en__hubOverlay") ||
                overlay.classList.contains("en__hubPledge__panels")
              ) {
                this.logger.log("Overlay removed");
                this.inertPage(false);
              }
            }
          });
        }
      });
    });
    // Start observing the Link ID
    observer.observe(form, {
      childList: true,
      subtree: true,
    });
    // Run the Credit Card Update function in case the overlay is already present on page load
    const hubOverlay = document.querySelector(".en__hubOverlay");
    if (hubOverlay) {
      this.creditCardUpdate(hubOverlay as HTMLDivElement);
      this.amountLabelUpdate(hubOverlay as HTMLDivElement);
      this.dialogAltsAndArias(hubOverlay as HTMLDivElement);
    }
  }
  pageAltsAndArias() {
    // Find every en__component--hubgadget and set role as button and aria-label as the span content of the component
    document.querySelectorAll(".en__component--hubgadget").forEach((node) => {
      const button = node as HTMLDivElement
      const labelSpan = button.querySelector("span");
      if (!labelSpan) return;
      const img = button.querySelector("img");
      img?.setAttribute("aria-hidden", "true");
      const slug = ENGrid.slugify(labelSpan.innerText);
      const labelId = `hubgadget-label-${slug}`;
      labelSpan.setAttribute("id", labelId);
      button.setAttribute("aria-labelledby", labelId);
      button.setAttribute("role", "button");
      button.setAttribute("aria-controls", `huboverlay-${slug}`);
      button.setAttribute("aria-haspopup", "dialog");
      if (!button.classList.contains("en__component--hubgadget--inactive")) {
        button.setAttribute("tabindex", "0");
        button.addEventListener("keydown", (e: KeyboardEvent) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            button.click();
          }
        });
      }
    });
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
  dialogAltsAndArias(overlay: HTMLDivElement) {
    window.setTimeout(() => {
      this.inertPage(true, overlay);
      const header = overlay.querySelector(
        ".en__hubOverlay__header"
      ) as HTMLDivElement,
        closeButton = header.querySelector("a") as HTMLAnchorElement;
      // Tag close button
      if (header && closeButton) {
        closeButton.setAttribute("role", "button");
        closeButton.setAttribute("aria-label", "Close");
      }
      // Tag header and label dialog
      const headerTitle = header.querySelector("h2") as HTMLHeadingElement;
      const slug = ENGrid.slugify(headerTitle?.innerText || "supporter-hub-overlay");
      let headerTitleId = `huboverlay-title-${slug}`;
      if (headerTitle) {
        headerTitleId = headerTitle.id || headerTitleId;
        headerTitle.setAttribute("id", headerTitleId);
      }
      const popup = overlay.querySelector(
        ".en__hubOverlay__popup"
      ) as HTMLDivElement;
      if (popup) {
        popup.setAttribute("id", `huboverlay-${slug}`);
        popup.setAttribute("role", "dialog");
        popup.setAttribute("aria-modal", "true");
        if (headerTitle) {
          popup.setAttribute("aria-labelledby", headerTitleId);
        } else {
          popup.setAttribute("aria-label", "Supporter Hub Overlay");
        }
      }
    }, 300);
  }
  inertPage(inert: boolean, overlay?: HTMLDivElement) {
    if (inert) {
      const hubOverlay =
        overlay && overlay.classList.contains("en__hubOverlay")
          ? overlay
          : (document.querySelector(".en__hubOverlay") as HTMLDivElement) ||
          overlay;
      if (!hubOverlay) return;

      let element: HTMLElement | null = hubOverlay;
      while (element && element !== document.body) {
        const parent: HTMLElement | null = element.parentElement;
        if (parent) {
          Array.from(parent.children).forEach((sibling) => {
            if (
              sibling !== element &&
              sibling instanceof HTMLElement &&
              !sibling.hasAttribute("inert")
            ) {
              sibling.setAttribute("inert", "");
              sibling.dataset.engridInert = "true";
            }
          });
        }
        element = parent;
      }
    } else if (!document.querySelector(".en__hubOverlay, .en__hubPledge__panels")) {
      document
        .querySelectorAll<HTMLElement>("[data-engrid-inert]")
        .forEach((element) => {
          element.removeAttribute("inert");
          delete element.dataset.engridInert;
        });
    }
  }
  // The supporter hub does not properly handle or prevent duplicate submits, so we add a listener to prevent this.
  private preventDuplicateSubmits() {
    document.addEventListener(
      "click",
      (e: MouseEvent) => {
        const btn = (e.target as HTMLElement).closest(
          ".en__submit button"
        ) as HTMLButtonElement;
        if (!btn) return;
        if (btn.dataset.busy) {
          e.stopImmediatePropagation();
          e.preventDefault();
          return;
        }
        btn.dataset.busy = "true";
        setTimeout(() => delete btn.dataset.busy, 10000);
      },
      true
    );
  }
}
