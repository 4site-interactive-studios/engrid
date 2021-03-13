import { DonationFrequency } from "./events";


export class setRecurrFreq {
    private _frequency: DonationFrequency = DonationFrequency.getInstance();
    private linkClass: string = 'setRecurrFreq-';
    private checkboxName: string = 'engrid.recurrfreq';

    constructor() {
        // Watch the links that starts with linkClass
        document.querySelectorAll(`a[class^="${this.linkClass}"]`).forEach(element => {
            element.addEventListener("click", (e: Event) => {
                // Get the right class
                const setRecurrFreqClass = element.className.split(' ').filter(linkClass => linkClass.startsWith(this.linkClass));
                console.log(setRecurrFreqClass);
                if (setRecurrFreqClass.length) {
                    e.preventDefault();
                    DonationFrequency.setFieldValue('transaction.recurrfreq', setRecurrFreqClass[0].substring(this.linkClass.length).toUpperCase());
                    this._frequency.load();
                }
            });
        });
        // Watch checkboxes with the name checkboxName
        (document.getElementsByName(this.checkboxName) as NodeListOf<HTMLInputElement>).forEach((element) => {
            element.addEventListener("change", () => {
                if (element.checked) {
                    DonationFrequency.setFieldValue('transaction.recurrfreq', element.value.toUpperCase());
                    this._frequency.load();
                }
            });
        });
        // Uncheck the checkbox when frequency != checkbox value
        this._frequency.onFrequencyChange.subscribe(() => {
            const freq = this._frequency.frequency.toUpperCase();
            (document.getElementsByName(this.checkboxName) as NodeListOf<HTMLInputElement>).forEach((element) => {
                if (element.checked && element.value != freq) {
                    element.checked = false;
                }
            }
            );
        });
    }
}
