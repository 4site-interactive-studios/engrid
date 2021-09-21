// This class changes the Credit Card Expiration Year Field Options to
// include the current year and the next 19 years.
export class AutoYear {
    constructor() {
        this.yearField = document.querySelector("select[name='transaction.ccexpire']:not(#en__field_transaction_ccexpire)");
        this.years = 20;
        this.yearLength = 2;
        if (this.yearField) {
            this.clearFieldOptions();
            for (let i = 0; i < this.years; i++) {
                const year = new Date().getFullYear() + i;
                const newOption = document.createElement("option");
                const optionText = document.createTextNode(year.toString());
                newOption.appendChild(optionText);
                newOption.value =
                    this.yearLength == 2 ? year.toString().substr(-2) : year.toString();
                this.yearField.appendChild(newOption);
            }
        }
    }
    clearFieldOptions() {
        if (this.yearField) {
            this.yearLength =
                this.yearField.options[this.yearField.options.length - 1].value.length;
            while (this.yearField.options.length > 1) {
                this.yearField.remove(1);
            }
        }
    }
}
