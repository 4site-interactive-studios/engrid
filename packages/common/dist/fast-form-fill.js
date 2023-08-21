/**
 * This class add body data attributes if all mandatory inputs are filled.
 * Related styling (to hide elements) can be found in "fast-form-fill.scss".
 *
 * To activate add the custom class "fast-personal-details" or "fast-address-details"
 * to the relevant form block.
 */
import { ENGrid, EngridLogger } from "./";
export class FastFormFill {
    constructor() {
        this.logger = new EngridLogger("FastFormFill", "white", "magenta", "📌");
        const fastPersonalDetailsFormBlock = document.querySelector(".en__component--formblock.fast-personal-details");
        if (fastPersonalDetailsFormBlock) {
            if (this.allMandatoryInputsAreFilled(fastPersonalDetailsFormBlock)) {
                this.logger.log("Personal details - All mandatory inputs are filled");
                ENGrid.setBodyData("hide-fast-personal-details", "true");
            }
            else {
                this.logger.log("Personal details - Not all mandatory inputs are filled");
                ENGrid.setBodyData("hide-fast-personal-details", "false");
            }
        }
        const fastAddressDetailsFormBlock = document.querySelector(".en__component--formblock.fast-address-details");
        if (fastAddressDetailsFormBlock) {
            if (this.allMandatoryInputsAreFilled(fastAddressDetailsFormBlock)) {
                this.logger.log("Address details - All mandatory inputs are filled");
                ENGrid.setBodyData("hide-fast-address-details", "true");
            }
            else {
                this.logger.log("Address details - Not all mandatory inputs are filled");
                ENGrid.setBodyData("hide-fast-address-details", "false");
            }
        }
    }
    allMandatoryInputsAreFilled(formBlock) {
        const fields = formBlock.querySelectorAll(".en__mandatory input, .en__mandatory select, .en__mandatory textarea");
        return [...fields].every((input) => {
            if (input.type === "radio" || input.type === "checkbox") {
                const inputs = document.querySelectorAll('[name="' + input.name + '"]');
                return [...inputs].some((radioOrCheckbox) => radioOrCheckbox.checked);
            }
            else {
                return input.value !== null && input.value.trim() !== "";
            }
        });
    }
}
