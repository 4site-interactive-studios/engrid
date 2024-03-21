import { EnForm, ENGrid, EngridLogger } from "./";
import {
  EmbeddedEcardOptions,
  EmbeddedEcardOptionsDefaults,
} from "./interfaces/embedded-ecard-options";

export class EmbeddedEcard {
  private logger: EngridLogger = new EngridLogger(
    "Embedded Ecard",
    "#D95D39",
    "#0E1428",
    "📧"
  );
  private readonly options: EmbeddedEcardOptions = EmbeddedEcardOptionsDefaults;
  private _form: EnForm = EnForm.getInstance();

  constructor() {
    // For the page hosting the embedded ecard
    if (this.isHostPage()) {
      this.logger.log("Running Embedded Ecard component", this.options);
      this.options = {
        ...EmbeddedEcardOptionsDefaults,
        ...window.EngridEmbeddedEcard,
      };
      this.embedEcard();
      this.addEventListeners();
    }

    // For the page that is embedded
    if (this.pageIsEmbeddedEcard()) {
      this.addPostMessageListener();
    }
  }

  private isHostPage(): boolean {
    return (
      window.hasOwnProperty("EngridEmbeddedEcard") &&
      typeof window.EngridEmbeddedEcard === "object" &&
      window.EngridEmbeddedEcard.hasOwnProperty("pageUrl") &&
      window.EngridEmbeddedEcard.pageUrl !== ""
    );
  }

  private pageIsEmbeddedEcard(): boolean {
    return ENGrid.getPageType() === "ECARD" && ENGrid.hasBodyData("embedded");
  }

  private embedEcard() {
    const container = document.createElement("div");
    container.classList.add("engrid--embedded-ecard");

    const heading = document.createElement("h3");
    heading.textContent = this.options.headerText;
    heading.classList.add("engrid--embedded-ecard-heading");
    container.appendChild(heading);

    const checkbox = document.createElement("div");
    checkbox.classList.add(
      "pseudo-en-field",
      "en__field",
      "en__field--checkbox",
      "en__field--000000",
      "en__field--embedded-ecard"
    );
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

    document
      .querySelector(this.options.anchor)
      ?.insertAdjacentElement(
        this.options.placement as InsertPosition,
        container
      );
  }

  private addEventListeners() {
    const iframe = document.querySelector(
      ".engrid-iframe--embedded-ecard"
    ) as HTMLIFrameElement;

    const sendEcardCheckbox = document.getElementById(
      "en__field_embedded-ecard"
    ) as HTMLInputElement;

    sendEcardCheckbox?.addEventListener("change", (e) => {
      const checkbox = e.target as HTMLInputElement;
      if (checkbox?.checked) {
        iframe?.setAttribute("style", "display: block");
      } else {
        iframe?.setAttribute("style", "display: none");
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
      if (!this._form.submit) return;
      if (!sendEcardCheckbox || !sendEcardCheckbox?.checked) return;

      const emailField = document.getElementById(
        "en__field_supporter_emailAddress"
      ) as HTMLInputElement;
      const firstNameField = document.getElementById(
        "en__field_supporter_firstName"
      ) as HTMLInputElement;
      const lastNameField = document.getElementById(
        "en__field_supporter_lastName"
      ) as HTMLInputElement;

      iframe?.contentWindow?.postMessage(
        {
          messageType: "submit_embedded_ecard",
          email: emailField?.value,
          firstName: firstNameField?.value,
          lastName: lastNameField?.value,
        },
        location.origin
      );

      //test dont submit
      this._form.submit = false;
    });
  }

  private addPostMessageListener() {
    window.addEventListener("message", (e) => {
      if (e.origin !== location.origin) return;

      console.log(e.data);

      if (e.data.messageType === "submit_embedded_ecard") {
        document
          .getElementById("en__field_supporter_emailAddress")
          ?.setAttribute("value", e.data.email);
        document
          .getElementById("en__field_supporter_firstName")
          ?.setAttribute("value", e.data.firstName);
        document
          .getElementById("en__field_supporter_lastName")
          ?.setAttribute("value", e.data.lastName);
        this._form.submitForm();
      }
    });
  }
}
