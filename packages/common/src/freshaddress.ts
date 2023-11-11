// According to the FreshAddress documentation, you need to add the following code to your page:
// jQuery library.
// <script type="text/javascript" src="//ajax.googleapis.com/ajax/libs/jquery/1.8.0/jquery.min.js"></script>
// FreshAddress client-side integration library
// <script src="//api.freshaddress.biz/js/lib/freshaddress-client-7.0.min.js?token=[TOKEN HERE]"></script>
//
// I know. jQuery. But it's not my fault. It's FreshAddress's fault.
import { ENGrid, EngridLogger } from "./";
import { Options } from "./interfaces/options";
import { EnForm } from "./events";

export class FreshAddress {
  private form: EnForm = EnForm.getInstance();
  private emailField: HTMLInputElement | null = null;
  private emailWrapper = document.querySelector(
    ".en__field--emailAddress"
  ) as HTMLDivElement;
  private faDate: HTMLInputElement | null = null;
  private faStatus: HTMLInputElement | null = null;
  private faMessage: HTMLInputElement | null = null;
  private logger: EngridLogger = new EngridLogger(
    "FreshAddress",
    "#039bc4",
    "#dfdfdf",
    "📧"
  );
  private shouldRun = true;

  private options: Options["FreshAddress"];

  constructor() {
    this.options = ENGrid.getOption("FreshAddress") as Options["FreshAddress"];
    if (this.options === false || !window.FreshAddress) return;
    this.emailField = document.getElementById(
      "en__field_supporter_emailAddress"
    ) as HTMLInputElement;
    if (this.emailField) {
      this.createFields();
      this.addEventListeners();
      window.FreshAddressStatus = "idle";
      if (this.emailField.value) {
        this.logger.log("E-mail Field Found");
        this.shouldRun = false;
      }
      window.setTimeout(() => {
        if (this.emailField && this.emailField.value) {
          this.logger.log("E-mail Filled Programatically");
          this.shouldRun = false;
        }
      }, 1000);
    } else {
      this.logger.log("E-mail Field Not Found");
    }
  }
  private createFields() {
    if (!this.options) return;
    this.options.dateField = this.options.dateField || "fa_date";
    this.faDate = ENGrid.getField(this.options.dateField) as HTMLInputElement;
    if (!this.faDate) {
      this.logger.log("Date Field Not Found. Creating...");
      ENGrid.createHiddenInput(this.options.dateField, "");
      this.faDate = ENGrid.getField(this.options.dateField) as HTMLInputElement;
    }
    this.options.statusField = this.options.statusField || "fa_status";
    this.faStatus = ENGrid.getField(
      this.options.statusField
    ) as HTMLInputElement;
    if (!this.faStatus) {
      this.logger.log("Status Field Not Found. Creating...");
      ENGrid.createHiddenInput(this.options.statusField, "");
      this.faStatus = ENGrid.getField(
        this.options.statusField
      ) as HTMLInputElement;
    }
    this.options.messageField = this.options.messageField || "fa_message";
    this.faMessage = ENGrid.getField(
      this.options.messageField
    ) as HTMLInputElement;
    if (!this.faMessage) {
      this.logger.log("Message Field Not Found. Creating...");
      ENGrid.createHiddenInput(this.options.messageField, "");
      this.faMessage = ENGrid.getField(
        this.options.messageField
      ) as HTMLInputElement;
    }
  }

  private writeToFields(status: string, message: string) {
    if (!this.options) return;
    this.faDate!.value = ENGrid.formatDate(
      new Date(),
      this.options.dateFieldFormat || "yyyy-MM-dd"
    );
    this.faStatus!.value = status;
    this.faMessage!.value = message;
    this.emailWrapper.dataset.freshaddressSafetosendstatus =
      status.toLowerCase();
  }

