// Component to handle advocacy features
// 1 - Adds EN Polyfill to support "label" clicking on Advocacy Recipient "labels"

import { ENGrid, EngridLogger } from ".";

export class Advocacy {
  private logger: EngridLogger = new EngridLogger(
    "Advocacy",
    "#232323",
    "#f7b500",
    "👨‍⚖️"
  );
  constructor() {
    if (!this.shoudRun()) return;
    this.setClickableLabels();
  }
  shoudRun() {
    return ["ADVOCACY", "EMAILTOTARGET"].includes(ENGrid.getPageType());
  }
  setClickableLabels() {
    const contactItems = document.querySelectorAll(
      ".en__contactDetails__rows"
    ) as NodeListOf<HTMLElement>;
    if (!contactItems) return;
    contactItems.forEach((contact) => {
      contact.addEventListener("click", (e) => {
        this.toggleCheckbox(contact);
      });
    });
  }
  toggleCheckbox(contact: HTMLElement) {
    const wrapper = contact.closest(".en__contactDetails");
    if (!wrapper) return;
    const checkbox = wrapper.querySelector(
      "input[type='checkbox']"
    ) as HTMLInputElement;
    if (!checkbox) return;
    this.logger.log("toggleCheckbox", checkbox.checked);
    checkbox.checked = !checkbox.checked;
  }
}
