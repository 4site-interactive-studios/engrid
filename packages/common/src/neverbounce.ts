import { ENGrid, EngridLogger } from "./";
import { EnForm } from "./events";

export class NeverBounce {
  public form: EnForm = EnForm.getInstance();
  public emailField: HTMLInputElement | null = null;
  public emailWrapper = document.querySelector(
    ".en__field--emailAddress"
  ) as HTMLDivElement;
  public nbDate: HTMLInputElement | null = null;
  public nbStatus: HTMLInputElement | null = null;
  private logger: EngridLogger = new EngridLogger(
    "NeverBounce",
    "#039bc4",
    "#dfdfdf",
    "📧"
  );
  private shouldRun = true;
  private nbLoaded = false;

  constructor(
    private apiKey: string,
    public dateField: string | null = null,
    public statusField: string | null = null,
    public dateFormat: string | undefined
  ) {
    this.emailField = document.getElementById(
      "en__field_supporter_emailAddress"
    ) as HTMLInputElement;
    window._NBSettings = {
      apiKey: this.apiKey,
      autoFieldHookup: false,
      inputLatency: 1500,
      displayPoweredBy: false,
      loadingMessage: "Validating...",
      softRejectMessage: "Invalid email",
      acceptedMessage: "Email validated!",
      feedback: false,
    };
    ENGrid.loadJS("https://cdn.neverbounce.com/widget/dist/NeverBounce.js");
    if (this.emailField) {
      if (this.emailField.value) {
        this.logger.log("E-mail Field Found");
        this.shouldRun = false;
      }
      this.emailField.addEventListener("change", (e) => {
        if (!this.nbLoaded) {
          this.shouldRun = true;
          this.init();
          if (this.emailField?.value) {
            setTimeout(function () {
              window._nb.fields
                .get(document.querySelector("[data-nb-id]"))[0]
                .forceUpdate();
            }, 100);
          }
        }
      });
      window.setTimeout(() => {
        if (this.emailField && this.emailField.value) {
          this.logger.log("E-mail Filled Programatically");
          this.shouldRun = false;
        }
        this.init();
      }, 1000);
    }
    this.form.onValidate.subscribe(this.validate.bind(this));
  }
  private init() {
    if (!this.shouldRun) {
      this.logger.log("Should Not Run");
      return;
    }
    if (this.nbLoaded) {
      this.logger.log("Already Loaded");
      return;
    }
    this.logger.log("Init Function");

    if (this.dateField && document.getElementsByName(this.dateField).length)
      this.nbDate = document.querySelector(
        "[name='" + this.dateField + "']"
      ) as HTMLInputElement;
    if (this.statusField && document.getElementsByName(this.statusField).length)
      this.nbStatus = document.querySelector(
        "[name='" + this.statusField + "']"
      ) as HTMLInputElement;
    if (!this.emailField) {
      this.logger.log("E-mail Field Not Found");
      return;
    }

    this.wrap(this.emailField, document.createElement("div"));
    const parentNode = <HTMLElement>this.emailField.parentNode;
    parentNode.id = "nb-wrapper";

    // Define HTML structure for a Custom NB Message and insert it after Email field
    const nbCustomMessageHTML = document.createElement("div");
    nbCustomMessageHTML.innerHTML =
      '<div id="nb-feedback" class="en__field__error nb-hidden">Enter a valid email.</div>';
    this.insertAfter(nbCustomMessageHTML, this.emailField);

    const NBClass = this;

    document.body.addEventListener("nb:registered", function (event) {
      const field = document.querySelector(
        '[data-nb-id="' + (<CustomEvent>event).detail.id + '"]'
      ) as HTMLInputElement;

      field.addEventListener("nb:loading", function (e) {
        ENGrid.disableSubmit("Validating Your Email");
      });

      // Never Bounce: Do work when input changes or when API responds with an error
      field.addEventListener("nb:clear", function (e) {
        NBClass.setEmailStatus("clear");
        ENGrid.enableSubmit();
        if (NBClass.nbDate) NBClass.nbDate.value = "";
        if (NBClass.nbStatus) NBClass.nbStatus.value = "";
      });

      // Never Bounce: Do work when results have an input that does not look like an email (i.e. missing @ or no .com/.net/etc...)
      field.addEventListener("nb:soft-result", function (e) {
        NBClass.setEmailStatus("soft-result");
        if (NBClass.nbDate) NBClass.nbDate.value = "";
        if (NBClass.nbStatus) NBClass.nbStatus.value = "";
        ENGrid.enableSubmit();
      });

      // Never Bounce: When results have been received
      field.addEventListener("nb:result", function (e) {
        if (
          (<CustomEvent>e).detail.result.is(
            window._nb.settings.getAcceptedStatusCodes()
          )
        ) {
          NBClass.setEmailStatus("valid");
          if (NBClass.nbDate)
            NBClass.nbDate.value = ENGrid.formatDate(
              new Date(),
              NBClass.dateFormat
            );
          if (NBClass.nbStatus)
            NBClass.nbStatus.value = (<CustomEvent>(
              e
            )).detail.result.response.result;
        } else {
          NBClass.setEmailStatus("invalid");
          if (NBClass.nbDate) NBClass.nbDate.value = "";
          if (NBClass.nbStatus) NBClass.nbStatus.value = "";
        }
        ENGrid.enableSubmit();
      });
    });

    // Never Bounce: Register field with the widget and broadcast nb:registration event
    window._nb.fields.registerListener(NBClass.emailField, true);
    this.nbLoaded = true;
  }

