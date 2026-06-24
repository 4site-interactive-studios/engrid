// Component that adds 4Site Special Features to the Supporter Hub Page
import { ENGrid, EngridLogger, EnForm, A11y } from ".";
export class SupporterHub {
    constructor() {
        this.logger = new EngridLogger("SupporterHub", "black", "pink", "🛖");
        this._form = EnForm.getInstance();
        this.closeListener = null;
        if (!this.shoudRun())
            return;
        this.logger.log("Enabled");
        this.watch();
        this.preventDuplicateSubmits();
        this.pageAltsAndArias();
    }
    shoudRun() {
        return ("pageJson" in window &&
            "pageType" in window.pageJson &&
            window.pageJson.pageType === "supporterhub");
    }
    watch() {
        const form = ENGrid.enForm;
        // Create a observer to watch the Form for overlays
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === "childList") {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeName === "DIV") {
                            const overlay = node;
                            if (overlay.classList.contains("en__hubOverlay") ||
                                overlay.classList.contains("en__hubPledge__panels")) {
                                this.logger.log("Overlay found");
                                this.creditCardUpdate(node);
                                this.amountLabelUpdate(node);
                                this.dialogAltsAndArias(node);
                            }
                        }
                    });
                    mutation.removedNodes.forEach((node) => {
                        if (node.nodeName === "DIV") {
                            const overlay = node;
                            if (overlay.classList.contains("en__hubOverlay") ||
                                overlay.classList.contains("en__hubPledge__panels")) {
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
            this.creditCardUpdate(hubOverlay);
            this.amountLabelUpdate(hubOverlay);
            this.dialogAltsAndArias(hubOverlay);
        }
    }
    pageAltsAndArias() {
        // Find every en__component--hubgadget and set role as button and aria-label as the span content of the component
        document.querySelectorAll(".en__component--hubgadget").forEach((node) => {
            const button = node;
            const labelSpan = button.querySelector("span");
            if (!labelSpan)
                return;
            const img = button.querySelector("img");
            img === null || img === void 0 ? void 0 : img.setAttribute("aria-hidden", "true");
            const slug = ENGrid.slugify(labelSpan.innerText);
            const labelId = `hubgadget-label-${slug}`;
            labelSpan.setAttribute("id", labelId);
            button.setAttribute("aria-labelledby", labelId);
            button.setAttribute("role", "button");
            button.setAttribute("aria-controls", `huboverlay-${slug}`);
            button.setAttribute("aria-haspopup", "dialog");
            if (!button.classList.contains("en__component--hubgadget--inactive")) {
                button.setAttribute("tabindex", "0");
                button.addEventListener("keydown", (e) => {
                    if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        button.click();
                    }
                });
            }
        });
    }
    creditCardUpdate(overlay) {
        window.setTimeout(() => {
            // Check if the overlay has Credit Card field and Update Button
            const ccField = overlay.querySelector("#en__hubPledge__field--ccnumber"), updateButton = overlay.querySelector(".en__hubUpdateCC__toggle");
            if (ccField && updateButton) {
                // When field gets focus, click the update button
                ccField.addEventListener("focus", () => {
                    this.logger.log("Credit Card field focused");
                    updateButton.click();
                });
            }
        }, 300);
    }
    amountLabelUpdate(overlay) {
        window.setTimeout(() => {
            // Check if the overlay has Amounts, and set the currency symbol updated attribute
            const amountContainer = overlay.querySelector(".en__field--donationAmt");
            if (amountContainer) {
                amountContainer
                    .querySelectorAll(".en__field__element--radio .en__field__item")
                    .forEach((node) => {
                    node.setAttribute("data-engrid-currency-symbol-updated", "true");
                });
            }
        }, 300);
    }
    dialogAltsAndArias(overlay) {
        window.setTimeout(() => {
            const hubOverlay = overlay.classList.contains("en__hubOverlay")
                ? overlay
                : document.querySelector(".en__hubOverlay") ||
                    overlay;
            A11y.inertPage(true, hubOverlay);
            const header = overlay.querySelector(".en__hubOverlay__header"), closeButton = header.querySelector("a");
            // Tag close button
            if (header && closeButton) {
                closeButton.setAttribute("role", "button");
                closeButton.setAttribute("aria-label", "Close");
                document.addEventListener("keydown", (e) => {
                    if (e.key === "Escape") {
                        this.logger.log("Escape key pressed, closing overlay");
                        closeButton.click();
                    }
                }, { once: true });
            }
            // Tag header and label dialog
            const headerTitle = header.querySelector("h2");
            const slug = ENGrid.slugify((headerTitle === null || headerTitle === void 0 ? void 0 : headerTitle.innerText) || "supporter-hub-overlay");
            let headerTitleId = `huboverlay-title-${slug}`;
            if (headerTitle) {
                headerTitleId = headerTitle.id || headerTitleId;
                headerTitle.setAttribute("id", headerTitleId);
            }
            const popup = overlay.querySelector(".en__hubOverlay__popup");
            if (popup) {
                popup.setAttribute("id", `huboverlay-${slug}`);
                popup.setAttribute("role", "dialog");
                popup.setAttribute("aria-modal", "true");
                if (headerTitle) {
                    popup.setAttribute("aria-labelledby", headerTitleId);
                }
                else {
                    popup.setAttribute("aria-label", "Supporter Hub Overlay");
                }
            }
        }, 300);
    }
    // The supporter hub does not properly handle or prevent duplicate submits, so we add a listener to prevent this.
    preventDuplicateSubmits() {
        document.addEventListener("click", (e) => {
            const btn = e.target.closest(".en__submit button");
            if (!btn)
                return;
            if (btn.dataset.busy) {
                e.stopImmediatePropagation();
                e.preventDefault();
                return;
            }
            btn.dataset.busy = "true";
            setTimeout(() => delete btn.dataset.busy, 10000);
        }, true);
    }
}
