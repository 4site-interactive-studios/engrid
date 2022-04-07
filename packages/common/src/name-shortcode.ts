import { ENGrid } from "./";

export class nameShortcode {
    constructor() {
        this.replaceNameShortcode("#en__field_supporter_firstName", "#en__field_supporter_lastName");
    }

    replaceNameShortcode(fName: string, lName: string) {
        let message: HTMLTextAreaElement | null = document.querySelector('[name="contact.message"]');
        let firstName: HTMLInputElement | null = document.querySelector(fName);
        let lastName: HTMLInputElement | null = document.querySelector(lName);
        let addedFirstName: boolean = false;
        let addedLastName: boolean = false;
        
        if(ENGrid.getPageType() == "EMAILTOTARGET" && message) {
            if(message.value.includes("{user_data~First Name") || message.value.includes("{user_data~Last Name")) {
                return;
            } else {
                if(!message.value.includes("{user_data~First Name") && firstName) {
                    firstName.addEventListener("blur", function(e: FocusEvent) {
                        const target = <HTMLInputElement>e.target;

                        if(message && !addedFirstName){ 
                            addedFirstName = true;
                            message.value = message.value.concat("\n" + target.value);
                        }
                    });
                }
                
                if(!message.value.includes("{user_data~Last Name") && lastName) {
                    lastName.addEventListener("blur", function(e) {
                        const target = <HTMLInputElement>e.target;
                        
                        if(message && !addedLastName) {
                            addedLastName = true;
                            message.value = message.value.concat(" " + target.value);
                        }
                    });
                }
            }
        }

    }
}