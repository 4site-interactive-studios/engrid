// This script enables live currency symbol and code to the page.
import { DonationAmount, DonationFrequency, ENGrid, EngridLogger } from ".";
export class LiveCurrency {
    constructor() {
        this.logger = new EngridLogger("LiveCurrency", "#1901b1", "#feb47a", "💲");
        this.elementsFound = false;
        this._amount = DonationAmount.getInstance();
        this._frequency = DonationFrequency.getInstance();
        this.searchElements();
        if (!this.shouldRun())
            return;
        this.updateCurrency();
        this.addEventListeners();
    }
    searchElements() {
        const enElements = document.querySelectorAll(`
      .en__component--copyblock,
      .en__component--codeblock,
      .en__field label,
      .en__submit
      `);
        if (enElements.length > 0) {
            this.elementsFound = true;
            const currency = ENGrid.getCurrencySymbol();
            const currencyCode = ENGrid.getCurrencyCode();
            const currencyElement = `<span class="engrid-currency-symbol">${currency}</span>`;
            const currencyCodeElement = `<span class="engrid-currency-code">${currencyCode}</span>`;
            enElements.forEach((item) => {
                if (item instanceof HTMLElement &&
                    (item.innerHTML.includes("[$]") || item.innerHTML.includes("[$$$]"))) {
                    this.logger.log("Old Value:", item.innerHTML);
                    const currencyRegex = /\[\$\]/g;
                    const currencyCodeRegex = /\[\$\$\$\]/g;
                    item.innerHTML = item.innerHTML.replace(currencyCodeRegex, currencyCodeElement);
                    item.innerHTML = item.innerHTML.replace(currencyRegex, currencyElement);
                    this.logger.log("New Value:", item.innerHTML);
                }
            });
        }
    }
    shouldRun() {
        return this.elementsFound;
    }
    addEventListeners() {
        this._amount.onAmountChange.subscribe(() => {
            setTimeout(() => {
                this.updateCurrency();
            }, 10);
        });
        this._frequency.onFrequencyChange.subscribe(() => {
            setTimeout(() => {
                this.searchElements();
                this.updateCurrency();
            }, 10);
        });
        const currencyField = ENGrid.getField("transaction.paycurrency");
        if (currencyField) {
            currencyField.addEventListener("change", () => {
                setTimeout(() => {
                    this.updateCurrency();
                    this._amount.load();
                    const otherAmountDiv = document.querySelector(".en__field--donationAmt .en__field__item--other");
                    if (otherAmountDiv) {
                        otherAmountDiv.setAttribute("data-currency-symbol", ENGrid.getCurrencySymbol());
                    }
                }, 10);
            });
        }
    }
    updateCurrency() {
        document.querySelectorAll(".engrid-currency-symbol").forEach((item) => {
            item.innerHTML = ENGrid.getCurrencySymbol();
        });
        document.querySelectorAll(".engrid-currency-code").forEach((item) => {
            item.innerHTML = ENGrid.getCurrencyCode();
        });
    }
}