  private clearStatus() {
    if (!this.emailField) {
      this.logger.log("E-mail Field Not Found");
      return;
    }
    this.emailField.classList.remove("rm-error");
    // Search page for the NB Wrapper div and set as variable
    const nb_email_field_wrapper = <HTMLElement>(
      document.getElementById("nb-wrapper")
    );

    // Search page for the NB Feedback div and set as variable
    const nb_email_feedback_field = <HTMLElement>(
      document.getElementById("nb-feedback")
    );
    nb_email_field_wrapper.className = "";

    nb_email_feedback_field.className = "en__field__error nb-hidden";
    nb_email_feedback_field.innerHTML = "";
    this.emailWrapper.classList.remove("en__field--validationFailed");
  }

  private deleteENFieldError() {
    const errorField = <HTMLElement>(
      document.querySelector(".en__field--emailAddress>div.en__field__error")
    );
    if (errorField) errorField.remove();
  }

  private setEmailStatus(status: string) {
    this.logger.log("Status:", status);
    if (!this.emailField) {
      this.logger.log("E-mail Field Not Found");
      return;
    }
    // Search page for the NB Wrapper div and set as variable
    const nb_email_field_wrapper = <HTMLElement>(
      document.getElementById("nb-wrapper")
    );

    // Search page for the NB Feedback div and set as variable
    let nb_email_feedback_field = <HTMLElement>(
      document.getElementById("nb-feedback")
    );

    // classes to add or remove based on neverbounce results
    const nb_email_field_wrapper_success = "nb-success";
    const nb_email_field_wrapper_error = "nb-error";
    const nb_email_feedback_hidden = "nb-hidden";
    const nb_email_feedback_loading = "nb-loading";
    const nb_email_field_error = "rm-error";

    if (!nb_email_feedback_field) {
      const nbWrapperDiv = nb_email_field_wrapper.querySelector("div");
      if (nbWrapperDiv)
        nbWrapperDiv.innerHTML =
          '<div id="nb-feedback" class="en__field__error nb-hidden">Enter a valid email.</div>';
      nb_email_feedback_field = <HTMLElement>(
        document.getElementById("nb-feedback")
      );
    }

    if (status == "valid") {
      this.clearStatus();
    } else {
      nb_email_field_wrapper.classList.remove(nb_email_field_wrapper_success);
      nb_email_field_wrapper.classList.add(nb_email_field_wrapper_error);

      switch (status) {
        case "required": // special case status that we added ourselves -- doesn't come from NB
          this.deleteENFieldError();
          nb_email_feedback_field.innerHTML = "A valid email is required";
          nb_email_feedback_field.classList.remove(nb_email_feedback_loading);
          nb_email_feedback_field.classList.remove(nb_email_feedback_hidden);
          this.emailField.classList.add(nb_email_field_error);
          break;
        case "soft-result":
          if (this.emailField.value) {
            this.deleteENFieldError();
            nb_email_feedback_field.innerHTML = "Invalid email";
            nb_email_feedback_field.classList.remove(nb_email_feedback_hidden);
            this.emailField.classList.add(nb_email_field_error);
          } else {
            this.clearStatus();
          }
          break;
        case "invalid":
          this.deleteENFieldError();
          nb_email_feedback_field.innerHTML = "Invalid email";
          nb_email_feedback_field.classList.remove(nb_email_feedback_loading);
          nb_email_feedback_field.classList.remove(nb_email_feedback_hidden);
          this.emailField.classList.add(nb_email_field_error);
          break;
        case "loading":
        case "clear":
        default:
          this.clearStatus();
          break;
      }
    }
  }

  // Function to insert HTML after a DIV
  private insertAfter(el: HTMLElement, referenceNode: HTMLElement) {
    referenceNode?.parentNode?.insertBefore(el, referenceNode.nextSibling);
  }

  //  to Wrap HTML around a DIV
  private wrap(el: HTMLElement, wrapper: HTMLElement) {
    el.parentNode?.insertBefore(wrapper, el);
    wrapper.appendChild(el);
  }
  private validate() {
    if (!this.form.validate) return;
    const nbResult = ENGrid.getFieldValue("nb-result");
    if (!this.emailField || !this.shouldRun || !this.nbLoaded || !nbResult) {
      this.logger.log("validate(): Should Not Run. Returning true.");
      return;
    }
    if (this.nbStatus) {
      this.nbStatus.value = nbResult;
    }
    if (!["catchall", "unknown", "valid"].includes(nbResult)) {
      this.setEmailStatus("required");
      this.emailField?.focus();
      this.logger.log("NB-Result:", ENGrid.getFieldValue("nb-result"));
      this.form.validate = false;
    }
  }
}