  private addEventListeners() {
    if (!this.options) return;
    // Add event listeners to fields
    this.emailField?.addEventListener("change", () => {
      if (
        !this.shouldRun ||
        this.emailField?.value.includes("@4sitestudios.com")
      ) {
        ENGrid.removeError(this.emailWrapper);
        this.writeToFields("Valid", "Skipped");
        this.logger.log("Skipping E-mail Validation");
        return;
      }
      this.logger.log("Validating " + this.emailField?.value);
      this.callAPI();
    });

    // Add event listener to submit
    this.form.onValidate.subscribe(this.validate.bind(this));
  }

  private callAPI() {
    if (!this.options || !window.FreshAddress) return;
    if (!this.shouldRun) return;
    window.FreshAddressStatus = "validating";
    const email = this.emailField?.value;
    const options = { emps: false, rtc_timeout: 1200 };

    const ret = window.FreshAddress.validateEmail(email, options).then(
      (response: any) => {
        this.logger.log(
          "Validate API Response",
          JSON.parse(JSON.stringify(response))
        );
        return this.validateResponse(response);
      }
    );
  }
  private validateResponse(data: any) {
    /* ERROR HANDLING: Let through in case of a service error. Enable form submission. */
    if (data.isServiceError()) {
      this.logger.log("Service Error");
      this.writeToFields("Service Error", data.getErrorResponse());
      return true;
    }
    /* CHECK RESULT: */
    if (data.isValid()) {
      // Set response message. No action required.
      this.writeToFields("Valid", data.getComment());
      ENGrid.removeError(this.emailWrapper);
      if (data.hasSuggest()) {
        // Valid, with Suggestion
        ENGrid.setError(
          this.emailWrapper,
          `Did you mean ${data.getSuggEmail()}?`
        );
        this.emailField!.value = data.getSuggEmail();
      }
    } else if (data.isError()) {
      // Error Condition 1 - the service should always respond with finding E/W/V
      this.writeToFields("Invalid", data.getErrorResponse());
      ENGrid.setError(this.emailWrapper, data.getErrorResponse());
      this.emailField?.focus();
      if (data.hasSuggest()) {
        // Error, with Suggestion
        ENGrid.setError(
          this.emailWrapper,
          `Did you mean ${data.getSuggEmail()}?`
        );
        this.emailField!.value = data.getSuggEmail();
        this.writeToFields("Error", data.getErrorResponse());
      }
    } else if (data.isWarning()) {
      this.writeToFields("Invalid", data.getErrorResponse());
      ENGrid.setError(this.emailWrapper, data.getErrorResponse());
      if (data.hasSuggest()) {
        // Warning, with Suggestion
        ENGrid.setError(
          this.emailWrapper,
          `Did you mean ${data.getSuggEmail()}?`
        );
        this.emailField!.value = data.getSuggEmail();
        this.writeToFields("Warning", data.getErrorResponse());
      }
    } else {
      // Error Condition 2 - the service should always respond with finding E/W/V
      this.writeToFields("API Error", "Unknown Error");
    }
    window.FreshAddressStatus = "idle";
    ENGrid.enableSubmit();
  }
  private validate() {
    ENGrid.removeError(this.emailWrapper);
    if (!this.form.validate) return;
    if (!this.options) {
      this.form.validate = true;
      return;
    }
    if (!this.shouldRun) {
      this.form.validate = true;
      return;
    }
    if (window.FreshAddressStatus === "validating") {
      this.logger.log("Waiting for API Response");
      // Self resolving Promise that waits 1000ms
      const wait = new Promise((resolve, reject) => {
        setTimeout(() => {
          const status = this.faStatus!.value;
          if (status === "" || status === "Invalid") {
            this.logger.log("Promise Rejected");
            this.emailField?.focus();
            reject(false);
            return;
          }
          this.logger.log("Promise Resolved");
          resolve(true);
        }, 700);
      });
      this.form.validatePromise = wait;
      return;
    } else if (this.faStatus!.value === "Invalid") {
      this.form.validate = false;
      window.setTimeout(() => {
        ENGrid.setError(this.emailWrapper, this.faMessage!.value);
      }, 100);
      this.emailField?.focus();
      ENGrid.enableSubmit();
      return false;
    }
    this.form.validate = true;
    return true;
  }
}
