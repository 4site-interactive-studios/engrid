/**
 * This class handles adding a checkbox to a form that, when checked, will display an embedded ecard form.
 * The embedded ecard form is hosted on a separate page and is displayed in an iframe.
 * The form data is saved in session storage and is submitted when the thank you page is loaded.
 * Options can set on the page via window.EngridEmbeddedEcard.
 */
import { EnForm, ENGrid, EngridLogger } from "./";
import { EmbeddedEcardOptionsDefaults, } from "./interfaces/embedded-ecard-options";
export class EmbeddedEcard {
    constructor() {
        this.logger = new EngridLogger("Embedded Ecard", "#D95D39", "#0E1428", "📧");
        this.options = EmbeddedEcardOptionsDefaults;
        this._form = EnForm.getInstance();
        this.isSubmitting = false;
        // For the page hosting the embedded ecard
        if (this.onHostPage()) {
            // Clean up session variables if the page is reloaded, and it isn't a submission failure
            const submissionFailed = !!(ENGrid.checkNested(window.EngagingNetworks, "require", "_defined", "enjs", "checkSubmissionFailed") &&
                window.EngagingNetworks.require._defined.enjs.checkSubmissionFailed());
            if (!submissionFailed) {
                sessionStorage.removeItem("engrid-embedded-ecard");
                sessionStorage.removeItem("engrid-send-embedded-ecard");
            }
            this.options = Object.assign(Object.assign({}, EmbeddedEcardOptionsDefaults), window.EngridEmbeddedEcard);
            const pageUrl = new URL(this.options.pageUrl);
            pageUrl.searchParams.append("data-engrid-embedded-ecard", "true");
            this.options.pageUrl = pageUrl.href;
            this.logger.log("Running Embedded Ecard component", this.options);
            this.embedEcard();
            this.addEventListeners();
        }
        // For the thank you page - after the host page form has been submitted
        // Only runs if eCard was selected on the main page
        if (this.onPostActionPage()) {
            ENGrid.setBodyData("embedded-ecard-sent", "true");
            this.submitEcard();
        }
        // For the page that is embedded
        if (this.onEmbeddedEcardPage()) {
            this.setupEmbeddedPage();
        }
    }
    onHostPage() {
        return (window.hasOwnProperty("EngridEmbeddedEcard") &&
            typeof window.EngridEmbeddedEcard === "object" &&
            window.EngridEmbeddedEcard.hasOwnProperty("pageUrl") &&
            window.EngridEmbeddedEcard.pageUrl !== "");
    }
    onEmbeddedEcardPage() {
        return ENGrid.getPageType() === "ECARD" && ENGrid.hasBodyData("embedded");
    }
    onPostActionPage() {
        return (sessionStorage.getItem("engrid-embedded-ecard") !== null &&
            sessionStorage.getItem("engrid-send-embedded-ecard") !== null &&
            !this.onHostPage() &&
            !this.onEmbeddedEcardPage());
    }
    embedEcard() {
        var _a;
        const container = document.createElement("div");
        container.classList.add("engrid--embedded-ecard");
        const heading = document.createElement("h3");
        heading.textContent = this.options.headerText;
        heading.classList.add("engrid--embedded-ecard-heading");
        container.appendChild(heading);
        const checkbox = document.createElement("div");
        checkbox.classList.add("pseudo-en-field", "en__field", "en__field--checkbox", "en__field--000000", "en__field--embedded-ecard");
        checkbox.innerHTML = `
      <div class="en__field__element en__field__element--checkbox">
        <div class="en__field__item">
          <input class="en__field__input en__field__input--checkbox" id="en__field_embedded-ecard" name="engrid.embedded-ecard" type="checkbox" value="Y">
          <label class="en__field__label en__field__label--item" for="en__field_embedded-ecard">${this.options.checkboxText}</label>
        </div>
      </div>`;
        container.appendChild(checkbox);
        container.appendChild(this.createIframe(this.options.pageUrl));
        (_a = document
            .querySelector(this.options.anchor)) === null || _a === void 0 ? void 0 : _a.insertAdjacentElement(this.options.placement, container);
    }
    createIframe(url) {
        const iframe = document.createElement("iframe");
        iframe.src = url;
        iframe.setAttribute("src", url);
        iframe.setAttribute("width", "100%");
        iframe.setAttribute("scrolling", "no");
        iframe.setAttribute("frameborder", "0");
        iframe.classList.add("engrid-iframe", "engrid-iframe--embedded-ecard");
        iframe.style.display = "none";
        return iframe;
    }
    addEventListeners() {
        const iframe = document.querySelector(".engrid-iframe--embedded-ecard");
        const sendEcardCheckbox = document.getElementById("en__field_embedded-ecard");
        // Initialize based on checkbox's default state
        if (sendEcardCheckbox === null || sendEcardCheckbox === void 0 ? void 0 : sendEcardCheckbox.checked) {
            iframe === null || iframe === void 0 ? void 0 : iframe.setAttribute("style", "display: block");
            sessionStorage.setItem("engrid-send-embedded-ecard", "true");
        }
        else {
            iframe === null || iframe === void 0 ? void 0 : iframe.setAttribute("style", "display: none");
            sessionStorage.removeItem("engrid-send-embedded-ecard");
        }
        sendEcardCheckbox === null || sendEcardCheckbox === void 0 ? void 0 : sendEcardCheckbox.addEventListener("change", (e) => {
            const checkbox = e.target;
            if (checkbox === null || checkbox === void 0 ? void 0 : checkbox.checked) {
                iframe === null || iframe === void 0 ? void 0 : iframe.setAttribute("style", "display: block");
                sessionStorage.setItem("engrid-send-embedded-ecard", "true");
            }
            else {
                iframe === null || iframe === void 0 ? void 0 : iframe.setAttribute("style", "display: none");
                sessionStorage.removeItem("engrid-send-embedded-ecard");
            }
        });
    }
    setEmbeddedEcardSessionData() {
        let ecardVariant = document.querySelector("[name='friend.ecard']");
        let ecardSendDate = document.querySelector("[name='ecard.schedule']");
        let ecardMessage = document.querySelector("[name='transaction.comments']");
        //add "chain" param to window.location.href if it doesnt have it
        const pageUrl = new URL(window.location.href);
        if (!pageUrl.searchParams.has("chain")) {
            pageUrl.searchParams.append("chain", "");
        }
        const embeddedEcardData = {
            pageUrl: pageUrl.href,
            formData: {
                ecardVariant: (ecardVariant === null || ecardVariant === void 0 ? void 0 : ecardVariant.value) || "",
                ecardSendDate: (ecardSendDate === null || ecardSendDate === void 0 ? void 0 : ecardSendDate.value) || "",
                ecardMessage: (ecardMessage === null || ecardMessage === void 0 ? void 0 : ecardMessage.value) || "",
                recipients: this.getEcardRecipients(),
            },
        };
        sessionStorage.setItem("engrid-embedded-ecard", JSON.stringify(embeddedEcardData));
    }
    getEcardRecipients() {
        const recipients = [];
        const addRecipientButton = document.querySelector(".en__ecarditems__addrecipient");
        //Single recipient form where the "add recipient" button is hidden, and we use the recipient name and email fields
        const isSingleRecipientForm = !addRecipientButton || addRecipientButton.offsetHeight === 0;
        if (isSingleRecipientForm) {
            // When it is a single recipient form, we only need to get the recipient name and email from the input fields
            let recipientName = document.querySelector(".en__ecardrecipients__name > input");
            let recipientEmail = document.querySelector(".en__ecardrecipients__email > input");
            if (recipientName && recipientEmail) {
                recipients.push({
                    name: recipientName.value,
                    email: recipientEmail.value,
                });
            }
            return recipients;
        }
        // For multiple recipient forms, we need to get the recipient name and email from each recipient in the recipient list
        const recipientList = document.querySelector(".en__ecardrecipients__list");
        recipientList === null || recipientList === void 0 ? void 0 : recipientList.querySelectorAll(".en__ecardrecipients__recipient").forEach((el) => {
            const recipientName = el.querySelector(".ecardrecipient__name");
            const recipientEmail = el.querySelector(".ecardrecipient__email");
            if (recipientName && recipientEmail) {
                recipients.push({
                    name: recipientName.value,
                    email: recipientEmail.value,
                });
            }
        });
        return recipients;
    }
    setupEmbeddedPage() {
        let ecardVariant = document.querySelector("[name='friend.ecard']");
        let ecardSendDate = document.querySelector("[name='ecard.schedule']");
        let ecardMessage = document.querySelector("[name='transaction.comments']");
        let recipientName = document.querySelector(".en__ecardrecipients__name > input");
        let recipientEmail = document.querySelector(".en__ecardrecipients__email > input");
        [
            ecardVariant,
            ecardSendDate,
            ecardMessage,
            recipientName,
            recipientEmail,
        ].forEach((el) => {
            el.addEventListener("input", () => {
                if (this.isSubmitting)
                    return;
                this.setEmbeddedEcardSessionData();
            });
        });
        // MutationObserver to detect changes in the recipient list and update the session data
        const observer = new MutationObserver((mutationsList) => {
            for (let mutation of mutationsList) {
                if (mutation.type === "childList") {
                    if (this.isSubmitting)
                        return;
                    this.setEmbeddedEcardSessionData();
                }
            }
        });
        const recipientList = document.querySelector(".en__ecardrecipients__list");
        if (recipientList) {
            observer.observe(recipientList, { childList: true });
        }
        document.querySelectorAll(".en__ecarditems__thumb").forEach((el) => {
            // Making sure the session value is changed when this is clicked
            el.addEventListener("click", () => {
                ecardVariant.dispatchEvent(new Event("input"));
            });
        });
        window.addEventListener("message", (e) => {
            if (e.origin !== location.origin || !e.data.action)
                return;
            this.logger.log("Received post message", e.data);
            switch (e.data.action) {
                case "submit_form":
                    this.isSubmitting = true;
                    let embeddedEcardData = JSON.parse(sessionStorage.getItem("engrid-embedded-ecard") || "{}");
                    if (ecardVariant) {
                        ecardVariant.value = embeddedEcardData.formData["ecardVariant"];
                    }
                    if (ecardSendDate) {
                        ecardSendDate.value = embeddedEcardData.formData["ecardSendDate"];
                    }
                    if (ecardMessage) {
                        ecardMessage.value = embeddedEcardData.formData["ecardMessage"];
                    }
                    const addRecipientButton = document.querySelector(".en__ecarditems__addrecipient");
                    embeddedEcardData.formData.recipients.forEach((recipient) => {
                        recipientName.value = recipient.name;
                        recipientEmail.value = recipient.email;
                        addRecipientButton === null || addRecipientButton === void 0 ? void 0 : addRecipientButton.click();
                    });
                    const form = EnForm.getInstance();
                    form.submitForm();
                    sessionStorage.removeItem("engrid-embedded-ecard");
                    sessionStorage.removeItem("engrid-send-embedded-ecard");
                    break;
                case "set_recipient":
                    recipientName.value = e.data.name;
                    recipientEmail.value = e.data.email;
                    recipientName.dispatchEvent(new Event("input"));
                    recipientEmail.dispatchEvent(new Event("input"));
                    break;
            }
        });
        this.sendPostMessage("parent", "ecard_form_ready");
    }
    submitEcard() {
        var _a;
        const embeddedEcardData = JSON.parse(sessionStorage.getItem("engrid-embedded-ecard") || "{}");
        this.logger.log("Submitting ecard", embeddedEcardData);
        const iframe = this.createIframe(embeddedEcardData.pageUrl);
        (_a = document.querySelector(".body-main")) === null || _a === void 0 ? void 0 : _a.appendChild(iframe);
        window.addEventListener("message", (e) => {
            if (e.origin !== location.origin || !e.data.action)
                return;
            if (e.data.action === "ecard_form_ready") {
                this.sendPostMessage(iframe, "submit_form");
            }
        });
    }
    sendPostMessage(target, action, data = {}) {
        var _a;
        const message = Object.assign({ action }, data);
        if (target === "parent") {
            window.parent.postMessage(message, location.origin);
        }
        else {
            (_a = target.contentWindow) === null || _a === void 0 ? void 0 : _a.postMessage(message, location.origin);
        }
    }
}
