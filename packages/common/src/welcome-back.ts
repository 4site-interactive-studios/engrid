import { ENGrid, EngridLogger } from "./";
import * as cookie from "./cookie";

export class WelcomeBack {
  private logger: EngridLogger = new EngridLogger(
    "WelcomeBack",
    "white",
    "magenta",
    "👋"
  );
  private supporterDetails: { [key: string]: string } = {};

  /**
   Options:
     FALSE
     OR
   - add welcome back message
     welcome back message position
     welcome back message content
     add personal information summary
      personal information summary position
      personal information summary content
   -
   */

  constructor() {
    if (this.shouldRun()) {
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
  }

  private shouldRun() {
    return !!document.querySelector(".fast-personal-details");
  }

  private addWelcomeBack() {
    const welcomeBack = document.createElement("div");
    welcomeBack.classList.add(
      "engrid-welcome-back",
      "showif-fast-personal-details"
    );

    welcomeBack.innerHTML = `<p>
      Welcome back, ${this.supporterDetails["firstName"]}! 
      <span class="engrid-reset-welcome-back">Not you?</span>
    </p>`;

    document
      .querySelector(".body-main")
      ?.insertAdjacentElement("afterbegin", welcomeBack);
  }

  private resetWelcomeBack() {
    const inputs = document.querySelectorAll(
      ".fast-personal-details .en__field__input"
    ) as NodeListOf<HTMLInputElement>;

    inputs.forEach((input: HTMLInputElement) => {
      if (input.type === "checkbox" || input.type === "radio") {
        input.checked = false;
      } else {
        input.value = "";
      }
    });

    this.supporterDetails = {};

    ENGrid.setBodyData("hide-fast-personal-details", false);

    cookie.remove("engrid-autofill");
  }

  private addPersonalDetailsSummary() {
    const personalDetailsSummary = document.createElement("div");
    personalDetailsSummary.classList.add(
      "engrid-personal-details-summary",
      "showif-fast-personal-details"
    );

    personalDetailsSummary.innerHTML = `<h3>Your information</h3>`;

    personalDetailsSummary.insertAdjacentHTML(
      "beforeend",
      `
     <p>
        ${this.supporterDetails["firstName"]} ${this.supporterDetails["lastName"]}
        <br>
        ${this.supporterDetails["emailAddress"]}
     </p>
    `
    );

    if (
      this.supporterDetails["address1"] &&
      this.supporterDetails["city"] &&
      this.supporterDetails["region"] &&
      this.supporterDetails["postcode"]
    ) {
      personalDetailsSummary.insertAdjacentHTML(
        "beforeend",
        `
        <p>
          ${this.supporterDetails["address1"]} ${this.supporterDetails["address2"]}
          <br>
          ${this.supporterDetails["city"]}, ${this.supporterDetails["region"]} 
          ${this.supporterDetails["postcode"]}
        </p>
      `
      );
    }

    personalDetailsSummary.insertAdjacentHTML(
      "beforeend",
      `
      <p class="engrid-reset-welcome-back">Change my info <svg viewbox="0 0 528.899 528.899" width="15px" height="15px" xmlns="http://www.w3.org/2000/svg"> <g> <path d="M328.883,89.125l107.59,107.589l-272.34,272.34L56.604,361.465L328.883,89.125z M518.113,63.177l-47.981-47.981 c-18.543-18.543-48.653-18.543-67.259,0l-45.961,45.961l107.59,107.59l53.611-53.611 C532.495,100.753,532.495,77.559,518.113,63.177z M0.3,512.69c-1.958,8.812,5.998,16.708,14.811,14.565l119.891-29.069 L27.473,390.597L0.3,512.69z"></path></g></svg></p>
    `
    );

    document
      .querySelector(".fast-personal-details")
      ?.insertAdjacentElement("beforebegin", personalDetailsSummary);
  }

  private addEventListeners() {
    document
      .querySelectorAll(".engrid-reset-welcome-back")
      .forEach((element) => {
        element.addEventListener("click", () => {
          this.resetWelcomeBack();
        });
      });
  }
}
