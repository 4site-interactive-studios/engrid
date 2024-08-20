// This component allows you to customize the currency options in the currency field
// It is used in the following way:
//
// CustomCurrency: {
//   label: "Give with [$$$]",
//   default: {
//     USD: "$",
//     GBP: "£",
//     EUR: "€",
//   },
//   countries: {
//     US: {
//       USD: "$",
//     },
//     GB: {
//       GBP: "£",
//     },
//     DE: {
//       EUR: "€",
//     },
//   },
// },
//
// The label is the text that appears in the currency field
// The default is the currency options that appear when the selected country does not have a custom option
// The countries object is a list of countries and their currency options
// The country codes must match the country codes in the country field
// Because the CustomCurrency component works with the country field, it's automatically integrated with the AutoCountrySelect component.
// So if you visit the page from a country that has a custom currency option, the currency field will automatically be updated.
// The CustomCurrency component can also be set at the page level. Useful for Regional Pages, with a Code Block like this:

// <script>
//   window.EngridPageOptions = window.EngridPageOptions || [];
//   window.EngridPageOptions.CustomCurrency = {
//     label: "Give with [$$$]",
//     default: {
//       USD: "$",
//       GBP: "£",
//       EUR: "€",
//     },
//     countries: {
//       US: {
//         USD: "$",
//       },
//       GB: {
//         GBP: "£",
//       },
//       DE: {
//         EUR: "€",
//       },
//     },
//   };
// </script>
//
// This will override the default CustomCurrency options for that page.
//

import { ENGrid, Country, EngridLogger } from ".";

export class CustomCurrency {
  private logger: EngridLogger = new EngridLogger(
    "CustomCurrency",
    "#1901b1",
    "#00cc95",
    "🤑"
  );
  private currencyElement = document.querySelector(
    "[name='transaction.paycurrency']"
  ) as HTMLSelectElement;
  private _country = Country.getInstance();
  constructor() {
    if (!this.shouldRun()) return;
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
    if (this._country.countryField) {
      this._country.onCountryChange.subscribe((country) => {
        this.loadCurrencies(country);
      });
    }
  }
  // Changes the options in the currency field to match the selected country options
  loadCurrencies(country = "default") {
    const options = ENGrid.getOption("CustomCurrency");
    if (!options) return;
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
