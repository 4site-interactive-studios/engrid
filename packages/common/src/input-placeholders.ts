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

import { ENGrid } from "./";

export class InputPlaceholders {
  private defaultPlaceholders: {
    [key: string]: string;
  } = {
    "input#en__field_supporter_firstName": "First Name",
    "input#en__field_supporter_lastName": "Last Name",
    "input#en__field_supporter_emailAddress": "Email Address",
    "input#en__field_supporter_phoneNumber": "Phone Number (Optional)",
    ".en__mandatory input#en__field_supporter_phoneNumber": "Phone Number",
    "input#en__field_supporter_phoneNumber2": "000-000-0000 (Optional)",
    ".en__mandatory input#en__field_supporter_phoneNumber2": "000-000-0000",
    "input#en__field_supporter_country": "Country",
    "input#en__field_supporter_address1": "Street Address",
    "input#en__field_supporter_address2": "Apt., Ste., Bldg.",
    "input#en__field_supporter_city": "City",
    "input#en__field_supporter_region": "Region",
    "input#en__field_supporter_postcode": "ZIP Code",
    ".en__field--donationAmt.en__field--withOther .en__field__input--other":
      "Other",
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
  constructor() {
    if (this.shouldRun()) {
      // If there's a Placeholders option, merge it with the default placeholders
      const placeholders = ENGrid.getOption("Placeholders") as {
        [key: string]: string;
      };
      if (placeholders) {
        this.defaultPlaceholders = {
          ...this.defaultPlaceholders,
          ...placeholders,
        };
      }
      this.run();
    }
  }

  private shouldRun() {
    return ENGrid.hasBodyData("add-input-placeholders");
  }

  private run() {
    Object.keys(this.defaultPlaceholders).forEach((selector) => {
      if (selector in this.defaultPlaceholders)
        this.addPlaceholder(selector, this.defaultPlaceholders[selector]);
    });
  }

  private addPlaceholder(selector: string, placeholder: string) {
    const fieldEl: HTMLInputElement = document.querySelector(
      selector
    ) as HTMLInputElement;
    if (fieldEl) {
      fieldEl.placeholder = placeholder;
    }
  }
}
