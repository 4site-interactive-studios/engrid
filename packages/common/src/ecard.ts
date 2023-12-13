import { ENGrid, EnForm, EngridLogger } from "./";

export class Ecard {
  public _form: EnForm = EnForm.getInstance();
  private logger: EngridLogger = new EngridLogger(
    "Ecard",
    "red",
    "#f5f5f5",
    "🪪"
  );

  constructor() {
    if (!this.shouldRun()) return;
    this._form.onValidate.subscribe(() => this.checkRecipientFields());
    const schedule = ENGrid.getUrlParameter("engrid_ecard.schedule");
    const scheduleField = ENGrid.getField("ecard.schedule") as HTMLInputElement;
    const name = ENGrid.getUrlParameter("engrid_ecard.name");
    const nameField = document.querySelector(
      ".en__ecardrecipients__name input"
    ) as HTMLInputElement;
    const email = ENGrid.getUrlParameter("engrid_ecard.email");
    const emailField = document.querySelector(
      ".en__ecardrecipients__email input"
    ) as HTMLInputElement;

    if (schedule && scheduleField) {
      // Check if chedule date is in the past
      const scheduleDate = new Date(schedule.toString());
      const today = new Date();
      if (scheduleDate.setHours(0, 0, 0, 0) < today.setHours(0, 0, 0, 0)) {
        // If it is, set the schedule to today
        scheduleField.value = ENGrid.formatDate(today, "YYYY-MM-DD");
      } else {
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
    const futureDeliveryLabel = document.querySelector(
      ".en__ecardrecipients__futureDelivery label"
    ) as HTMLLabelElement;
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

  private shouldRun() {
    return ENGrid.getPageType() === "ECARD";
  }

  private checkRecipientFields() {
    const addRecipientButton: HTMLButtonElement = document.querySelector(
      ".en__ecarditems__addrecipient"
    ) as HTMLButtonElement;
    // If we find the "+" button and there's no hidden recipient field, click on the button
    if (
      addRecipientButton &&
      !document.querySelector(".ecardrecipient__email")
    ) {
      addRecipientButton.click();
    }
    return true;
  }
}
