// Component that adds input placeholders

import { ENGrid } from "./";

export class InputPlaceholders {
  constructor() {
    if (this.shouldRun()) {
      this.run();
    }
  }

  private shouldRun() {
    return ENGrid.hasBodyData("add-input-placeholders");
  }

  private run() {
    // Personal Information
    this.addPlaceholder("input#en__field_supporter_firstName", "First Name");
    this.addPlaceholder("input#en__field_supporter_lastName", "Last Name");
    this.addPlaceholder(
      "input#en__field_supporter_emailAddress",
      "Email Address"
    );
    this.addPlaceholder(
      "input#en__field_supporter_phoneNumber",
      "Phone Number (Optional)"
    );
    this.addPlaceholder(
      ".en__mandatory input#en__field_supporter_phoneNumber",
      "Phone Number"
    );
    this.addPlaceholder(
      "input#en__field_supporter_phoneNumber2",
      "000-000-0000 (Optional)"
    );
    this.addPlaceholder(
      ".en__mandatory input#en__field_supporter_phoneNumber2",
      "000-000-0000"
    );

    // Address
    this.addPlaceholder("input#en__field_supporter_country", "Country");
    this.addPlaceholder("input#en__field_supporter_address1", "Street Address");
    this.addPlaceholder(
      "input#en__field_supporter_address2",
      "Apt., ste., bldg."
    );
    this.addPlaceholder("input#en__field_supporter_city", "City");
    this.addPlaceholder("input#en__field_supporter_region", "Region");
    this.addPlaceholder("input#en__field_supporter_postcode", "Zip Code");

    // Donation
    this.addPlaceholder(
      ".en__field--donationAmt.en__field--withOther .en__field__input--other",
      "Other"
    );
    this.addPlaceholder(
      "input#en__field_transaction_ccnumber",
      "•••• •••• •••• ••••"
    );
    this.addPlaceholder("input#en__field_transaction_ccexpire", "MM / YY");
    this.addPlaceholder("input#en__field_transaction_ccvv", "CVV");
    this.addPlaceholder(
      "input#en__field_supporter_bankAccountNumber",
      "Bank Account Number"
    );
    this.addPlaceholder(
      "input#en__field_supporter_bankRoutingNumber",
      "Bank Routing Number"
    );
    // In Honor
    this.addPlaceholder("input#en__field_transaction_honname", "Honoree Name");
    this.addPlaceholder(
      "input#en__field_transaction_infname",
      "Recipient Name"
    );
    this.addPlaceholder(
      "input#en__field_transaction_infemail",
      "Recipient Email Address"
    );
    this.addPlaceholder("input#en__field_transaction_infcountry", "Country");
    this.addPlaceholder(
      "input#en__field_transaction_infadd1",
      "Recipient Street Address"
    );
    this.addPlaceholder(
      "input#en__field_transaction_infadd2",
      "Recipient Apt., ste., bldg."
    );
    this.addPlaceholder(
      "input#en__field_transaction_infcity",
      "Recipient City"
    );
    this.addPlaceholder(
      "input#en__field_transaction_infpostcd",
      "Recipient Postal Code"
    );
    // Miscillaneous
    this.addPlaceholder(
      "input#en__field_transaction_gftrsn",
      "Reason for your gift"
    );
    // Shipping Information
    this.addPlaceholder(
      "input#en__field_transaction_shipfname",
      "Shipping First Name"
    );
    this.addPlaceholder(
      "input#en__field_transaction_shiplname",
      "Shipping Last Name"
    );
    this.addPlaceholder(
      "input#en__field_transaction_shipemail",
      "Shipping Email Address"
    );
    this.addPlaceholder(
      "input#en__field_transaction_shipcountry",
      "Shipping Country"
    );
    this.addPlaceholder(
      "input#en__field_transaction_shipadd1",
      "Shipping Street Address"
    );
    this.addPlaceholder(
      "input#en__field_transaction_shipadd2",
      "Shipping Apt., ste., bldg."
    );
    this.addPlaceholder(
      "input#en__field_transaction_shipcity",
      "Shipping City"
    );
    this.addPlaceholder(
      "input#en__field_transaction_shipregion",
      "Shipping Region"
    );
    this.addPlaceholder(
      "input#en__field_transaction_shippostcode",
      "Shipping Postal Code"
    );
    // Billing Infromation
    this.addPlaceholder(
      "input#en__field_supporter_billingCountry",
      "Billing Country"
    );
    this.addPlaceholder(
      "input#en__field_supporter_billingAddress1",
      "Billing Street Address"
    );
    this.addPlaceholder(
      "input#en__field_supporter_billingAddress2",
      "Billing Apt., ste., bldg."
    );
    this.addPlaceholder(
      "input#en__field_supporter_billingCity",
      "Billing City"
    );
    this.addPlaceholder(
      "input#en__field_supporter_billingRegion",
      "Billing Region"
    );
    this.addPlaceholder(
      "input#en__field_supporter_billingPostcode",
      "Billing Postal Code"
    );
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
