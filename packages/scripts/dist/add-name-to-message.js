/*
 Adds first and last name when First Name and Last Name fields lose focus if name shortcodes aren't present
*/
import { ENGrid } from "./";
export class AddNameToMessage {
    constructor() {
        if (!this.shouldRun()) {
            // Don't run the script if the page isn't email to target
            return;
        }
        this.replaceNameShortcode("#en__field_supporter_firstName", "#en__field_supporter_lastName");
    }
    shouldRun() {
        return ENGrid.getPageType() === "EMAILTOTARGET";
    }
    replaceNameShortcode(fName, lName) {
        const firstName = document.querySelector(fName);
        const lastName = document.querySelector(lName);
        let message = document.querySelector('[name="contact.message"]');
        let addedFirstName = false;
        let addedLastName = false;
        if (message) {
            if (message.value.includes("{user_data~First Name") ||
                message.value.includes("{user_data~Last Name")) {
                return;
            }
            else {
                if (!message.value.includes("{user_data~First Name") && firstName) {
                    firstName.addEventListener("blur", (e) => {
                        const target = e.target;
                        if (message && !addedFirstName) {
                            addedFirstName = true;
                            message.value = message.value.concat("\n" + target.value);
                        }
                    });
                }
                if (!message.value.includes("{user_data~Last Name") && lastName) {
                    lastName.addEventListener("blur", (e) => {
                        const target = e.target;
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
