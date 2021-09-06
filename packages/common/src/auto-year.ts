// This class changes the Credit Card Expiration Year Field Options to
// include the current year and the next 19 years.
export class AutoYear {
  private yearField: HTMLSelectElement | null = document.querySelector(
    "select[name='transaction.ccexpire']:not(#en__field_transaction_ccexpire)"
  );
  private years = 20;

  constructor() {
    if (this.yearField) {
      this.clearFieldOptions();
      for (let i = 0; i < this.years; i++) {
        const year = new Date().getFullYear() + i;
        console.log(year);
        const newOption = document.createElement("option");
        const optionText = document.createTextNode(year.toString());
        newOption.appendChild(optionText);
        newOption.value = year.toString().substr(-2);
        this.yearField.appendChild(newOption);
      }
    }
  }
  clearFieldOptions() {
    if (this.yearField) {
      while (this.yearField.options.length > 1) {
        this.yearField.remove(1);
      }
    }
  }
}
