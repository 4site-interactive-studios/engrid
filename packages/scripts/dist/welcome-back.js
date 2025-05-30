/**
 * This component adds a welcome back message and a personal details summary to the page.
 * It depends on the "fast-personal-details" functionality from the FastFormFill component.
 * The component will only run, when the "WelcomeBack" option is set,
 * if the "fast-personal-details" class is present on the page and the FastFormFill conditions
 * are met (all mandatory inputs in that block are filled).
 *
 * All the text content and positioning is configurable through the "WelcomeBack" option.
 */
import { ENGrid, EnForm, RememberMeEvents } from ".";
import * as cookie from "./cookie";
export class WelcomeBack {
    constructor() {
        var _a;
        this._form = EnForm.getInstance();
        this.supporterDetails = {};
        this.options = (_a = ENGrid.getOption("WelcomeBack")) !== null && _a !== void 0 ? _a : false;
        this.rememberMeEvents = RememberMeEvents.getInstance();
        this.hasRun = false;
        if (!this.shouldRun())
            return;
        if (ENGrid.getOption("RememberMe")) {
            this.rememberMeEvents.onLoad.subscribe(() => {
                this.run();
            });
            this.rememberMeEvents.onClear.subscribe(() => {
                this.resetWelcomeBack();
            });
        }
        else {
            this.run();
        }
    }
    run() {
        if (this.hasRun)
            return;
        this.hasRun = true;
        this.supporterDetails = {
            firstName: ENGrid.getFieldValue("supporter.firstName"),
            lastName: ENGrid.getFieldValue("supporter.lastName"),
            emailAddress: ENGrid.getFieldValue("supporter.emailAddress"),
            address1: ENGrid.getFieldValue("supporter.address1"),
            address2: ENGrid.getFieldValue("supporter.address2"),
            city: ENGrid.getFieldValue("supporter.city"),
            region: ENGrid.getFieldValue("supporter.region"),
            postcode: ENGrid.getFieldValue("supporter.postcode"),
            country: ENGrid.getFieldValue("supporter.country"),
        };
        this.addWelcomeBack();
        this.addPersonalDetailsSummary();
        this.addEventListeners();
    }
    shouldRun() {
        return (!!document.querySelector(".fast-personal-details") &&
            ENGrid.getBodyData("embedded") !== "thank-you-page-donation" &&
            this.options !== false);
    }
    addWelcomeBack() {
        var _a;
        if (typeof this.options !== "object" ||
            !this.options.welcomeBackMessage.display)
            return;
        const options = this.options.welcomeBackMessage;
        const welcomeBack = document.createElement("div");
        welcomeBack.classList.add("engrid-welcome-back", "showif-fast-personal-details");
        const title = options.title.replace("{firstName}", this.supporterDetails["firstName"]);
        welcomeBack.innerHTML = `<p>
      ${title}
      <span class="engrid-reset-welcome-back">${options.editText}</span>
    </p>`;
        (_a = document
            .querySelector(options.anchor)) === null || _a === void 0 ? void 0 : _a.insertAdjacentElement(options.placement, welcomeBack);
    }
    resetWelcomeBack() {
        const inputs = document.querySelectorAll(".fast-personal-details .en__field__input");
        inputs.forEach((input) => {
            if (input.type === "checkbox" || input.type === "radio") {
                input.checked = false;
            }
            else {
                input.value = "";
            }
        });
        this.supporterDetails = {};
        ENGrid.setBodyData("hide-fast-personal-details", false);
        cookie.remove("engrid-autofill");
    }
    addPersonalDetailsSummary() {
        var _a;
        if (typeof this.options !== "object" ||
            !this.options.personalDetailsSummary.display)
            return;
        let options = this.options.personalDetailsSummary;
        const personalDetailsSummary = document.createElement("div");
        personalDetailsSummary.classList.add("engrid-personal-details-summary", "showif-fast-personal-details");
        personalDetailsSummary.innerHTML = `<h3>${options.title}</h3>`;
        personalDetailsSummary.insertAdjacentHTML("beforeend", `
     <p>
        ${this.supporterDetails["firstName"]} ${this.supporterDetails["lastName"]}
        <br>
        ${this.supporterDetails["emailAddress"]}
     </p>
    `);
        if (this.supporterDetails["address1"] &&
            this.supporterDetails["city"] &&
            this.supporterDetails["region"] &&
            this.supporterDetails["postcode"]) {
            personalDetailsSummary.insertAdjacentHTML("beforeend", `
        <p>
          ${this.supporterDetails["address1"]} ${this.supporterDetails["address2"]}
          <br>
          ${this.supporterDetails["city"]}, ${this.supporterDetails["region"]} 
          ${this.supporterDetails["postcode"]}
        </p>
      `);
        }
        personalDetailsSummary.insertAdjacentHTML("beforeend", `
      <p class="engrid-welcome-back-clear setattr--data-engrid-hide-fast-personal-details--false">${options.editText}<svg viewbox="0 0 528.899 528.899" xmlns="http://www.w3.org/2000/svg"> <g> <path d="M328.883,89.125l107.59,107.589l-272.34,272.34L56.604,361.465L328.883,89.125z M518.113,63.177l-47.981-47.981 c-18.543-18.543-48.653-18.543-67.259,0l-45.961,45.961l107.59,107.59l53.611-53.611 C532.495,100.753,532.495,77.559,518.113,63.177z M0.3,512.69c-1.958,8.812,5.998,16.708,14.811,14.565l119.891-29.069 L27.473,390.597L0.3,512.69z"></path></g></svg></p>
    `);
        (_a = document
            .querySelector(options.anchor)) === null || _a === void 0 ? void 0 : _a.insertAdjacentElement(options.placement, personalDetailsSummary);
    }
    addEventListeners() {
        document
            .querySelectorAll(".engrid-reset-welcome-back")
            .forEach((element) => {
            element.addEventListener("click", () => {
                this.resetWelcomeBack();
            });
        });
        this._form.onValidate.subscribe(this.enOnValidate.bind(this));
        this._form.onValidate.subscribe(() => {
            window.setTimeout(this.doubleCheckValidation.bind(this), 150);
        });
    }
    enOnValidate() {
        if (!this._form.validate) {
            // Disable the fast personal details if the form is invalidated by other components running before
            ENGrid.setBodyData("hide-fast-personal-details", false);
            return;
        }
        const regionField = ENGrid.getField("supporter.region");
        const regionFieldValue = regionField ? regionField.value : "";
        const regionFieldType = regionField === null || regionField === void 0 ? void 0 : regionField.tagName.toLowerCase();
        const regionFieldLabel = document.querySelector(".en__field--region label");
        if (regionFieldType === "select" &&
            regionFieldLabel &&
            regionFieldValue === "") {
            ENGrid.setError(".en__field--region", `${regionFieldLabel.innerText} is required`);
            ENGrid.setBodyData("hide-fast-personal-details", false);
            this._form.validate = false;
        }
        else {
            // Remove the error message if the region field is filled
            ENGrid.removeError(".en__field--region");
        }
    }
    doubleCheckValidation() {
        // Disable the fast personal details if the form is invalidated by other components running AFTER
        // the fast personal details component
        const validationError = document.querySelector(".fast-personal-details .en__field--validationFailed");
        if (validationError) {
            ENGrid.setBodyData("hide-fast-personal-details", false);
            validationError.scrollIntoView({
                behavior: "smooth",
                block: "center",
            });
        }
        return;
    }
}
