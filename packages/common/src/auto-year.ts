// This class changes the Credit Card Expiration Year Field Options to
// include the current year and the next 19 years.
export class AutoYear {
  private yearField: HTMLSelectElement | null = document.querySelector(
    "select[name='transaction.ccexpire']:not(#en__field_transaction_ccexpire)"
  );
  private years = 20;
  private yearLength = 2;

  constructor() {
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

      [...this.yearField.options].forEach((option) => {
        if (option.value !== "" && !isNaN(Number(option.value))) {
          // @ts-ignore
          const index = [...this.yearField.options].findIndex(
            (i) => i.value === option.value
          );
          this.yearField?.remove(index);
        }
      });
    }
  }
}
