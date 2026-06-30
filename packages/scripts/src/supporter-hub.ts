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
                this.creditCardUpdate(overlay);
                this.amountLabelUpdate(overlay);
                this.dialogAltsAndArias(overlay);
                this.accessibilityScan(overlay);
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
                const remainingOverlay = document.querySelector<HTMLElement>(
                  ".en__hubOverlay, .en__hubPledge__panels"
                );
                if (remainingOverlay) {
                  A11y.inertPage(true, remainingOverlay);
                }
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
    const hubOverlay = document.querySelector(".en__hubOverlay") as HTMLDivElement;
    if (hubOverlay) {
      this.creditCardUpdate(hubOverlay);
      this.amountLabelUpdate(hubOverlay);
      this.dialogAltsAndArias(hubOverlay);
      this.accessibilityScan(hubOverlay);
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
   * Wire the login body up to the shared response announcer.
   */
  private announceLoginResponses() {
    const body = document.querySelector<HTMLElement>(
      ".en__supporterHubLogin__body"
    );
    if (!body) return;
    const emailInput = body.querySelector<HTMLInputElement>(
      ".en__field--hublogin input"
    );
    const emailField = emailInput?.closest(".en__field--hublogin");

    // Login failures are about the email field: flag it invalid and point AT at
    // the alert describing why. This is login-specific, so it lives here rather
    // than in the shared announcer.
    this.announceHubResponses(body, {
      onResult: (isFailure, alertRegionId) => {
        if (emailInput) {
          if (isFailure) {
            emailInput.setAttribute("aria-invalid", "true");
            emailInput.setAttribute("aria-describedby", alertRegionId);
          } else {
            emailInput.removeAttribute("aria-invalid");
            emailInput.removeAttribute("aria-describedby");
          }
        }
        emailField?.classList.toggle("en__field--validationFailed", isFailure);
      },
    });
  }

  /**
   * Mirror `.en__hubgadget__response` messages within `container` into screen
   * reader live regions. Engaging Networks owns these responses, and assistive
   * tech doesn't reliably announce content that was already in the DOM and
   * merely flipped to visible — and in hub overlays the responses don't even
   * exist until a submit injects them.
   *
   * We append a polite (`role="status"`) and an assertive (`role="alert"`) live
   * region, hide the originals from AT, then on any childList / display / class
   * change we debounce and announce whichever response is currently visible,
   * preferring a terminal result over the transient "Loading" so an instant
   * failure isn't preceded by a stray "Loading". Failures (and, for overlays,
   * all messages) use the assertive region; everything else uses the polite one.
   *
   * This is a form-agnostic engine: callers supply their own side effects via
   * `onResult` rather than this method knowing about any specific form.
   *
   * @param container The element that holds (or will hold) the responses.
   * @param options   `preferAssertive` announces success assertively too —
   *                  overlays redraw their content (and shift focus) on success,
   *                  which makes screen readers drop polite announcements, so
   *                  assertive ones are used to survive that. `onResult` is fired
   *                  with each settled result (and the assertive region's id) so
   *                  callers can react — e.g. the login form flags its email
   *                  field invalid — without baking that into the engine.
   */
  private announceHubResponses(
    container: HTMLElement,
    options: {
      preferAssertive?: boolean;
      onResult?: (isFailure: boolean, alertRegionId: string) => void;
    } = {}
  ) {
    const { preferAssertive = false, onResult } = options;

    // Guard against wiring the same container up twice.
    if (container.dataset.engridResponseAnnounce === "true") return;
    container.dataset.engridResponseAnnounce = "true";

    // The overlay popup is an `aria-modal="true"` dialog, which tells assistive
    // tech to ignore everything outside it. Live regions appended to the outer
    // .en__hubOverlay (a sibling of the dialog) are therefore never announced.
    // Anchor the regions inside the dialog so they live within the modal scope.
    // Falls back to the container itself for the non-modal login form.
    const regionAnchor =
      container.querySelector<HTMLElement>(".en__hubOverlay__popup") ??
      container;

    const makeRegion = (assertive: boolean) => {
      const region = document.createElement("div");
      region.setAttribute("role", assertive ? "alert" : "status");
      region.setAttribute("aria-atomic", "true");
      region.classList.add("engrid__sr-only");
      return regionAnchor.appendChild(region);
    };
    const politeRegion = makeRegion(false);
    const assertiveRegion = makeRegion(true);
    assertiveRegion.id = `en__hubgadget__response--failure-alert-${Math.random()
      .toString(36)
      .slice(2, 7)}`;

    const isVisible = (el: HTMLElement) =>
      window.getComputedStyle(el).display !== "none";

    // The live regions own announcements; hide the originals so each message is
    // read once rather than twice. Responses can be injected after the fact
    // (overlays), so re-hide on every pass, but only write when needed to avoid
    // retriggering our own observer.
    const hideResponses = () => {
      container
        .querySelectorAll<HTMLDivElement>(".en__hubgadget__response")
        .forEach((r) => {
          if (r.getAttribute("aria-hidden") !== "true") {
            r.setAttribute("aria-hidden", "true");
          }
        });
    };

    // Clear then set on the next frame so the screen reader registers a fresh
    // change even when the same message is re-stated after a content redraw.
    const speak = (region: HTMLElement, text: string) => {
      region.textContent = "";
      window.requestAnimationFrame(() => {
        region.textContent = text;
      });
    };

    let lastAnnounced = "";
    // Set when a response node is added/removed (i.e. the overlay redrew its
    // content). A polite announcement made mid-redraw gets dropped, so we must
    // re-state the message once things settle even if the text is unchanged.
    let forceReannounce = false;
    const announce = () => {
      hideResponses();
      const responses = Array.from(
        container.querySelectorAll<HTMLDivElement>(".en__hubgadget__response")
      );
      const visible = responses.filter(isVisible);
      const target =
        visible.find(
          (r) => !r.classList.contains("en__hubgadget__response--loading")
        ) ?? visible[0];
      const message = target ? (target.textContent || "").trim() : "";
      const isFailure = !!target?.classList.contains(
        "en__hubgadget__response--failure"
      );

      const reannounce = forceReannounce;
      forceReannounce = false;
      if (message === lastAnnounced && !reannounce) return;
      lastAnnounced = message;

      if (!message) {
        politeRegion.textContent = "";
        assertiveRegion.textContent = "";
        onResult?.(false, assertiveRegion.id);
        return;
      }

      this.logger.log(`Announcing hub response: ${message}`);

      // Overlays must announce assertively (polite is dropped on their content
      // redraw); the login form keeps polite for non-failures.
      const useAssertive = isFailure || preferAssertive;
      if (useAssertive) {
        politeRegion.textContent = "";
        speak(assertiveRegion, message);
      } else {
        assertiveRegion.textContent = "";
        speak(politeRegion, message);
      }
      onResult?.(isFailure, assertiveRegion.id);
    };

    // Only react to mutations that actually involve a response. The container
    // (especially an overlay) is full of unrelated churn — form fields, the
    // loading spinner, the a11y error regions — and our own live-region writes
    // are children of it too. Reacting to all of that would perpetually reset
    // the debounce and drown out the real announcement.
    const isResponse = (node: Node): boolean =>
      node instanceof HTMLElement &&
      (node.classList.contains("en__hubgadget__response") ||
        !!node.querySelector(".en__hubgadget__response"));

    const isRelevant = (record: MutationRecord): boolean => {
      if (record.type === "childList") {
        return (
          Array.from(record.addedNodes).some(isResponse) ||
          Array.from(record.removedNodes).some(isResponse)
        );
      }
      // attribute (style/class) change directly on a response element
      return (
        record.target instanceof HTMLElement &&
        record.target.classList.contains("en__hubgadget__response")
      );
    };

    let debounce = 0;
    new MutationObserver((records) => {
      const relevant = records.filter(isRelevant);
      if (!relevant.length) return;
      // A response node being added/removed means the content was redrawn;
      // force a re-announcement so a message dropped mid-redraw is re-stated.
      if (relevant.some((r) => r.type === "childList")) {
        forceReannounce = true;
      }
      window.clearTimeout(debounce);
      debounce = window.setTimeout(announce, 250);
    }).observe(container, {
      attributes: true,
      attributeFilter: ["style", "class"],
      childList: true,
      subtree: true,
    });

    announce(); // catch any response already visible at setup
  }

  /**
   * Run the field-level accessibility scan and response announcer against a
   * freshly opened overlay. EN injects overlay markup (and its fields) when the
   * gadget is clicked, so A11y's constructor-time sweep never sees them. The
   * scan is idempotent and the announcer guards against double-wiring, so a
   * delayed pass — matching the timing of the other overlay handlers — is safe.
   */
  private accessibilityScan(overlay: HTMLDivElement) {
    window.setTimeout(() => {
      A11y.scanFields(overlay);
      this.announceHubResponses(overlay, { preferAssertive: true });
    }, 300);
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
