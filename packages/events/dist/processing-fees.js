import { SimpleEventDispatcher } from "strongly-typed-events";
import { EnForm } from "./en-form";
import { DonationAmount } from "./donation-amount";
export class ProcessingFees {
    constructor() {
        this._onFeeChange = new SimpleEventDispatcher();
        this._amount = DonationAmount.getInstance();
        this._form = EnForm.getInstance();
        this._fee = 0;
        this._field = document.querySelector('input[name="supporter.processing_fees"]');
        // console.log('%c Processing Fees Constructor', 'font-size: 30px; background-color: #000; color: #FF0');
        // Run only if it is a Donation Page with a Donation Amount field
        if (!document.getElementsByName("transaction.donationAmt").length) {
            return;
        }
        // Watch the Radios for Changes
        if (this._field instanceof HTMLInputElement) {
            // console.log('%c Processing Fees Start', 'font-size: 30px; background-color: #000; color: #FF0');
            this._field.addEventListener("change", (e) => {
                if (this._field instanceof HTMLInputElement &&
                    this._field.checked &&
                    !this._subscribe) {
                    this._subscribe = this._form.onSubmit.subscribe(() => this.addFees());
                }
                this._onFeeChange.dispatch(this.fee);
                // // console.log('%c Processing Fees Script Applied', 'font-size: 30px; background-color: #000; color: #FF0');
            });
        }
        // this._amount = amount;
    }
    static getInstance() {
        if (!ProcessingFees.instance) {
            ProcessingFees.instance = new ProcessingFees();
        }
        return ProcessingFees.instance;
    }
    get onFeeChange() {
        return this._onFeeChange.asEvent();
    }
    get fee() {
        return this.calculateFees();
    }
    // Every time we set a frequency, trigger the onFrequencyChange event
    set fee(value) {
        this._fee = value;
        this._onFeeChange.dispatch(this._fee);
    }
    calculateFees() {
        if (this._field instanceof HTMLInputElement &&
            this._field.checked &&
            "dataset" in this._field) {
            const fees = Object.assign({
                processingfeepercentadded: "0",
                processingfeefixedamountadded: "0"
            }, this._field.dataset);
            const processing_fee = (parseFloat(fees.processingfeepercentadded) / 100) *
                this._amount.amount +
                parseFloat(fees.processingfeefixedamountadded);
            return Math.round(processing_fee * 100) / 100;
        }
        return 0;
    }
    // Add Fees to Amount
    addFees() {
        if (this._form.submit) {
            this._amount.setAmount(this._amount.amount + this.fee, false);
        }
    }
    // Remove Fees From Amount
    removeFees() {
        this._amount.setAmount(this._amount.amount - this.fee);
    }
}
