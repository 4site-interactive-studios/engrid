// Automatically submits the page if a URL argument is present
import { ENGrid, EngridLogger, EnForm } from ".";
export class Autosubmit {
    constructor() {
        this.logger = new EngridLogger("Autosubmit", "#f0f0f0", "#ff0000", "🚀");
        this._form = EnForm.getInstance();
        if (ENGrid.checkNested(window.EngagingNetworks, "require", "_defined", "enjs", "checkSubmissionFailed") &&
            !window.EngagingNetworks.require._defined.enjs.checkSubmissionFailed() &&
            ENGrid.getUrlParameter("autosubmit") === "Y") {
            this.logger.log("Autosubmitting Form");
            this._form.submitForm();
        }
    }
}
