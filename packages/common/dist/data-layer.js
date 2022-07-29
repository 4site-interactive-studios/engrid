// This class automatically select other radio input when an amount is entered into it.
import { EngridLogger, ENGrid, EnForm } from ".";
export class DataLayer {
    constructor() {
        this.logger = new EngridLogger("DataLayer", "#f1e5bc", "#009cdc", "📊");
        this.dataLayer = window.dataLayer || [];
        this._form = EnForm.getInstance();
        this.onLoad();
        this._form.onSubmit.subscribe(() => this.onSubmit());
    }
    onLoad() {
        if (ENGrid.getGiftProcess()) {
            this.logger.log("EN_SUCCESSFUL_DONATION");
            this.dataLayer.push({
                event: "EN_SUCCESSFUL_DONATION",
            });
        }
        else {
            this.logger.log("EN_PAGE_VIEW");
            this.dataLayer.push({
                event: "EN_PAGE_VIEW",
            });
        }
    }
    onSubmit() {
        const optIn = document.querySelector(".en__field__item:not(.en__field--question) input[name^='supporter.questions'][type='checkbox']:checked");
        if (optIn) {
            this.logger.log("EN_SUBMISSION_WITH_EMAIL_OPTIN");
            this.dataLayer.push({
                event: "EN_SUBMISSION_WITH_EMAIL_OPTIN",
            });
        }
        else {
            this.logger.log("EN_SUBMISSION_WITHOUT_EMAIL_OPTIN");
            this.dataLayer.push({
                event: "EN_SUBMISSION_WITHOUT_EMAIL_OPTIN",
            });
        }
    }
}
