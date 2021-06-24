import { SimpleEventDispatcher } from "strongly-typed-events";
export class DonationFrequency {
    constructor(radios = "transaction.recurrpay") {
        this._onFrequencyChange = new SimpleEventDispatcher();
        this._frequency = "single";
        this._radios = "";
        this._radios = radios;
        // Watch the Radios for Changes
        document.addEventListener("change", (e) => {
            const element = e.target;
            if (element && element.name == radios) {
                this.frequency = element.value;
            }
        });
    }
    static getInstance(radios = "transaction.recurrpay") {
        if (!DonationFrequency.instance) {
            DonationFrequency.instance = new DonationFrequency(radios);
        }
        return DonationFrequency.instance;
    }
    get frequency() {
        return this._frequency;
    }
    // Every time we set a frequency, trigger the onFrequencyChange event
    set frequency(value) {
        this._frequency = value == "Y" ? "monthly" : "single";
        this._onFrequencyChange.dispatch(this._frequency);
    }
    get onFrequencyChange() {
        return this._onFrequencyChange.asEvent();
    }
    // Set amount var with currently selected amount
    load() {
        const currentFrequencyField = document.querySelector('input[name="' + this._radios + '"]:checked');
        if (currentFrequencyField && currentFrequencyField.value) {
            this.frequency = currentFrequencyField.value;
        }
    }
}
