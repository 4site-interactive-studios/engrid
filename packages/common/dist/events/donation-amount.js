import { SimpleEventDispatcher } from "strongly-typed-events";
export class DonationAmount {
    constructor(radios = "transaction.donationAmt", other = "transaction.donationAmt.other") {
        this._onAmountChange = new SimpleEventDispatcher();
        this._amount = 0;
        this._radios = "";
        this._other = "";
        this._dispatch = true;
        this._other = other;
        this._radios = radios;
        // Watch Radios Inputs for Changes
        document.addEventListener("change", (e) => {
            const element = e.target;
            if (element) {
                if (element.name == radios) {
                    this.amount = parseFloat(element.value);
                }
                else if (element.name == other) {
                    element.value = this.preformatFloat(element.value);
                    this.amount = parseFloat(element.value);
                }
            }
        });
        // Watch Other Amount Field
        const otherField = document.querySelector(`[name='${this._other}']`);
        if (otherField) {
            otherField.addEventListener("keyup", (e) => {
                this.amount = parseFloat(otherField.value);
            });
        }
    }
    static getInstance(radios = "transaction.donationAmt", other = "transaction.donationAmt.other") {
        if (!DonationAmount.instance) {
            DonationAmount.instance = new DonationAmount(radios, other);
        }
        return DonationAmount.instance;
    }
    get amount() {
        return this._amount;
    }
    // Every time we set an amount, trigger the onAmountChange event
    set amount(value) {
        this._amount = value || 0;
        if (this._dispatch)
            this._onAmountChange.dispatch(this._amount);
    }
    get onAmountChange() {
        return this._onAmountChange.asEvent();
    }
    // Set amount var with currently selected amount
    load() {
        const currentAmountField = document.querySelector('input[name="' + this._radios + '"]:checked');
        if (currentAmountField && currentAmountField.value) {
            let currentAmountValue = parseFloat(currentAmountField.value);
            if (currentAmountValue > 0) {
                this.amount = parseFloat(currentAmountField.value);
            }
            else {
                const otherField = document.querySelector('input[name="' + this._other + '"]');
                currentAmountValue = parseFloat(otherField.value);
                this.amount = parseFloat(otherField.value);
            }
        }
    }
    // Force a new amount
    setAmount(amount, dispatch = true) {
        // Run only if it is a Donation Page with a Donation Amount field
        if (!document.getElementsByName(this._radios).length) {
            return;
        }
        // Set dispatch to be checked by the SET method
        this._dispatch = dispatch;
        // Search for the current amount on radio boxes
        let found = Array.from(document.querySelectorAll('input[name="' + this._radios + '"]')).filter((el) => el instanceof HTMLInputElement && parseInt(el.value) == amount);
        // We found the amount on the radio boxes, so check it
        if (found.length) {
            const amountField = found[0];
            amountField.checked = true;
            // Clear OTHER text field
            this.clearOther();
        }
        else {
            const otherField = document.querySelector('input[name="' + this._other + '"]');
            otherField.focus();
            otherField.value = parseFloat(amount.toString()).toFixed(2);
        }
        // Set the new amount and trigger all live variables
        this.amount = amount;
        // Revert dispatch to default value (true)
        this._dispatch = true;
    }
    // Clear Other Field
    clearOther() {
        const otherField = document.querySelector('input[name="' + this._other + '"]');
        otherField.value = "";
        const otherWrapper = otherField.parentNode;
        otherWrapper.classList.add("en__field__item--hidden");
    }
    preformatFloat(float) {
        if (!float) {
            return "";
        }
        //Index of first comma
        const posC = float.indexOf(",");
        if (posC === -1) {
            //No commas found, treat as float
            return float;
        }
        //Index of first full stop
        const posFS = float.indexOf(".");
        if (posFS === -1) {
            //Uses commas and not full stops - swap them (e.g. 1,23 --> 1.23)
            return float.replace(/\,/g, ".");
        }
        //Uses both commas and full stops - ensure correct order and remove 1000s separators
        return posC < posFS
            ? float.replace(/\,/g, "")
            : float.replace(/\./g, "").replace(",", ".");
    }
}
