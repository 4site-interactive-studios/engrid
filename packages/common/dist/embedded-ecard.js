import { EnForm, ENGrid, EngridLogger } from "./";
import { EmbeddedEcardOptionsDefaults, } from "./interfaces/embedded-ecard-options";
export class EmbeddedEcard {
    constructor() {
        this.logger = new EngridLogger("Embedded Ecard", "#D95D39", "#0E1428", "📧");
        this.options = EmbeddedEcardOptionsDefaults;
        this._form = EnForm.getInstance();
        // For the page hosting the embedded ecard
        if (this.onHostPage()) {
            this.options = Object.assign(Object.assign({}, EmbeddedEcardOptionsDefaults), window.EngridEmbeddedEcard);
            this.logger.log("Running Embedded Ecard component", this.options);
            this.embedEcard();
            this.addEventListeners();
        }
        // For the thank you page - after the host page form has been submitted
        if (this.onPostActionPage()) {
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
            !this.onHostPage());
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
        sendEcardCheckbox === null || sendEcardCheckbox === void 0 ? void 0 : sendEcardCheckbox.addEventListener("change", (e) => {
            const checkbox = e.target;
            if (checkbox === null || checkbox === void 0 ? void 0 : checkbox.checked) {
                iframe === null || iframe === void 0 ? void 0 : iframe.setAttribute("style", "display: block");
            }
            else {
                iframe === null || iframe === void 0 ? void 0 : iframe.setAttribute("style", "display: none");
            }
        });
        this._form.onSubmit.subscribe(() => {
            if (!this._form.submit ||
                !sendEcardCheckbox ||
                !(sendEcardCheckbox === null || sendEcardCheckbox === void 0 ? void 0 : sendEcardCheckbox.checked)) {
                return;
            }
            this.sendPostMessage(iframe, "save_form_data");
        });
    }
    setupEmbeddedPage() {
        window.addEventListener("message", (e) => {
            if (e.origin !== location.origin || !e.data.action)
                return;
            this.logger.log("Received post message", e.data);
            let ecardVariant = document.querySelector("[name='friend.ecard']");
            let ecardSendDate = document.querySelector("[name='ecard.schedule']");
            let ecardMessage = document.querySelector("[name='transaction.comments']");
            let recipientName = document.querySelector(".en__ecardrecipients__name > input");
            let recipientEmail = document.querySelector(".en__ecardrecipients__email > input");
            switch (e.data.action) {
                case "save_form_data":
                    //add "chain" param to window.location.href if it doesnt have it
                    const pageUrl = new URL(window.location.href);
                    if (!pageUrl.searchParams.has("chain")) {
                        pageUrl.searchParams.append("chain", "");
                    }
                    sessionStorage.setItem("engrid-embedded-ecard", JSON.stringify({
                        pageUrl: pageUrl.href,
                        formData: {
                            ecardVariant: (ecardVariant === null || ecardVariant === void 0 ? void 0 : ecardVariant.value) || "",
                            ecardSendDate: (ecardSendDate === null || ecardSendDate === void 0 ? void 0 : ecardSendDate.value) || "",
                            ecardMessage: (ecardMessage === null || ecardMessage === void 0 ? void 0 : ecardMessage.value) || "",
                            recipientName: (recipientName === null || recipientName === void 0 ? void 0 : recipientName.value) || "",
                            recipientEmail: (recipientEmail === null || recipientEmail === void 0 ? void 0 : recipientEmail.value) || "",
                        },
                    }));
                    break;
                case "submit_form":
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
                    recipientName.value = embeddedEcardData.formData["recipientName"];
                    recipientEmail.value = embeddedEcardData.formData["recipientEmail"];
                    const addRecipientButton = document.querySelector(".en__ecarditems__addrecipient");
                    addRecipientButton === null || addRecipientButton === void 0 ? void 0 : addRecipientButton.click();
                    const form = EnForm.getInstance();
                    form.submitForm();
                    sessionStorage.removeItem("engrid-embedded-ecard");
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
