/**
 * Docs: https://engrid.4sitestudios.com/component/add-name-to-message
 * This class adds the first and last name of the supporter to the message field on email to target pages if the shortcodes aren't present.
 * It listens for the blur event on the first name and last name fields and appends the values to the message field.
 */
import { ENGrid } from ".";

export class AddNameToMessage {
  constructor() {
    if (!this.shouldRun()) {
      // Don't run the script if the page isn't email to target
      return;
    }

    this.replaceNameShortcode(
      "#en__field_supporter_firstName",
      "#en__field_supporter_lastName"
    );
  }

  shouldRun() {
    return ENGrid.getPageType() === "EMAILTOTARGET";
  }

  replaceNameShortcode(fName: string, lName: string) {
    const firstName: HTMLInputElement | null = document.querySelector(fName);
    const lastName: HTMLInputElement | null = document.querySelector(lName);
    let message: HTMLTextAreaElement | null = document.querySelector(
      '[name="contact.message"]'
    );
    let addedFirstName: boolean = false;
    let addedLastName: boolean = false;

    if (message) {
      if (
        message.value.includes("{user_data~First Name") ||
        message.value.includes("{user_data~Last Name")
      ) {
        return;
      } else {
        if (!message.value.includes("{user_data~First Name") && firstName) {
          firstName.addEventListener("blur", (e: FocusEvent) => {
            const target = <HTMLInputElement>e.target;

            if (message && !addedFirstName) {
              addedFirstName = true;
              message.value = message.value.concat("\n" + target.value);
            }
          });
        }

        if (!message.value.includes("{user_data~Last Name") && lastName) {
          lastName.addEventListener("blur", (e) => {
            const target = <HTMLInputElement>e.target;

            if (message && !addedLastName) {
              addedLastName = true;
              message.value = message.value.concat(" " + target.value);
            }
          });
        }
      }
    }
  }
}
