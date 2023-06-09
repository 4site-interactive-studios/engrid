// This class provides the credit card handler
// and common credit card manipulation, like removing any non-numeric
//  characters from the credit card field
import { ENGrid, EnForm, EngridLogger } from "./";
export class CreditCard {
    constructor() {
        this.logger = new EngridLogger("CreditCard", "#ccc84a", "#333", "💳");
        this._form = EnForm.getInstance();
        this.ccField = ENGrid.getField("transaction.ccnumber");
        this.field_expiration_month = null;
        this.field_expiration_year = null;
        this.paymentTypeField = ENGrid.getField("transaction.paymenttype");
        this.handleExpUpdate = (e) => {
            if (!this.field_expiration_month || !this.field_expiration_year)
                return;
            const current_date = new Date();
            const current_month = current_date.getMonth() + 1;
            const current_year = current_date.getFullYear() - 2000;
            // handle if year is changed to current year (disable all months less than current month)
            // handle if month is changed to less than current month (disable current year)
            if (e == "month") {
                let selected_month = parseInt(this.field_expiration_month.value);
                let disable = selected_month < current_month;
                this.logger.log(`month disable ${disable}`);
                this.logger.log(`selected_month ${selected_month}`);
                for (let i = 0; i < this.field_expiration_year.options.length; i++) {
                    // disable or enable current year
                    if (parseInt(this.field_expiration_year.options[i].value) <= current_year) {
                        if (disable) {
                            this.field_expiration_year.options[i].setAttribute("disabled", "disabled");
                        }
                        else {
                            this.field_expiration_year.options[i].disabled = false;
                        }
                    }
                }
            }
            else if (e == "year") {
                let selected_year = parseInt(this.field_expiration_year.value);
                let disable = selected_year == current_year;
                this.logger.log(`year disable ${disable}`);
                this.logger.log(`selected_year ${selected_year}`);
                for (let i = 0; i < this.field_expiration_month.options.length; i++) {
                    // disable or enable all months less than current month
                    if (parseInt(this.field_expiration_month.options[i].value) < current_month) {
                        if (disable) {
                            this.field_expiration_month.options[i].setAttribute("disabled", "disabled");
                        }
                        else {
                            this.field_expiration_month.options[i].disabled = false;
                        }
                    }
                }
            }
        };
        if (!this.ccField)
            return;
        const expireFiels = document.getElementsByName("transaction.ccexpire");
        if (expireFiels) {
            this.field_expiration_month = expireFiels[0];
            this.field_expiration_year = expireFiels[1];
        }
        this._form.onSubmit.subscribe(() => this.onlyNumbersCC());
        this.addEventListeners();
        this.handleCCUpdate();
    }
    addEventListeners() {
        // Add event listeners to the credit card field
        ["keyup", "paste", "blur"].forEach((event) => {
            this.ccField.addEventListener(event, () => this.handleCCUpdate());
        });
        // Add event listeners to the expiration fields
        if (this.field_expiration_month && this.field_expiration_year) {
            ["change"].forEach((event) => {
                var _a, _b;
                (_a = this.field_expiration_month) === null || _a === void 0 ? void 0 : _a.addEventListener(event, () => {
                    this.handleExpUpdate("month");
                });
                (_b = this.field_expiration_year) === null || _b === void 0 ? void 0 : _b.addEventListener(event, () => {
                    this.handleExpUpdate("year");
                });
            });
        }
        // Add event listeners to the Give By Select Radio Buttons, if they exist
        const transactionGiveBySelect = document.getElementsByName("transaction.giveBySelect");
        if (transactionGiveBySelect) {
            transactionGiveBySelect.forEach((giveBySelect) => {
                giveBySelect.addEventListener("change", () => {
                    if (giveBySelect.value.toLowerCase() === "card") {
                        this.logger.log("Handle credit card auto-update");
                        window.setTimeout(() => {
                            this.handleCCUpdate();
                        }, 100);
                    }
                });
            });
        }
    }
    onlyNumbersCC() {
        const onlyNumbers = this.ccField.value.replace(/\D/g, "");
        this.ccField.value = onlyNumbers;
        return true;
    }
    handleCCUpdate() {
        const card_type = this.getCardType(this.ccField.value);
        const card_values = {
            amex: ["amex", "american express", "americanexpress", "amx", "ax"],
            visa: ["visa", "vi"],
            mastercard: ["mastercard", "master card", "mc"],
            discover: ["discover", "di"],
        };
        const selected_card_value = card_type
            ? Array.from(this.paymentTypeField.options).filter((d) => card_values[card_type].includes(d.value.toLowerCase()))[0].value
            : "";
        if (this.paymentTypeField.value != selected_card_value) {
            this.logger.log(`card type ${card_type}`);
            this.paymentTypeField.value = selected_card_value;
            const paymentTypeChangeEvent = new Event("change", { bubbles: true });
            this.paymentTypeField.dispatchEvent(paymentTypeChangeEvent);
        }
    }
    getCardType(cc_partial) {
        let key_character = cc_partial.charAt(0);
        const prefix = "live-card-type-";
        const field_credit_card_classes = this.ccField.className
            .split(" ")
            .filter((c) => !c.startsWith(prefix));
        switch (key_character) {
            case "0":
                this.ccField.className = field_credit_card_classes.join(" ").trim();
                this.ccField.classList.add("live-card-type-invalid");
                return false;
            case "1":
                this.ccField.className = field_credit_card_classes.join(" ").trim();
                this.ccField.classList.add("live-card-type-invalid");
                return false;
            case "2":
                this.ccField.className = field_credit_card_classes.join(" ").trim();
                this.ccField.classList.add("live-card-type-invalid");
                return false;
            case "3":
                this.ccField.className = field_credit_card_classes.join(" ").trim();
                this.ccField.classList.add("live-card-type-amex");
                return "amex";
            case "4":
                this.ccField.className = field_credit_card_classes.join(" ").trim();
                this.ccField.classList.add("live-card-type-visa");
                return "visa";
            case "5":
                this.ccField.className = field_credit_card_classes.join(" ").trim();
                this.ccField.classList.add("live-card-type-mastercard");
                return "mastercard";
            case "6":
                this.ccField.className = field_credit_card_classes.join(" ").trim();
                this.ccField.classList.add("live-card-type-discover");
                return "discover";
            case "7":
                this.ccField.className = field_credit_card_classes.join(" ").trim();
                this.ccField.classList.add("live-card-type-invalid");
                return false;
            case "8":
                this.ccField.className = field_credit_card_classes.join(" ").trim();
                this.ccField.classList.add("live-card-type-invalid");
                return false;
            case "9":
                this.ccField.className = field_credit_card_classes.join(" ").trim();
                this.ccField.classList.add("live-card-type-invalid");
                return false;
            default:
                this.ccField.className = field_credit_card_classes.join(" ").trim();
                this.ccField.classList.add("live-card-type-na");
                return false;
        }
    }
}
