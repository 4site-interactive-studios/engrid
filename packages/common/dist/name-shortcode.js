import { ENGrid } from "./";
export class nameShortcode {
    constructor() {
        this.replaceNameShortcode("#en__field_supporter_firstName", "#en__field_supporter_lastName");
    }
    replaceNameShortcode(fName, lName) {
        let message = document.querySelector('[name="contact.message"]');
        let firstName = document.querySelector(fName);
        let lastName = document.querySelector(lName);
        let addedFirstName = false;
        let addedLastName = false;
        if (ENGrid.getPageType() == "EMAILTOTARGET" && message) {
            if (message.value.includes("{user_data~First Name") || message.value.includes("{user_data~Last Name")) {
                return;
            }
            else {
                if (!message.value.includes("{user_data~First Name") && firstName) {
                    firstName.addEventListener("blur", function (e) {
                        const target = e.target;
                        if (message && !addedFirstName) {
                            addedFirstName = true;
                            message.value = message.value.concat("\n" + target.value);
                        }
                    });
                }
                if (!message.value.includes("{user_data~Last Name") && lastName) {
                    lastName.addEventListener("blur", function (e) {
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
