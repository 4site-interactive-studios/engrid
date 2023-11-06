//
import { ENGrid, EngridLogger } from ".";
export class CustomCurrency {
    constructor() {
        this.logger = new EngridLogger("CustomCurrency", "#1901b1", "#00cc95", "🤑");
        this.currencyElement = document.querySelector("[name='transaction.paycurrency']");
        this.countryElement = document.getElementById("en__field_supporter_country");
        if (!this.shouldRun())
            return;
        this.addEventListeners();
        this.loadCurrencies();
    }
    shouldRun() {
        // Only run if the currency field is present, and the CustomCurrency option is not false
        if (!this.currencyElement || !ENGrid.getOption("CustomCurrency")) {
            return false;
        }
        return true;
    }
    addEventListeners() {
        if (this.countryElement) {
            this.countryElement.addEventListener("change", (e) => {
                this.loadCurrencies(e.target.value);
            });
        }
    }
    // Changes the options in the currency field to match the selected country options
    loadCurrencies(country = "default") {
        const options = ENGrid.getOption("CustomCurrency");
        if (!options)
            return;
        const label = options.label || `Give with [$$$]`;
        let currencies = options.default;
        if (options.countries && options.countries[country]) {
            currencies = options.countries[country];
        }
        if (!currencies) {
            this.logger.log(`No currencies found for ${country}`);
            return;
        }
        this.logger.log(`Loading currencies for ${country}`);
        this.currencyElement.innerHTML = "";
        for (const currency in currencies) {
            const option = document.createElement("option");
            option.value = currency;
            option.text = label
                .replace("[$$$]", currency)
                .replace("[$]", currencies[currency]);
            option.setAttribute("data-currency-code", currency);
            option.setAttribute("data-currency-symbol", currencies[currency]);
            this.currencyElement.appendChild(option);
        }
        // Set the currency to the first option and trigger a change event
        this.currencyElement.selectedIndex = 0;
        const event = new Event("change", { bubbles: true });
        this.currencyElement.dispatchEvent(event);
    }
}
