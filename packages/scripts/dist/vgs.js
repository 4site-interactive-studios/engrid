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
import { ENGrid, EnForm, EngridLogger } from ".";
export class VGS {
    constructor() {
        this.logger = new EngridLogger("VGS", "black", "pink", "💳");
        this.vgsField = document.querySelector(".en__field--vgs");
        this.options = ENGrid.getOption("VGS");
        this.paymentTypeField = document.querySelector("#en__field_transaction_paymenttype");
        this._form = EnForm.getInstance();
        this.field_expiration_month = null;
        this.field_expiration_year = null;
        this.handleExpUpdate = (e) => {
            if (!this.field_expiration_month || !this.field_expiration_year)
                return;
            const current_date = new Date();
            const current_month = current_date.getMonth() + 1;
            const current_year = parseInt(this.field_expiration_year[this.field_expiration_year.length - 1].value) > 2000
                ? current_date.getFullYear()
                : current_date.getFullYear() - 2000;
            // handle if year is changed to current year (disable all months less than current month)
            // handle if month is changed to less than current month (disable current year)
            if (e == "month") {
                let selected_month = parseInt(this.field_expiration_month.value);
                let disable = selected_month < current_month;
                this.logger.log(`month disable ${disable}`);
                this.logger.log(`selected_month ${selected_month}`);
                for (let i = 0; i < this.field_expiration_year.options.length; i++) {
                    // disable or enable current year
                    if (parseInt(this.field_expiration_year.options[i].value) <= current_year) {
                        if (disable) {
                            this.field_expiration_year.options[i].setAttribute("disabled", "disabled");
                        }
                        else {
                            this.field_expiration_year.options[i].disabled = false;
                        }
                    }
                }
            }
            else if (e == "year") {
                let selected_year = parseInt(this.field_expiration_year.value);
                let disable = selected_year == current_year;
                this.logger.log(`year disable ${disable}`);
                this.logger.log(`selected_year ${selected_year}`);
                for (let i = 0; i < this.field_expiration_month.options.length; i++) {
                    // disable or enable all months less than current month
                    if (parseInt(this.field_expiration_month.options[i].value) < current_month) {
                        if (disable) {
                            this.field_expiration_month.options[i].setAttribute("disabled", "disabled");
                        }
                        else {
                            this.field_expiration_month.options[i].disabled = false;
                        }
                    }
                }
            }
        };
        if (!this.shouldRun())
            return;
        this.setPaymentType();
        this.setDefaults();
        this.dumpGlobalVar();
        const expireFiels = document.getElementsByName("transaction.ccexpire");
        if (expireFiels) {
            this.field_expiration_month = expireFiels[0];
            this.field_expiration_year = expireFiels[1];
        }
        // Add event listeners to the expiration fields
        if (this.field_expiration_month && this.field_expiration_year) {
            ["change"].forEach((event) => {
                var _a, _b;
                (_a = this.field_expiration_month) === null || _a === void 0 ? void 0 : _a.addEventListener(event, () => {
                    this.handleExpUpdate("month");
                });
                (_b = this.field_expiration_year) === null || _b === void 0 ? void 0 : _b.addEventListener(event, () => {
                    this.handleExpUpdate("year");
                });
            });
        }
        this._form.onValidate.subscribe(() => {
            if (this._form.validate) {
                const isValid = this.validate();
                this.logger.log(`Form Validation: ${isValid}`);
                this._form.validate = isValid;
            }
        });
    }
    shouldRun() {
        // Only run if the vgs field is present
        if (!this.vgsField)
            return false;
        return true;
    }
    setDefaults() {
        //EN attempts to define a few default styles for VGS fields based on our text field styling
        //This does not always work, so we will provide our own defaults
        const bodyStyles = getComputedStyle(document.body);
        const styles = {
            fontFamily: bodyStyles.getPropertyValue("--input_font-family") ||
                "-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji'",
            fontSize: bodyStyles.getPropertyValue("--input_font-size") || "16px",
            color: bodyStyles.getPropertyValue("--input_color") || "#000",
            padding: bodyStyles.getPropertyValue("--input_padding") || "10px",
            "&::placeholder": {
                color: bodyStyles.getPropertyValue("--input_placeholder-color") || "#a9a9a9",
                opacity: bodyStyles.getPropertyValue("--input_placeholder-opacity") || "1",
                fontWeight: bodyStyles.getPropertyValue("--input_placeholder-font-weight") ||
                    "normal",
            },
        };
        const options = this.options;
        const defaultOptions = {
            "transaction.ccnumber": {
                showCardIcon: true,
                placeholder: "•••• •••• •••• ••••",
                icons: {
                    cardPlaceholder: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEwAAABMCAYAAADHl1ErAAAACXBIWXMAABYlAAAWJQFJUiTwAAAB8ElEQVR4nO2c4W3CMBBGz1H/NyNkAzoCo2SDrkI3YJSOABt0g9IJXBnOqUkMyifUqkrek04RlvMjT2c7sc6EGKPBfBpcaSBMBGEiCBNBmAjCRBAmgjARhIkgTARhIggTQZhK2q0Yh5l1ZrYzs0PqsrI4+LN3VTeThkvntUm6Fbuxn2E/LITQmtm7mW08Sb/MbO9tpxhjui6WEMLWzJKDdO3N7Nmf9ZjaYoyn8y8X1o6GXxLV1lJyDeE+9oWPQ/ZRG4b9WkVVpqe+8LLLo7ErM6t248qllZnWBc+uV5+zumGsQjm3f/ic9tb4JGeeXcga4U723rptilVx0avgg2Q3m/JNn+y6zeAm+GSWUi/c7L5yfB77RJhACOHs6WnuLfmGpTI3YditEEGYCMJEECaCMJHZqySvHRfIMBGEiSBMBGEiCBNBmAjCRBAmgjARhIkgTGT2t+R/59EdYXZcfwmEiSBMBGEiCBNZzCr5VzvCZJjIIMxrPKFC6abMsHbaFcZuGq8StqKwDqZkN8emKBbrvawHCtxJ7y1nVxQF34lxUXBupOy8EtWy88jBhknUDjbkPhyd+Xn2l9lHZ8rgcNZVTA5nTYRFjv/dPf7HvzuJ8C0pgjARhIkgTARhIggTQZgIwkQQJoIwEYSJIEwEYQpm9g2Ro5zhLcuLBwAAAABJRU5ErkJggg==",
                },
                css: styles,
                // Autocomplete is not customizable
                autoComplete: "cc-number",
                validations: ["required", "validCardNumber"],
                validCardBrands: null
            },
            "transaction.ccvv": {
                showCardIcon: false,
                placeholder: "CVV",
                hideValue: false,
                // Autocomplete is not customizable
                autoComplete: "cc-csc",
                validations: ["required", "validCardSecurityCode"],
                css: styles,
            },
            "transaction.ccexpire": {
                placeholder: "MM/YY",
                autoComplete: "cc-exp",
                validations: ["required", "validCardExpirationDate"],
                css: styles,
            },
        };
        // Override the validCardBrands if set in the theme options, as this should not be deep merged.
        if (options &&
            options["transaction.ccnumber"] &&
            options["transaction.ccnumber"].validCardBrands) {
            defaultOptions["transaction.ccnumber"].validCardBrands = options["transaction.ccnumber"].validCardBrands;
        }
        // Deep merge the default options with the options set in the theme
        this.options = ENGrid.deepMerge(defaultOptions, options);
        this.logger.log("Options", this.options);
    }
    setPaymentType() {
        // If there's no default payment type, set the default to card
        if (ENGrid.getPaymentType() === "") {
            ENGrid.setPaymentType("card");
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
                        var _a;
                        if (mutation.type === "childList" &&
                            mutation.addedNodes.length > 0) {
                            mutation.addedNodes.forEach((node) => {
                                if (node.nodeName === "IFRAME" &&
                                    mutation.previousSibling &&
                                    mutation.previousSibling.nodeName === "IFRAME") {
                                    // Delete the previous sibling
                                    mutation.previousSibling.remove();
                                }
                            });
                        }
                        // Check if the VGS Element is valid, and remove any validation classes and errors
                        if (mutation.type === "attributes" &&
                            mutation.attributeName === "class") {
                            const target = mutation.target;
                            if (target.classList.contains("vgs-collect-container__valid")) {
                                const fieldWrapper = target.closest(".en__field--vgs");
                                fieldWrapper === null || fieldWrapper === void 0 ? void 0 : fieldWrapper.classList.remove("en__field--validationFailed");
                                (_a = fieldWrapper === null || fieldWrapper === void 0 ? void 0 : fieldWrapper.querySelector(".en__field__error")) === null || _a === void 0 ? void 0 : _a.remove();
                            }
                        }
                    });
                });
                // Observe the VGS Elements
                vgsIElements.forEach((vgsIElement) => {
                    observer.observe(vgsIElement, {
                        childList: true,
                        attributeFilter: ["class"],
                    });
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
    validate() {
        if (this.paymentTypeField.value.toLowerCase() === "card" ||
            this.paymentTypeField.value.toLowerCase() === "visa" ||
            this.paymentTypeField.value.toLowerCase() === "vi") {
            const cardContainer = document.querySelector(".en__field--vgs.en__field--ccnumber");
            const cardEmpty = cardContainer === null || cardContainer === void 0 ? void 0 : cardContainer.querySelector(".vgs-collect-container__empty");
            const cvvContainer = document.querySelector(".en__field--vgs.en__field--ccvv");
            const cvvEmpty = cvvContainer === null || cvvContainer === void 0 ? void 0 : cvvContainer.querySelector(".vgs-collect-container__empty");
            if (cardContainer && cardEmpty) {
                window.setTimeout(() => {
                    ENGrid.setError(cardContainer, "Please enter a valid card number");
                    // Scroll to the error
                    cardContainer.scrollIntoView({ behavior: "smooth" });
                }, 100);
                return false;
            }
            if (cvvContainer && cvvEmpty) {
                window.setTimeout(() => {
                    ENGrid.setError(cvvContainer, "Please enter a valid CVV");
                    // Scroll to the error
                    cvvContainer.scrollIntoView({ behavior: "smooth" });
                }, 100);
                return false;
            }
        }
        return true;
    }
}
