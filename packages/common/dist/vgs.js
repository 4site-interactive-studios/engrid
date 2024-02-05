// This component allows you to customize the VGS theme options
//
// It is used in the following way:
//
// VGS: {
// "transaction.ccnumber": {
//     showCardIcon: true,
//     placeholder: "•••• •••• •••• ••••",
//     icons: {
//        (icons can't be urls, they have to be base64 encoded images)
//        cardPlaceholder: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' height='24px' viewBox='0 0 24 24' width='24px' fill='%233BBF45'%3E%3Cpath d='M0 0h24v24H0z' fill='none'/%3E%3Cpath d='M21 18v1c0 1.1-.9 2-2 2H5c-1.11 0-2-.9-2-2V5c0-1.1.89-2 2-2h14c1.1 0 2 .9 2 2v1h-9c-1.11 0-2 .9-2 2v8c0 1.1.89 2 2 2h9zm-9-2h10V8H12v8zm4-2.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z'/%3E%3C/svg%3E"
//        visa: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 384 512'%3E%3Cpath fill='%233BBF45' d='M384 32H0v448h384V32z'/%3E%3Cpath fill='white' d='M128.5 352.5l-32-192h-32l32 192zm96-192l-32 192h-32l32-192z'/%3E%3C/svg%3E",
//     },
// },
// "transaction.ccvv": {
//     showCardIcon: false,
//     placeholder: "CVV",
//     hideValue: false,
// },
// },
//
// The VGS component can also be set at the page level, if necessary
//
import { ENGrid, EngridLogger } from ".";
export class VGS {
    constructor() {
        this.logger = new EngridLogger("VGS", "black", "pink", "💳");
        this.vgsField = document.querySelector(".en__field--vgs");
        this.options = ENGrid.getOption("VGS");
        if (!this.shouldRun())
            return;
        this.setPaymentType();
        this.setDefaults();
        this.dumpGlobalVar();
    }
    shouldRun() {
        // Only run if the vgs field is present
        if (!this.vgsField)
            return false;
        return true;
    }
    setDefaults() {
        const options = this.options;
        const defaultOptions = {
            "transaction.ccnumber": {
                showCardIcon: true,
                placeholder: "•••• •••• •••• ••••",
                icons: {
                    cardPlaceholder: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEwAAABMCAYAAADHl1ErAAAACXBIWXMAABYlAAAWJQFJUiTwAAAB8ElEQVR4nO2c4W3CMBBGz1H/NyNkAzoCo2SDrkI3YJSOABt0g9IJXBnOqUkMyifUqkrek04RlvMjT2c7sc6EGKPBfBpcaSBMBGEiCBNBmAjCRBAmgjARhIkgTARhIggTQZhK2q0Yh5l1ZrYzs0PqsrI4+LN3VTeThkvntUm6Fbuxn2E/LITQmtm7mW08Sb/MbO9tpxhjui6WEMLWzJKDdO3N7Nmf9ZjaYoyn8y8X1o6GXxLV1lJyDeE+9oWPQ/ZRG4b9WkVVpqe+8LLLo7ErM6t248qllZnWBc+uV5+zumGsQjm3f/ic9tb4JGeeXcga4U723rptilVx0avgg2Q3m/JNn+y6zeAm+GSWUi/c7L5yfB77RJhACOHs6WnuLfmGpTI3YditEEGYCMJEECaCMJHZqySvHRfIMBGEiSBMBGEiCBNBmAjCRBAmgjARhIkgTGT2t+R/59EdYXZcfwmEiSBMBGEiCBNZzCr5VzvCZJjIIMxrPKFC6abMsHbaFcZuGq8StqKwDqZkN8emKBbrvawHCtxJ7y1nVxQF34lxUXBupOy8EtWy88jBhknUDjbkPhyd+Xn2l9lHZ8rgcNZVTA5nTYRFjv/dPf7HvzuJ8C0pgjARhIkgTARhIggTQZgIwkQQJoIwEYSJIEwEYQpm9g2Ro5zhLcuLBwAAAABJRU5ErkJggg==",
                },
                // Autocomplete is not customizable
                autoComplete: "cc-number",
            },
            "transaction.ccvv": {
                showCardIcon: false,
                placeholder: "CVV",
                hideValue: false,
                // Autocomplete is not customizable
                autoComplete: "cc-csc",
            },
        };
        // Deep merge the default options with the options set in the theme
        this.options = ENGrid.deepMerge(defaultOptions, options);
        this.logger.log("Theme Options", options);
        this.logger.log("Merged Options", this.options);
    }
    setPaymentType() {
        // Because the VGS iFrame Communication doesn't change the value of the payment type field, we have to set it to Visa by default
        const paymentTypeField = document.querySelector("#en__field_transaction_paymenttype");
        if (paymentTypeField) {
            // Loop through the payment type field options and set the visa card as the default
            for (let i = 0; i < paymentTypeField.options.length; i++) {
                if (paymentTypeField.options[i].value.toLowerCase() === "visa" ||
                    paymentTypeField.options[i].value.toLowerCase() === "vi") {
                    paymentTypeField.selectedIndex = i;
                    break;
                }
            }
        }
    }
    dumpGlobalVar() {
        // Dump the global variable for the VGS options
        window.enVGSFields = this.options;
        // EN is not reading the global variable because their JS file loads before ENgrid, so we're going to HACK TOWN
        // Clean up the VGS iFrames
        window.setTimeout(() => {
            const vgsIElements = document.querySelectorAll(".en__field__input--vgs");
            if (vgsIElements.length > 0) {
                // Create a mutation observer that cleans the VGS Elements before anything is rendered
                const observer = new MutationObserver((mutations) => {
                    mutations.forEach((mutation) => {
                        if (mutation.type === "childList" && mutation.addedNodes.length > 0)
                            mutation.addedNodes.forEach((node) => {
                                if (node.nodeName === "IFRAME" &&
                                    mutation.previousSibling &&
                                    mutation.previousSibling.nodeName === "IFRAME") {
                                    // Delete the previous sibling
                                    mutation.previousSibling.remove();
                                }
                            });
                    });
                });
                // Observe the VGS Elements
                vgsIElements.forEach((vgsIElement) => {
                    observer.observe(vgsIElement, { childList: true });
                });
                if (ENGrid.checkNested(window.EngagingNetworks, "require", "_defined", "enjs", "vgs")) {
                    window.EngagingNetworks.require._defined.enjs.vgs.init();
                }
                else {
                    this.logger.log("VGS is not defined");
                }
            }
        }, 1000);
    }
}
