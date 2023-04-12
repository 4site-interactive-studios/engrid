// This class allows you to disable some countries from the country dropdown list.
import { ENGrid, EngridLogger } from ".";
export class CountryDisable {
    constructor() {
        this.logger = new EngridLogger("CountryDisable", "#f0f0f0", "#333333", "🌎");
        const country = ENGrid.getField("supporter.country");
        const CountryDisable = ENGrid.getOption("CountryDisable");
        // Remove the countries from the dropdown list
        if (country && CountryDisable.length > 0) {
            const countriesLower = CountryDisable.map((country) => country.toLowerCase());
            country.querySelectorAll("option").forEach((option) => {
                if (countriesLower.includes(option.value.toLowerCase()) ||
                    countriesLower.includes(option.text.toLowerCase())) {
                    this.logger.log(`Removing ${option.text}`);
                    option.remove();
                }
            });
        }
    }
}
