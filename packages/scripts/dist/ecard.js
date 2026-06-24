import { ENGrid, EnForm, EngridLogger, A11y } from ".";
export class Ecard {
    constructor() {
        this._form = EnForm.getInstance();
        this.logger = new EngridLogger("Ecard", "red", "#f5f5f5", "🪪");
        if (!this.shouldRun())
            return;
        this.altsAndArias();
        this._form.onValidate.subscribe(() => this.checkRecipientFields());
        const schedule = ENGrid.getUrlParameter("engrid_ecard.schedule");
        const scheduleField = ENGrid.getField("ecard.schedule");
        const name = ENGrid.getUrlParameter("engrid_ecard.name");
        const nameField = document.querySelector(".en__ecardrecipients__name input");
        const email = ENGrid.getUrlParameter("engrid_ecard.email");
        const emailField = document.querySelector(".en__ecardrecipients__email input");
        if (schedule && scheduleField) {
            // Check if chedule date is in the past
            const scheduleDate = new Date(schedule.toString());
            const today = new Date();
            if (scheduleDate.setHours(0, 0, 0, 0) < today.setHours(0, 0, 0, 0)) {
                // If it is, set the schedule to today
                scheduleField.value = ENGrid.formatDate(today, "YYYY-MM-DD");
            }
            else {
                // Otherwise, set the schedule to the date provided
                scheduleField.value = schedule.toString();
            }
            this.logger.log("Schedule set to " + scheduleField.value);
        }
        if (name && nameField) {
            nameField.value = name.toString();
            this.logger.log("Name set to " + nameField.value);
        }
        if (email && emailField) {
            emailField.value = email.toString();
            this.logger.log("Email set to " + emailField.value);
        }
        // Replace the Future Delivery Label with a H2
        const futureDeliveryLabel = document.querySelector(".en__ecardrecipients__futureDelivery label");
        if (futureDeliveryLabel) {
            const futureDeliveryH2 = document.createElement("h2");
            futureDeliveryH2.innerText = futureDeliveryLabel.innerText;
            futureDeliveryLabel.replaceWith(futureDeliveryH2);
        }
        if (emailField) {
            emailField.setAttribute("type", "email");
            emailField.setAttribute("autocomplete", "off");
        }
    }
    shouldRun() {
        return ENGrid.getPageType() === "ECARD";
    }
    checkRecipientFields() {
        const addRecipientButton = document.querySelector(".en__ecarditems__addrecipient");
        // If we find the "+" button and there's no hidden recipient field, click on the button
        if (addRecipientButton &&
            !document.querySelector(".ecardrecipient__email")) {
            addRecipientButton.click();
        }
        return true;
    }
    altsAndArias() {
        document.querySelectorAll(".en__ecarditems__list").forEach((list) => {
            this.altsAndAriasEcardItemsList(list);
        });
        const ecardMessage = document.querySelector(".en__ecardmessage");
        if (ecardMessage) {
            this.coupleH2AndInput(ecardMessage, "Add a Message to your eCard");
        }
        const ecardRecipients = document.querySelector(".en__ecardrecipients");
        if (ecardRecipients) {
            const recipientName = ecardRecipients.querySelector(".en__ecardrecipients__name");
            if (recipientName) {
                this.coupleLabelAndInput(recipientName, "Recipient Name");
            }
            const recipientEmail = ecardRecipients.querySelector(".en__ecardrecipients__email");
            if (recipientEmail) {
                this.coupleLabelAndInput(recipientEmail, "Recipient Email");
            }
        }
        const ecardFutureDelivery = document.querySelector(".en__ecardrecipients__futureDelivery");
        if (ecardFutureDelivery) {
            this.coupleH2AndInput(ecardFutureDelivery, "Schedule your eCard for future delivery");
        }
        const previewButton = document.querySelector(".en__ecarditems__showprev");
        if (previewButton) {
            previewButton.setAttribute("aria-controls", "ecard-preview");
            previewButton.setAttribute("aria-haspopup", "dialog");
        }
        const previewModal = document.querySelector(".en__ecarditems__preview");
        if (previewModal) {
            previewModal.setAttribute("role", "dialog");
            previewModal.setAttribute("aria-modal", "true");
            previewModal.setAttribute("aria-label", "Ecard Preview Modal");
            previewModal.setAttribute("id", "ecard-preview");
            const closeButton = previewModal.querySelector(".en__ecarditems__prevclose");
            if (closeButton) {
                closeButton.setAttribute("role", "button");
                closeButton.setAttribute("aria-label", "Close Preview");
                document.addEventListener("keydown", (e) => {
                    if (e.key === "Escape" &&
                        previewModal.classList.contains("preview--show")) {
                        closeButton.click();
                    }
                });
            }
            const iframe = previewModal.querySelector("iframe");
            if (iframe) {
                iframe.setAttribute("title", "Ecard Preview Frame");
            }
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.type === "attributes" &&
                        mutation.attributeName === "class") {
                        const target = mutation.target;
                        if (target.classList.contains("preview--show")) {
                            A11y.inertPage(true, previewModal);
                            // Focus the iframe or the first focusable element in the modal
                            const focusableElements = previewModal.querySelectorAll('iframe, a[href], area[href], button:not([disabled]), object, embed, [tabindex="0"]');
                            if (focusableElements.length) {
                                focusableElements[0].focus();
                            }
                        }
                        else {
                            A11y.inertPage(false);
                            // Return focus to the preview button
                            if (previewButton) {
                                previewButton.focus();
                            }
                        }
                    }
                });
            });
            observer.observe(previewModal, {
                attributes: true,
                attributeFilter: ["class"],
            });
        }
    }
    altsAndAriasEcardItemsList(list) {
        // if there's a sibling h2, use its text as the aria-label for the list
        const h2 = list.previousElementSibling;
        if (h2 && h2.tagName === "H2") {
            const id = `ecard-list-${Math.random().toString(36).substring(2, 9)}`;
            h2.setAttribute("id", id);
            list.setAttribute("aria-labelledby", id);
        }
        list.setAttribute("role", "radiogroup");
        const thumbs = Array.from(list.querySelectorAll(".en__ecarditems__thumb"));
        let isSelection = false;
        thumbs.forEach((thumb, index) => {
            thumb.setAttribute("role", "radio");
            if (thumb.classList.contains("thumb--active")) {
                thumb.setAttribute("aria-checked", "true");
                thumb.setAttribute("tabindex", "0");
                isSelection = true;
            }
            else {
                thumb.setAttribute("aria-checked", "false");
                thumb.setAttribute("tabindex", "-1");
            }
            const img = thumb.querySelector("img");
            if (img) {
                thumb.setAttribute("aria-label", img.alt || "Ecard Thumbnail");
                img.setAttribute("aria-hidden", "true");
            }
            // Keyboard navigation (WAI-ARIA radio group pattern)
            thumb.addEventListener("keydown", (e) => {
                let nextIndex = null;
                switch (e.key) {
                    case "ArrowRight":
                    case "ArrowDown":
                        nextIndex = (index + 1) % thumbs.length;
                        break;
                    case "ArrowLeft":
                    case "ArrowUp":
                        nextIndex = (index - 1 + thumbs.length) % thumbs.length;
                        break;
                    case "Home":
                        nextIndex = 0;
                        break;
                    case "End":
                        nextIndex = thumbs.length - 1;
                        break;
                    case "Enter":
                    case " ":
                        e.preventDefault();
                        thumb.click();
                        return;
                    default:
                        return;
                }
                e.preventDefault();
                // In a radio group, moving focus also selects the option.
                // click() lets EN's own handler set the value + thumb--active class;
                // the MutationObserver below then syncs aria-checked + tabindex.
                thumbs[nextIndex].focus();
                thumbs[nextIndex].click();
            });
        });
        if (!isSelection && thumbs.length) {
            thumbs[0].setAttribute("tabindex", "0");
        }
        // MutationObserver to watch for "thumb--active" class changes and keep
        // aria-checked + roving tabindex in sync with the selected thumb
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === "attributes" &&
                    mutation.attributeName === "class") {
                    const target = mutation.target;
                    if (target.classList.contains("thumb--active")) {
                        target.setAttribute("aria-checked", "true");
                        // Roving tabindex: only the active thumb is tabbable
                        target.setAttribute("tabindex", "0");
                        thumbs.forEach((t) => {
                            if (t !== target)
                                t.setAttribute("tabindex", "-1");
                        });
                    }
                    else {
                        target.setAttribute("aria-checked", "false");
                    }
                }
            });
        });
        observer.observe(list, {
            attributes: true,
            subtree: true,
            attributeFilter: ["class"],
        });
    }
    coupleLabelAndInput(parent, labelText) {
        const label = parent.querySelector("label");
        const input = parent.querySelector("input, textarea, select");
        if (label && input) {
            const id = `ecard-input-${Math.random().toString(36).substring(2, 9)}`;
            label.setAttribute("id", id);
            input.setAttribute("aria-labelledby", id);
        }
        else if (input) {
            input.setAttribute("aria-label", labelText);
        }
    }
    coupleH2AndInput(parent, labelText) {
        const h2 = parent.querySelector("h2");
        const input = parent.querySelector("textarea, input, select");
        if (h2 && input) {
            const id = `ecard-message-${Math.random().toString(36).substring(2, 9)}`;
            h2.setAttribute("id", id);
            input.setAttribute("aria-labelledby", id);
        }
        else if (input) {
            input.setAttribute("aria-label", labelText);
        }
    }
}
