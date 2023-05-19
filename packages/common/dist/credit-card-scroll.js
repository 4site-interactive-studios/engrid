// Prevents the Credit Card field value from incrementing/decrementing when scrolling up/down if it's of type="number"
// REF: https://stackoverflow.com/questions/9712295/disable-scrolling-on-input-type-number
export class CreditCardScroll {
    constructor() {
        const ccNumberField = document.querySelector('input[name="transaction.ccnumber"][type="number"]');
        if (ccNumberField) {
            ccNumberField.addEventListener("wheel", () => {
                ccNumberField.blur();
            });
        }
    }
}
