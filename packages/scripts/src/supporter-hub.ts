// Component that adds 4Site Special Features to the Supporter Hub Page

import { ENGrid, EngridLogger, EnForm, A11y } from ".";

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
    if (ENGrid.getPageNumber() === 1) {
      this.announceLoginResponses();
    }
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
                A11y.inertPage(false);
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
      const button = node as HTMLDivElement;
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
    const emailField = document.querySelector('.en__field--hublogin') as HTMLInputElement;
    if (emailField) {
      const label = emailField.querySelector('label');
      const input = emailField.querySelector('input');
      if (label && input) {
        const slug = ENGrid.slugify(label.innerText);
        const labelId = `hublogin-label-${slug}`;
        label.setAttribute("id", labelId);
        input.setAttribute("aria-labelledby", labelId);
      }
    }
  }
  /**
   * The Supporter Hub login form shows success / failure / loading messages by
   * toggling the inline `display` on static `.en__hubgadget__response` divs.
   * Engaging Networks owns that behavior, and screen readers don't reliably
   * announce content that was already in the DOM and merely flipped to visible.
   *
   * We hide the originals from AT and mirror the active message into a polite
   * (`role="status"`) or assertive (`role="alert"`, for failures) live region.
   * On any display change we debounce, then announce whichever response is
   * currently visible, preferring a terminal result over the transient
   * "Loading" so an instant failure isn't preceded by a stray "Loading".
   */
  private announceLoginResponses() {
    const body = document.querySelector(".en__supporterHubLogin__body");
    if (!body) return;
    const responses = body.querySelectorAll<HTMLDivElement>(
      ".en__hubgadget__response"
    );
    if (!responses.length) return;

    const makeRegion = (assertive: boolean) => {
      const region = document.createElement("div");
      region.setAttribute("role", assertive ? "alert" : "status");
      region.setAttribute("aria-atomic", "true");
      region.classList.add("engrid__sr-only");
      return body.appendChild(region);
    };
    const politeRegion = makeRegion(false);
    const assertiveRegion = makeRegion(true);

    // The live regions own announcements; hide the originals so each message is
    // read once rather than twice.
    responses.forEach((r) => r.setAttribute("aria-hidden", "true"));

    const isVisible = (el: HTMLElement) =>
      window.getComputedStyle(el).display !== "none";

    let lastAnnounced = "";
    const announce = () => {
      const visible = Array.from(responses).filter(isVisible);
      const target =
        visible.find(
          (r) => !r.classList.contains("en__hubgadget__response--loading")
        ) ?? visible[0];
      const message = target ? (target.textContent || "").trim() : "";
      if (message === lastAnnounced) return;
      lastAnnounced = message;
      if (message) this.logger.log(`Announcing login response: ${message}`);
      const isFailure = !!target?.classList.contains(
        "en__hubgadget__response--failure"
      );
      politeRegion.textContent = isFailure ? "" : message;
      assertiveRegion.textContent = isFailure ? message : "";
    };

    let debounce = 0;
    new MutationObserver(() => {
      window.clearTimeout(debounce);
      debounce = window.setTimeout(announce, 250);
    }).observe(body, {
      attributes: true,
      attributeFilter: ["style", "class"],
      subtree: true,
    });

    announce(); // catch a message already visible at construction time
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
      const hubOverlay = overlay.classList.contains("en__hubOverlay")
        ? overlay
        : (document.querySelector(".en__hubOverlay") as HTMLDivElement) ||
        overlay;
      A11y.inertPage(true, hubOverlay);
      const header = overlay.querySelector(
        ".en__hubOverlay__header"
      ) as HTMLDivElement,
        closeButton = header.querySelector("a") as HTMLAnchorElement;
      // Tag close button
      if (header && closeButton) {
        closeButton.setAttribute("role", "button");
        closeButton.setAttribute("aria-label", "Close");
        document.addEventListener(
          "keydown",
          (e: KeyboardEvent) => {
            if (e.key === "Escape") {
              this.logger.log("Escape key pressed, closing overlay");
              closeButton.click();
            }
          },
          { once: true }
        );
      }
      // Tag header and label dialog
      const headerTitle = header.querySelector("h2") as HTMLHeadingElement;
      const slug = ENGrid.slugify(
        headerTitle?.innerText || "supporter-hub-overlay"
      );
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
