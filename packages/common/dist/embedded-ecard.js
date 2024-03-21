import { EnForm, ENGrid, EngridLogger } from "./";
import { EmbeddedEcardOptionsDefaults, } from "./interfaces/embedded-ecard-options";
export class EmbeddedEcard {
    constructor() {
        this.logger = new EngridLogger("Embedded Ecard", "#D95D39", "#0E1428", "📧");
        this.options = EmbeddedEcardOptionsDefaults;
        this._form = EnForm.getInstance();
        // For the page hosting the embedded ecard
        if (this.isHostPage()) {
            this.logger.log("Running Embedded Ecard component", this.options);
            this.options = Object.assign(Object.assign({}, EmbeddedEcardOptionsDefaults), window.EngridEmbeddedEcard);
            this.embedEcard();
            this.addEventListeners();
        }
        // For the page that is embedded
        if (this.pageIsEmbeddedEcard()) {
            this.addPostMessageListener();
        }
    }
    isHostPage() {
        return (window.hasOwnProperty("EngridEmbeddedEcard") &&
            typeof window.EngridEmbeddedEcard === "object" &&
            window.EngridEmbeddedEcard.hasOwnProperty("pageUrl") &&
            window.EngridEmbeddedEcard.pageUrl !== "");
    }
    pageIsEmbeddedEcard() {
        return ENGrid.getPageType() === "ECARD" && ENGrid.hasBodyData("embedded");
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
        const iframe = document.createElement("iframe");
        iframe.src = this.options.pageUrl;
        iframe.setAttribute("src", this.options.pageUrl);
        iframe.setAttribute("width", "100%");
        iframe.setAttribute("scrolling", "no");
        iframe.setAttribute("frameborder", "0");
        iframe.classList.add("engrid-iframe", "engrid-iframe--embedded-ecard");
        iframe.style.display = "none";
        container.appendChild(iframe);
        (_a = document
            .querySelector(this.options.anchor)) === null || _a === void 0 ? void 0 : _a.insertAdjacentElement(this.options.placement, container);
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
        /*
        TODO: fix - this is not working. Potential issue with order of operations causing either form to fail to submit or the ecard to not be sent.
    
        This is a potential solution:
        - Save ecard data to sessionStorage
        - Submit form
        - On thank you page, add ecard iframe, and send ecard data to iframe, submit iframe.
         */
        this._form.onSubmit.subscribe(() => {
            var _a;
            if (!this._form.submit)
                return;
            if (!sendEcardCheckbox || !(sendEcardCheckbox === null || sendEcardCheckbox === void 0 ? void 0 : sendEcardCheckbox.checked))
                return;
            const emailField = document.getElementById("en__field_supporter_emailAddress");
            const firstNameField = document.getElementById("en__field_supporter_firstName");
            const lastNameField = document.getElementById("en__field_supporter_lastName");
            (_a = iframe === null || iframe === void 0 ? void 0 : iframe.contentWindow) === null || _a === void 0 ? void 0 : _a.postMessage({
                messageType: "submit_embedded_ecard",
                email: emailField === null || emailField === void 0 ? void 0 : emailField.value,
                firstName: firstNameField === null || firstNameField === void 0 ? void 0 : firstNameField.value,
                lastName: lastNameField === null || lastNameField === void 0 ? void 0 : lastNameField.value,
            }, location.origin);
            //test dont submit
            this._form.submit = false;
        });
    }
    addPostMessageListener() {
        window.addEventListener("message", (e) => {
            var _a, _b, _c;
            if (e.origin !== location.origin)
                return;
            console.log(e.data);
            if (e.data.messageType === "submit_embedded_ecard") {
                (_a = document
                    .getElementById("en__field_supporter_emailAddress")) === null || _a === void 0 ? void 0 : _a.setAttribute("value", e.data.email);
                (_b = document
                    .getElementById("en__field_supporter_firstName")) === null || _b === void 0 ? void 0 : _b.setAttribute("value", e.data.firstName);
                (_c = document
                    .getElementById("en__field_supporter_lastName")) === null || _c === void 0 ? void 0 : _c.setAttribute("value", e.data.lastName);
                this._form.submitForm();
            }
        });
    }
}
