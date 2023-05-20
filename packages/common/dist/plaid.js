// Component with a helper to auto-click on the Plaid link
// when that payment method is selected
import { ENGrid, EngridLogger, EnForm } from "./";
export class Plaid {
    constructor() {
        this.logger = new EngridLogger("Plaid", "peru", "yellow", "🔗");
        this._form = EnForm.getInstance();
        this.logger.log("Enabled");
        this._form.onSubmit.subscribe(() => this.submit());
    }
    submit() {
        const plaidLink = document.querySelector("#plaid-link-button");
        if (plaidLink && plaidLink.textContent === "Link Account") {
            // Click the Plaid Link button
            this.logger.log("Clicking Link");
            plaidLink.click();
            this._form.submit = false;
            // Create a observer to watch the Link ID #plaid-link-button for a new Text Node
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.type === "childList") {
                        mutation.addedNodes.forEach((node) => {
                            if (node.nodeType === Node.TEXT_NODE) {
                                // If the Text Node is "Link Account" then the Link has failed
                                if (node.nodeValue === "Account Linked") {
                                    this.logger.log("Plaid Linked");
                                    this._form.submit = true;
                                    this._form.submitForm();
                                }
                                else {
                                    this._form.submit = true;
                                }
                            }
                        });
                    }
                });
            });
            // Start observing the Link ID #plaid-link-button
            observer.observe(plaidLink, {
                childList: true,
                subtree: true,
            });
            window.setTimeout(() => {
                this.logger.log("Enabling Submit");
                ENGrid.enableSubmit();
            }, 1000);
        }
    }
}
