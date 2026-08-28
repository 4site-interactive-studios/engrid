// Component that adds input placeholders
// You can override the default placeholders by adding a Placeholders option to the EngridOptions on the client theme.
// You can also add an EngridPageOptions override to the page, if you want to override the placeholders on a specific page. Example:
// <script type="text/javascript">
//   EngridPageOptions = {
//     Placeholders: {
//       "input#en__field_supporter_firstName": "Nome",
//       "input#en__field_supporter_lastName": "Sobrenome"
//     }
//   };
// </script>
import { ENGrid } from ".";
export class InputPlaceholders {
    constructor() {
        // NOTE: for selectors listed in selectorToI18nKey below, these English
        // strings are shadowed by the i18n dictionary — edit
        // interfaces/i18n-options.ts ("placeholders.*" keys) instead of here.
        this.defaultPlaceholders = {
            "input#en__field_supporter_firstName": "First Name",
            "input#en__field_supporter_lastName": "Last Name",
            "input#en__field_supporter_emailAddress": "Email Address",
            "input#en__field_supporter_phoneNumber": "Phone Number (Optional)",
            ".en__mandatory input#en__field_supporter_phoneNumber": "Phone Number",
            ".i-required input#en__field_supporter_phoneNumber": "Phone Number",
            "input#en__field_supporter_phoneNumber2": "000-000-0000 (Optional)",
            ".en__mandatory input#en__field_supporter_phoneNumber2": "000-000-0000",
            ".i-required input#en__field_supporter_phoneNumber2": "000-000-0000",
            "input#en__field_supporter_country": "Country",
            "input#en__field_supporter_address1": "Street Address",
            "input#en__field_supporter_address2": "Apt., Ste., Bldg.",
            "input#en__field_supporter_city": "City",
            "input#en__field_supporter_region": "Region",
            "input#en__field_supporter_postcode": "ZIP Code",
            ".en__field--donationAmt.en__field--withOther .en__field__input--other": "Other",
            "input#en__field_transaction_ccexpire": "MM / YY",
            "input#en__field_supporter_bankAccountNumber": "Bank Account Number",
            "input#en__field_supporter_bankRoutingNumber": "Bank Routing Number",
            "input#en__field_transaction_honname": "Honoree Name",
            "input#en__field_transaction_infname": "Recipient Name",
            "input#en__field_transaction_infemail": "Recipient Email Address",
            "input#en__field_transaction_infcountry": "Country",
            "input#en__field_transaction_infadd1": "Recipient Street Address",
            "input#en__field_transaction_infadd2": "Recipient Apt., Ste., Bldg.",
            "input#en__field_transaction_infcity": "Recipient City",
            "input#en__field_transaction_infpostcd": "Recipient Postal Code",
            "input#en__field_transaction_gftrsn": "Reason for your gift",
            "input#en__field_transaction_shipfname": "Shipping First Name",
            "input#en__field_transaction_shiplname": "Shipping Last Name",
            "input#en__field_transaction_shipemail": "Shipping Email Address",
            "input#en__field_transaction_shipcountry": "Shipping Country",
            "input#en__field_transaction_shipadd1": "Shipping Street Address",
            "input#en__field_transaction_shipadd2": "Shipping Apt., Ste., Bldg.",
            "input#en__field_transaction_shipcity": "Shipping City",
            "input#en__field_transaction_shipregion": "Shipping Region",
            "input#en__field_transaction_shippostcode": "Shipping Postal Code",
            "input#en__field_supporter_billingCountry": "Billing Country",
            "input#en__field_supporter_billingAddress1": "Billing Street Address",
            "input#en__field_supporter_billingAddress2": "Billing Apt., Ste., Bldg.",
            "input#en__field_supporter_billingCity": "Billing City",
            "input#en__field_supporter_billingRegion": "Billing Region",
            "input#en__field_supporter_billingPostcode": "Billing Postal Code",
        };
        // Maps the default-placeholder selectors to i18n dictionary keys, so the
        // built-in strings follow the page language. Selectors the client overrides
        // via the Placeholders option are never translated.
        this.selectorToI18nKey = {
            "input#en__field_supporter_firstName": "placeholders.firstName",
            "input#en__field_supporter_lastName": "placeholders.lastName",
            "input#en__field_supporter_emailAddress": "placeholders.emailAddress",
            "input#en__field_supporter_phoneNumber": "placeholders.phoneNumberOptional",
            ".en__mandatory input#en__field_supporter_phoneNumber": "placeholders.phoneNumber",
            ".i-required input#en__field_supporter_phoneNumber": "placeholders.phoneNumber",
            "input#en__field_supporter_phoneNumber2": "placeholders.phoneNumber2Optional",
            "input#en__field_supporter_country": "placeholders.country",
            "input#en__field_supporter_address1": "placeholders.address1",
            "input#en__field_supporter_address2": "placeholders.address2",
            "input#en__field_supporter_city": "placeholders.city",
            "input#en__field_supporter_region": "placeholders.region",
            "input#en__field_supporter_postcode": "placeholders.postcode",
        };
        this.customSelectors = new Set();
        if (this.shouldRun()) {
            // If there's a Placeholders option, merge it with the default placeholders
            const placeholders = ENGrid.getOption("Placeholders");
            if (placeholders) {
                this.customSelectors = new Set(Object.keys(placeholders));
                this.defaultPlaceholders = Object.assign(Object.assign({}, this.defaultPlaceholders), placeholders);
            }
            this.run();
        }
    }
    shouldRun() {
        return ENGrid.hasBodyData("add-input-placeholders");
    }
    run() {
        Object.keys(this.defaultPlaceholders).forEach((selector) => {
            if (selector in this.defaultPlaceholders)
                this.addPlaceholder(selector, this.resolvePlaceholder(selector));
        });
    }
    // Built-in placeholder strings follow the page language; client-provided
    // Placeholders options always win.
    resolvePlaceholder(selector) {
        const key = this.selectorToI18nKey[selector];
        if (key && !this.customSelectors.has(selector)) {
            return ENGrid.t(key);
        }
        return this.defaultPlaceholders[selector];
    }
    addPlaceholder(selector, placeholder) {
        const fieldEl = document.querySelector(selector);
        if (fieldEl) {
            fieldEl.placeholder = placeholder;
        }
    }
}
