/**
 * This component adjusts an ecard form to target a specific recipient,
 * defined in a code block
 */
import { EcardToTargetOptionsDefaults, } from "./interfaces/ecard-to-target-options";
import { EngridLogger } from "./logger";
import { ENGrid } from "./engrid";
import { EnForm } from "./events";
export class EcardToTarget {
    constructor() {
        this.options = EcardToTargetOptionsDefaults;
        this.logger = new EngridLogger("EcardToTarget", "DarkBlue", "Azure", "📧");
        this._form = EnForm.getInstance();
        this.supporterNameAddedToMessage = false;
        if (!this.shouldRun())
            return;
        this.options = Object.assign(Object.assign({}, this.options), window.EngridEcardToTarget);
        this.logger.log("EcardToTarget running. Options:", this.options);
        this.setTarget();
        this.hideElements();
        this.addSupporterNameToMessage();
    }
    shouldRun() {
        return (window.hasOwnProperty("EngridEcardToTarget") &&
            typeof window.EngridEcardToTarget === "object" &&
            ((window.EngridEcardToTarget.hasOwnProperty("targetName") &&
                window.EngridEcardToTarget.hasOwnProperty("targetEmail")) ||
                (window.EngridEcardToTarget.hasOwnProperty("targets") &&
                    window.EngridEcardToTarget.targets.length > 0)));
    }
    setTarget() {
        const targetNameField = document.querySelector(".en__ecardrecipients__name input");
        const targetEmailField = document.querySelector(".en__ecardrecipients__email input");
        const addRecipientButton = document.querySelector(".en__ecarditems__addrecipient");
        if (!targetNameField || !targetEmailField || !addRecipientButton) {
            this.logger.error("Could not add recipient. Required elements not found.");
            return;
        }
        let targets = this.options.targets;
        // BC support for targetName and targetEmail
        if (this.options.targetName && this.options.targetEmail) {
            targets.push({
                targetName: this.options.targetName,
                targetEmail: this.options.targetEmail,
            });
        }
        // Remove duplicates from targets array
        targets = targets.filter((target, index, self) => index ===
            self.findIndex((t) => t.targetName === target.targetName &&
                t.targetEmail === target.targetEmail));
        targets.forEach((target) => {
            const targetName = target.targetName;
            const targetEmail = target.targetEmail;
            if (!targetName || !targetEmail) {
                this.logger.error("Could not add recipient. Target name or email is empty.");
                return;
            }
            targetNameField.value = targetName;
            targetEmailField.value = targetEmail;
            addRecipientButton === null || addRecipientButton === void 0 ? void 0 : addRecipientButton.click();
            this.logger.log("Added recipient", targetName, targetEmail);
        });
    }
    hideElements() {
        const messageBlock = document.querySelector(".en__ecardmessage");
        const sendDateBlock = document.querySelector(".en__ecardrecipients__futureDelivery");
        const targetBlock = document.querySelector(".en__ecardrecipients");
        if (this.options.hideMessage && messageBlock) {
            messageBlock.classList.add("hide");
        }
        if (this.options.hideSendDate && sendDateBlock) {
            sendDateBlock.classList.add("hide");
        }
        if (this.options.hideTarget && targetBlock) {
            targetBlock.classList.add("hide");
        }
    }
    addSupporterNameToMessage() {
        if (!this.options.addSupporterNameToMessage)
            return;
        this._form.onSubmit.subscribe(() => {
            if (!this._form.submit)
                return;
            if (!this.supporterNameAddedToMessage) {
                this.supporterNameAddedToMessage = true;
                const supporterName = `${ENGrid.getFieldValue("supporter.firstName")} ${ENGrid.getFieldValue("supporter.lastName")}`;
                const messageField = document.querySelector("[name='transaction.comments']");
                if (!messageField)
                    return;
                messageField.value = `${messageField.value}\n${supporterName}`;
                this.logger.log("Added supporter name to personalized message", supporterName);
            }
        });
    }
}
