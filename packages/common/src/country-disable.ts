// This class allows you to disable some countries from the country dropdown list.

import { ENGrid, EngridLogger } from ".";

export class CountryDisable {
  private logger: EngridLogger = new EngridLogger(
    "CountryDisable",
    "#f0f0f0",
    "#333333",
    "🌎"
  );
  constructor() {
    const countries = document.querySelectorAll(
      'select[name="supporter.country"], select[name="transaction.shipcountry"], select[name="supporter.billingCountry"], select[name="transaction.infcountry"]'
    );
    const CountryDisable = ENGrid.getOption("CountryDisable") as string[];
    // Remove the countries from the dropdown list
    if (countries.length > 0 && CountryDisable.length > 0) {
      const countriesLower = CountryDisable.map((country) =>
        country.toLowerCase()
      );
      countries.forEach((country) => {
        country.querySelectorAll("option").forEach((option) => {
          if (
            countriesLower.includes(option.value.toLowerCase()) ||
            countriesLower.includes(option.text.toLowerCase())
          ) {
            this.logger.log(
              `Removing ${option.text} from ${country.getAttribute("name")}`
            );
            option.remove();
          }
        });
      });
    }
  }
}
