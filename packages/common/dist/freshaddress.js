// According to the FreshAddress documentation, you need to add the following code to your page:
// jQuery library.
// <script type="text/javascript" src="//ajax.googleapis.com/ajax/libs/jquery/1.8.0/jquery.min.js"></script>
// FreshAddress client-side integration library
// <script src="//api.freshaddress.biz/js/lib/freshaddress-client-7.0.min.js?token=[TOKEN HERE]"></script>
//
// I know. jQuery. But it's not my fault. It's FreshAddress's fault.
import { ENGrid, EngridLogger } from "./";
import { EnForm } from "./events";
export class FreshAddress {
    constructor() {
        this.form = EnForm.getInstance();
        this.emailField = null;
        this.emailWrapper = document.querySelector(".en__field--emailAddress");
        this.faDate = null;
        this.faStatus = null;
        this.faMessage = null;
        this.logger = new EngridLogger("FreshAddress", "#039bc4", "#dfdfdf", "📧");
        this.shouldRun = true;
        this.options = ENGrid.getOption("FreshAddress");
        if (this.options === false || !window.FreshAddress)
            return;
        this.emailField = document.getElementById("en__field_supporter_emailAddress");
        if (this.emailField) {
            this.createFields();
            this.addEventListeners();
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
        }
        else {
            this.logger.log("E-mail Field Not Found");
        }
    }
    createFields() {
        if (!this.options)
            return;
        this.options.dateField = this.options.dateField || "fa_date";
        this.faDate = ENGrid.getField(this.options.dateField);
        if (!this.faDate) {
            this.logger.log("Date Field Not Found. Creating...");
            ENGrid.createHiddenInput(this.options.dateField, "");
            this.faDate = ENGrid.getField(this.options.dateField);
        }
        this.options.statusField = this.options.statusField || "fa_status";
        this.faStatus = ENGrid.getField(this.options.statusField);
        if (!this.faStatus) {
            this.logger.log("Status Field Not Found. Creating...");
            ENGrid.createHiddenInput(this.options.statusField, "");
            this.faStatus = ENGrid.getField(this.options.statusField);
        }
        this.options.messageField = this.options.messageField || "fa_message";
        this.faMessage = ENGrid.getField(this.options.messageField);
        if (!this.faMessage) {
            this.logger.log("Message Field Not Found. Creating...");
            ENGrid.createHiddenInput(this.options.messageField, "");
            this.faMessage = ENGrid.getField(this.options.messageField);
        }
    }
    writeToFields(status, message) {
        if (!this.options)
            return;
        this.faDate.value = ENGrid.formatDate(new Date(), this.options.dateFieldFormat || "yyyy-MM-dd");
        this.faStatus.value = status;
        this.faMessage.value = message;
    }
    addEventListeners() {
        var _a;
        if (!this.options)
            return;
        // Add event listeners to fields
        (_a = this.emailField) === null || _a === void 0 ? void 0 : _a.addEventListener("change", () => {
            var _a;
            if (!this.shouldRun) {
                this.logger.log("Skipping E-mail Validation");
                return;
            }
            this.logger.log("Validating " + ((_a = this.emailField) === null || _a === void 0 ? void 0 : _a.value));
            this.callAPI();
        });
        // Add event listener to submit
        this.form.onValidate.subscribe(this.validate.bind(this));
    }
    callAPI() {
        var _a;
        if (!this.options || !window.FreshAddress)
            return;
        if (!this.shouldRun)
            return;
        const email = (_a = this.emailField) === null || _a === void 0 ? void 0 : _a.value;
        const options = { emps: false, rtc_timeout: 1200 };
        ENGrid.disableSubmit("Validating Your Email");
        const ret = window.FreshAddress.validateEmail(email, options)
            .then((response) => {
            this.logger.log("Validate API Response", JSON.parse(JSON.stringify(response)));
            return this.validateResponse(response);
        })
            .catch((error) => {
            if (error.toString().includes("AbortError")) {
                // fetch aborted due to timeout
                this.logger.log("Fetch aborted");
            }
            ENGrid.enableSubmit();
            // network error or json parsing error
            ENGrid.setError(this.emailWrapper, error.toString());
        });
    }
    validateResponse(data) {
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
        }
        else if (data.isError() || data.isWarning()) {
            // Error Condition 1 - the service should always respond with finding E/W/V
            this.writeToFields("Invalid", data.getErrorResponse());
            ENGrid.setError(this.emailWrapper, data.getErrorResponse());
        }
        else {
            // Error Condition 2 - the service should always respond with finding E/W/V
            this.writeToFields("API Error", "Unknown Error");
        }
        ENGrid.enableSubmit();
    }
    validate() {
        var _a;
        ENGrid.removeError(this.emailWrapper);
        if (!this.options) {
            this.form.validate = true;
            return;
        }
        if (!this.shouldRun) {
            this.form.validate = true;
            return;
        }
        if (this.faStatus.value === "Invalid") {
            this.form.validate = false;
            window.setTimeout(() => {
                ENGrid.setError(this.emailWrapper, this.faMessage.value);
            }, 100);
            (_a = this.emailField) === null || _a === void 0 ? void 0 : _a.focus();
            return;
        }
        this.form.validate = true;
    }
}
