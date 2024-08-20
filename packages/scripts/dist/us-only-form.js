/*
 * This class disables the country field and fixes the country to "United States"
 */
import { ENGrid } from ".";
export class UsOnlyForm {
    constructor() {
        if (!this.shouldRun())
            return;
        if (!document.querySelector(".en__field--country .en__field__notice")) {
            ENGrid.addHtml('<div class="en__field__notice"><em>Note: This action is limited to U.S. addresses.</em></div>', ".us-only-form .en__field--country .en__field__element", "after");
        }
        const countrySelect = ENGrid.getField("supporter.country");
        countrySelect.setAttribute("disabled", "disabled");
        let countryValue = "United States";
        if ([...countrySelect.options].some((o) => o.value === "US")) {
            countryValue = "US";
        }
        else if ([...countrySelect.options].some((o) => o.value === "USA")) {
            countryValue = "USA";
        }
        ENGrid.setFieldValue("supporter.country", countryValue);
        ENGrid.createHiddenInput("supporter.country", countryValue);
        countrySelect.addEventListener("change", () => {
            countrySelect.value = countryValue;
        });
    }
    shouldRun() {
        return !!document.querySelector(".en__component--formblock.us-only-form .en__field--country");
    }
}
