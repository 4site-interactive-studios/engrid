export const body = document.body;
export const enGrid = document.getElementById("engrid") as HTMLElement;
export const enInput = (() => {
  /************************************
   * Globablly Scoped Constants and Variables
   ***********************************/

  // @TODO Needs to be expanded to bind other EN elements (checkbox, radio) and compound elements (split-text, split-select, select with other input, etc...)
  // @TODO A "Not" condition is needed for #en__field_transaction_email because someone could name their email opt in "Email" and it will get the .en_field--email class generated for it
  // get DOM elements
  const init = () => {
    const formInput = document.querySelectorAll(
      ".en__field--text, .en__field--email:not(.en__field--checkbox), .en__field--telephone, .en__field--number, .en__field--textarea, .en__field--select, .en__field--checkbox"
    );
    Array.from(formInput).forEach((e) => {
      // @TODO Currently checkboxes always return as having a value, since they do but they're just not checked. Need to update and account for that, should also do Radio's while we're at it
      let element = e.querySelector("input, textarea, select") as
        | HTMLInputElement
        | HTMLSelectElement
        | HTMLTextAreaElement;
      if (element && element.value) {
        e.classList.add("has-value");
      }
      bindEvents(e);
    });
  };

  return {
    init: init,
  };
})();

export const bindEvents = (e: Element) => {
  /* @TODO */
  /************************************
   * INPUT, TEXTAREA, AND SELECT ACTIVITY CLASSES (FOCUS AND BLUR)
   * NOTE: STILL NEEDS WORK TO FUNCTION ON "SPLIT" CUSTOM EN FIELDS
   * REF: https://developer.mozilla.org/en-US/docs/Web/API/Element/blur_event
   ***********************************/

  // Occurs when an input field gets focus
  const handleFocus = (e: Event) => {
    const target = e.target as HTMLInputElement | HTMLTextAreaElement;
    if (target && target.parentNode && target.parentNode.parentNode) {
      const targetWrapper = target.parentNode.parentNode as HTMLElement;
      targetWrapper.classList.add("has-focus");
    }
  };

  // Occurs when a user leaves an input field
  const handleBlur = (e: Event) => {
    const target = e.target as HTMLInputElement | HTMLTextAreaElement;
    if (target && target.parentNode && target.parentNode.parentNode) {
      const targetWrapper = target.parentNode.parentNode as HTMLElement;
      targetWrapper.classList.remove("has-focus");
      if (target.value) {
        targetWrapper.classList.add("has-value");
      } else {
        targetWrapper.classList.remove("has-value");
      }
    }
  };

  // Occurs when a user changes the selected option of a <select> element
  const handleChange = (e: Event) => {
    const target = e.target as HTMLSelectElement;
    if (target && target.parentNode && target.parentNode.parentNode) {
      const targetWrapper = target.parentNode.parentNode as HTMLElement;
      targetWrapper.classList.add("has-value");
    }
  };

  // Occurs when a text or textarea element gets user input
  const handleInput = (e: Event) => {
    const target = e.target as HTMLInputElement | HTMLTextAreaElement;
    if (target && target.parentNode && target.parentNode.parentNode) {
      const targetWrapper = target.parentNode.parentNode as HTMLElement;
      targetWrapper.classList.add("has-value");
    }
  };

  // Occurs when the web browser autofills a form fields
  // REF: engrid-autofill.scss
  // REF: https://medium.com/@brunn/detecting-autofilled-fields-in-javascript-aed598d25da7
  const onAutoFillStart = (e: any) => {
    e.parentNode.parentNode.classList.add("is-autofilled", "has-value");
  };

  const onAutoFillCancel = (e: any) =>
    e.parentNode.parentNode.classList.remove("is-autofilled", "has-value");
  const onAnimationStart = (e: any) => {
    const target = e.target as HTMLElement;
    const animation = e.animationName;
    switch (animation) {
      case "onAutoFillStart":
        return onAutoFillStart(target);
      case "onAutoFillCancel":
        return onAutoFillCancel(target);
    }
  };

  const enField = e.querySelector("input, textarea, select") as
    | HTMLInputElement
    | HTMLTextAreaElement
    | HTMLSelectElement;
  if (enField) {
    enField.addEventListener("focus", handleFocus);
    enField.addEventListener("blur", handleBlur);
    enField.addEventListener("change", handleChange);
    enField.addEventListener("input", handleInput);
    enField.addEventListener("animationstart", onAnimationStart);
  }
};

export const removeClassesByPrefix = (el: HTMLElement, prefix: string) => {
  for (var i = el.classList.length - 1; i >= 0; i--) {
    if (el.classList[i].startsWith(prefix)) {
      el.classList.remove(el.classList[i]);
    }
  }
};

export const inputPlaceholder = () => {
  // Personal Information
  let enFieldFirstName = document.querySelector(
    "input#en__field_supporter_firstName"
  ) as HTMLInputElement;
  let enFieldLastName = document.querySelector(
    "input#en__field_supporter_lastName"
  ) as HTMLInputElement;
  let enFieldEmailAddress = document.querySelector(
    "input#en__field_supporter_emailAddress"
  ) as HTMLInputElement;
  let enFieldPhoneNumber = document.querySelector(
    "input#en__field_supporter_phoneNumber"
  ) as HTMLInputElement;
  let enFieldPhoneNumberRequired = document.querySelector(
    ".en__mandatory > * > input#en__field_supporter_phoneNumber"
  ) as HTMLInputElement;
  let enFieldPhoneNumber2 = document.querySelector(
    "input#en__field_supporter_phoneNumber2"
  ) as HTMLInputElement;
  let enFieldPhoneNumber2Required = document.querySelector(
    ".en__mandatory > * > input#en__field_supporter_phoneNumber2"
  ) as HTMLInputElement;
  let enFieldPhoneNumber2HideOptionalPlaceholder = document.querySelector(
    ".hide-optional-phone-placeholder [name='supporter.phoneNumber2']"
  ) as HTMLInputElement;

  // Address
  let enFieldCountry = document.querySelector(
    "input#en__field_supporter_country"
  ) as HTMLInputElement;
  let enFieldAddress1 = document.querySelector(
    "input#en__field_supporter_address1"
  ) as HTMLInputElement;
  let enFieldAddress2 = document.querySelector(
    "input#en__field_supporter_address2"
  ) as HTMLInputElement;
  let enFieldCity = document.querySelector(
    "input#en__field_supporter_city"
  ) as HTMLInputElement;
  let enFieldRegion = document.querySelector(
    "input#en__field_supporter_region"
  ) as HTMLInputElement;
  let enFieldPostcode = document.querySelector(
    "input#en__field_supporter_postcode"
  ) as HTMLInputElement;

  // Donation
  let enFieldDonationAmt = document.querySelector(
    ".en__field--donationAmt.en__field--withOther .en__field__input--other"
  ) as HTMLInputElement;
  let enFieldCcnumber = document.querySelector(
    "input#en__field_transaction_ccnumber"
  ) as HTMLInputElement;
  let enFieldCcexpire = document.querySelector(
    "input#en__field_transaction_ccexpire"
  ) as HTMLInputElement;
  let enFieldCcvv = document.querySelector(
    "input#en__field_transaction_ccvv"
  ) as HTMLInputElement;
  let enFieldBankAccountNumber = document.querySelector(
    "input#en__field_supporter_bankAccountNumber"
  ) as HTMLInputElement;
  let enFieldBankRoutingNumber = document.querySelector(
    "input#en__field_supporter_bankRoutingNumber"
  ) as HTMLInputElement;

  // In Honor
  let enFieldHonname = document.querySelector(
    "input#en__field_transaction_honname"
  ) as HTMLInputElement;
  let enFieldInfname = document.querySelector(
    "input#en__field_transaction_infname"
  ) as HTMLInputElement;
  let enFieldInfemail = document.querySelector(
    "input#en__field_transaction_infemail"
  ) as HTMLInputElement;
  let enFieldInfcountry = document.querySelector(
    "input#en__field_transaction_infcountry"
  ) as HTMLInputElement;
  let enFieldInfadd1 = document.querySelector(
    "input#en__field_transaction_infadd1"
  ) as HTMLInputElement;
  let enFieldInfadd2 = document.querySelector(
    "input#en__field_transaction_infadd2"
  ) as HTMLInputElement;
  let enFieldInfcity = document.querySelector(
    "input#en__field_transaction_infcity"
  ) as HTMLInputElement;
  let enFieldInfpostcd = document.querySelector(
    "input#en__field_transaction_infpostcd"
  ) as HTMLInputElement;

  // Miscillaneous
  let enFieldGftrsn = document.querySelector(
    "input#en__field_transaction_gftrsn"
  ) as HTMLInputElement;

  // Shipping Infromation
  let enFieldShippingFirstName = document.querySelector(
    "input#en__field_transaction_shipfname"
  ) as HTMLInputElement;
  let enFieldShippingLastName = document.querySelector(
    "input#en__field_transaction_shiplname"
  ) as HTMLInputElement;
  let enFieldShippingEmailAddress = document.querySelector(
    "input#en__field_transaction_shipemail"
  ) as HTMLInputElement;
  let enFieldShippingCountry = document.querySelector(
    "input#en__field_transaction_shipcountry"
  ) as HTMLInputElement;
  let enFieldShippingAddress1 = document.querySelector(
    "input#en__field_transaction_shipadd1"
  ) as HTMLInputElement;
  let enFieldShippingAddress2 = document.querySelector(
    "input#en__field_transaction_shipadd2"
  ) as HTMLInputElement;
  let enFieldShippingCity = document.querySelector(
    "input#en__field_transaction_shipcity"
  ) as HTMLInputElement;
  let enFieldShippingRegion = document.querySelector(
    "input#en__field_transaction_shipregion"
  ) as HTMLInputElement;
  let enFieldShippingPostcode = document.querySelector(
    "input#en__field_transaction_shippostcode"
  ) as HTMLInputElement;

  // Billing Infromation
  let enFieldBillingCountry = document.querySelector(
    "input#en__field_supporter_billingCountry"
  ) as HTMLInputElement;
  let enFieldBillingAddress1 = document.querySelector(
    "input#en__field_supporter_billingAddress1"
  ) as HTMLInputElement;
  let enFieldBillingAddress2 = document.querySelector(
    "input#en__field_supporter_billingAddress2"
  ) as HTMLInputElement;
  let enFieldBillingCity = document.querySelector(
    "input#en__field_supporter_billingCity"
  ) as HTMLInputElement;
  let enFieldBillingRegion = document.querySelector(
    "input#en__field_supporter_billingRegion"
  ) as HTMLInputElement;
  let enFieldBillingPostcode = document.querySelector(
    "input#en__field_supporter_billingPostcode"
  ) as HTMLInputElement;

  // CHANGE FIELD INPUT TYPES
  if (enFieldDonationAmt) {
    enFieldDonationAmt.setAttribute("inputmode", "decimal");
  }

  // ADD THE MISSING LABEL FOR IMPROVED ACCESSABILITY
  if (enFieldDonationAmt) {
    enFieldDonationAmt.setAttribute(
      "aria-label",
      "Enter your custom donation amount"
    );
  }

  // ADD FIELD PLACEHOLDERS
  const enAddInputPlaceholder = document.querySelector(
    "[data-engrid-add-input-placeholders]"
  ) as HTMLDataElement;

  // Personal Information
  if (enAddInputPlaceholder && enFieldFirstName) {
    enFieldFirstName.placeholder = "First Name";
  }
  if (enAddInputPlaceholder && enFieldLastName) {
    enFieldLastName.placeholder = "Last Name";
  }
  if (enAddInputPlaceholder && enFieldEmailAddress) {
    enFieldEmailAddress.placeholder = "Email Address";
  }
  if (
    enAddInputPlaceholder &&
    enFieldPhoneNumber &&
    enFieldPhoneNumberRequired
  ) {
    enFieldPhoneNumber.placeholder = "Phone Number";
  } else if (
    enAddInputPlaceholder &&
    enFieldPhoneNumber &&
    !enFieldPhoneNumberRequired
  ) {
    enFieldPhoneNumber.placeholder = "Phone Number (Optional)";
  }
  if (
    enAddInputPlaceholder &&
    enFieldPhoneNumber2 &&
    enFieldPhoneNumber2Required
  ) {
    enFieldPhoneNumber2.placeholder = "000-000-0000";
  } else if (
    enAddInputPlaceholder &&
    enFieldPhoneNumber2 &&
    !enFieldPhoneNumber2Required &&
    enFieldPhoneNumber2HideOptionalPlaceholder
  ) {
    enFieldPhoneNumber2.placeholder = "000-000-0000";
  } else if (
    enAddInputPlaceholder &&
    enFieldPhoneNumber2 &&
    !enFieldPhoneNumber2Required
  ) {
    enFieldPhoneNumber2.placeholder = "000-000-0000 (Optional)";
  }

  // Address
  if (enAddInputPlaceholder && enFieldCountry) {
    enFieldCountry.placeholder = "Country";
  }
  if (enAddInputPlaceholder && enFieldAddress1) {
    enFieldAddress1.placeholder = "Street Address";
  }
  if (enAddInputPlaceholder && enFieldAddress2) {
    enFieldAddress2.placeholder = "Apt., ste., bldg.";
  }
  if (enAddInputPlaceholder && enFieldCity) {
    enFieldCity.placeholder = "City";
  }
  if (enAddInputPlaceholder && enFieldRegion) {
    enFieldRegion.placeholder = "Region";
  }
  if (enAddInputPlaceholder && enFieldPostcode) {
    enFieldPostcode.placeholder = "Postal Code";
  }

  // Donation
  if (enAddInputPlaceholder && enFieldDonationAmt) {
    enFieldDonationAmt.placeholder = "Other";
  }
  if (enAddInputPlaceholder && enFieldCcnumber) {
    enFieldCcnumber.placeholder = "•••• •••• •••• ••••";
  }
  if (enAddInputPlaceholder && enFieldCcexpire) {
    enFieldCcexpire.placeholder = "MM / YY";
  }
  if (enAddInputPlaceholder && enFieldCcvv) {
    enFieldCcvv.placeholder = "CVV";
  }
  if (enAddInputPlaceholder && enFieldBankAccountNumber) {
    enFieldBankAccountNumber.placeholder = "Bank Account Number";
  }
  if (enAddInputPlaceholder && enFieldBankRoutingNumber) {
    enFieldBankRoutingNumber.placeholder = "Bank Routing Number";
  }

  // In Honor
  if (enAddInputPlaceholder && enFieldHonname) {
    enFieldHonname.placeholder = "Honoree Name";
  }
  if (enAddInputPlaceholder && enFieldInfname) {
    enFieldInfname.placeholder = "Recipient Name";
  }
  if (enAddInputPlaceholder && enFieldInfemail) {
    enFieldInfemail.placeholder = "Recipient Email Address";
  }
  if (enAddInputPlaceholder && enFieldInfcountry) {
    enFieldInfcountry.placeholder = "Country";
  }
  if (enAddInputPlaceholder && enFieldInfadd1) {
    enFieldInfadd1.placeholder = "Recipient Street Address";
  }
  if (enAddInputPlaceholder && enFieldInfadd2) {
    enFieldInfadd2.placeholder = "Recipient Apt., ste., bldg.";
  }
  if (enAddInputPlaceholder && enFieldInfcity) {
    enFieldInfcity.placeholder = "Recipient City";
  }
  if (enAddInputPlaceholder && enFieldInfpostcd) {
    enFieldInfpostcd.placeholder = "Recipient Postal Code";
  }

  // Miscillaneous
  if (enAddInputPlaceholder && enFieldGftrsn) {
    enFieldGftrsn.placeholder = "Reason for your gift";
  }

  // Shipping Infromation
  if (enAddInputPlaceholder && enFieldShippingFirstName) {
    enFieldShippingFirstName.placeholder = "Shipping First Name";
  }
  if (enAddInputPlaceholder && enFieldShippingLastName) {
    enFieldShippingLastName.placeholder = "Shipping Last Name";
  }
  if (enAddInputPlaceholder && enFieldShippingEmailAddress) {
    enFieldShippingEmailAddress.placeholder = "Shipping Email Address";
  }
  if (enAddInputPlaceholder && enFieldShippingCountry) {
    enFieldShippingCountry.placeholder = "Shipping Country";
  }
  if (enAddInputPlaceholder && enFieldShippingAddress1) {
    enFieldShippingAddress1.placeholder = "Shipping Street Address";
  }
  if (enAddInputPlaceholder && enFieldShippingAddress2) {
    enFieldShippingAddress2.placeholder = "Shipping Apt., ste., bldg.";
  }
  if (enAddInputPlaceholder && enFieldShippingCity) {
    enFieldShippingCity.placeholder = "Shipping City";
  }
  if (enAddInputPlaceholder && enFieldShippingRegion) {
    enFieldShippingRegion.placeholder = "Shipping Region";
  }
  if (enAddInputPlaceholder && enFieldShippingPostcode) {
    enFieldShippingPostcode.placeholder = "Shipping Postal Code";
  }

  // Billing Information
  if (enAddInputPlaceholder && enFieldBillingCountry) {
    enFieldBillingCountry.placeholder = "Billing Country";
  }
  if (enAddInputPlaceholder && enFieldBillingAddress1) {
    enFieldBillingAddress1.placeholder = "Billing Street Address";
  }
  if (enAddInputPlaceholder && enFieldBillingAddress2) {
    enFieldBillingAddress2.placeholder = "Billing Apt., ste., bldg.";
  }
  if (enAddInputPlaceholder && enFieldBillingCity) {
    enFieldBillingCity.placeholder = "Billing City";
  }
  if (enAddInputPlaceholder && enFieldBillingRegion) {
    enFieldBillingRegion.placeholder = "Billing Region";
  }
  if (enAddInputPlaceholder && enFieldBillingPostcode) {
    enFieldBillingPostcode.placeholder = "Billing Postal Code";
  }
};

export const preventAutocomplete = () => {
  let enFieldDonationAmt = document.querySelector(
    ".en__field--donationAmt.en__field--withOther .en__field__input--other"
  ) as HTMLInputElement;
  if (enFieldDonationAmt) {
    enFieldDonationAmt.setAttribute("autocomplete", "off");
  }
  if (enFieldDonationAmt) {
    enFieldDonationAmt.setAttribute("data-lpignore", "true");
  }
};

export const watchInmemField = () => {
  const enFieldTransactionInmem = document.getElementById(
    "en__field_transaction_inmem"
  ) as HTMLInputElement;

  const handleEnFieldTransactionInmemChange = (e: Event) => {
    if (enGrid) {
      if (enFieldTransactionInmem.checked) {
        enGrid.classList.add("has-give-in-honor");
      } else {
        enGrid.classList.remove("has-give-in-honor");
      }
    }
  };

  // Check Give In Honor State on Page Load
  if (enFieldTransactionInmem && enGrid) {
    // Run on page load
    if (enFieldTransactionInmem.checked) {
      enGrid.classList.add("has-give-in-honor");
    } else {
      enGrid.classList.remove("has-give-in-honor");
    }

    // Run on change
    enFieldTransactionInmem.addEventListener(
      "change",
      handleEnFieldTransactionInmemChange
    );
  }
};

// EN Polyfill to support "label" clicking on Advocacy Recipient "labels"
export const contactDetailLabels = () => {
  const contact = document.querySelectorAll(
    ".en__contactDetails__rows"
  ) as NodeList;

  // @TODO Needs refactoring. Has to be a better way to do this.
  const recipientChange = (e: Event) => {
    let recipientRow = e.target as HTMLDivElement;
    // console.log("recipientChange: recipientRow: ", recipientRow);
    let recipientRowWrapper = recipientRow.parentNode as HTMLDivElement;
    // console.log("recipientChange: recipientRowWrapper: ", recipientRowWrapper);
    let recipientRowsWrapper = recipientRowWrapper.parentNode as HTMLDivElement;
    // console.log("recipientChange: recipientRowsWrapper: ", recipientRowsWrapper);
    let contactDetails = recipientRowsWrapper.parentNode as HTMLDivElement;
    // console.log("recipientChange: contactDetails: ", contactDetails);
    let contactDetailsCheckbox = contactDetails.querySelector(
      "input"
    ) as HTMLInputElement;
    // console.log("recipientChange: contactDetailsCheckbox: ", contactDetailsCheckbox);
    if (contactDetailsCheckbox.checked) {
      contactDetailsCheckbox.checked = false;
    } else {
      contactDetailsCheckbox.checked = true;
    }
  };

  if (contact) {
    Array.from(contact).forEach((e) => {
      let element = e as HTMLDivElement;
      element.addEventListener("click", recipientChange);
    });
  }
};

// @TODO Adds a URL path "/edit" that can be used to easily arrive at the editable version of the current page. Should automatically detect if the client is using us.e-activist or e-activist and adjust accoridngly. Should also pass in page number and work for all page types without each needing to be specified.
// @TODO Remove hard coded client values
export const easyEdit = () => {
  const liveURL = window.location.href as string;
  let editURL = "" as string;
  if (liveURL.search("edit") !== -1) {
    if (liveURL.includes("https://act.ran.org/page/")) {
      editURL = liveURL.replace(
        "https://act.ran.org/page/",
        "https://us.e-activist.com/index.html#pages/"
      );
      editURL = editURL.replace("/donate/1", "/edit");
      editURL = editURL.replace("/action/1", "/edit");
      editURL = editURL.replace("/data/1", "/edit");
      window.location.href = editURL;
    }
  }
};

// If you go to and Engaging Networks Unsubscribe page anonymously
// then the fields are in their default states. If you go to it via an email
// link that authenticates who you are, it then populates the fields with corresponding
// values from your account. This means to unsubscribe the user has to uncheck the
// newsletter checkbox(s) before submitting.

export const simpleUnsubscribe = () => {
  // console.log("simpleUnsubscribe fired");

  // Check if we're on an Unsubscribe / Manage Subscriptions page
  if (window.location.href.indexOf("/subscriptions") != -1) {
    // console.log("On an subscription management page");

    // Check if any form elements on this page have the "forceUncheck" class
    const forceUncheck = document.querySelectorAll(".forceUncheck");
    if (forceUncheck) {
      // console.log("Found forceUnchecl dom elements", forceUncheck);

      // Step through each DOM element with forceUncheck looking for checkboxes
      Array.from(forceUncheck).forEach((e) => {
        let element = e as HTMLElement;
        // console.log("Checking this formComponent for checkboxes", element);

        // In the forceUncheck form component, find any checboxes
        let uncheckCheckbox = element.querySelectorAll(
          "input[type='checkbox']"
        );
        if (uncheckCheckbox) {
          // Step through each Checkbox in the forceUncheck form component
          Array.from(uncheckCheckbox).forEach((f) => {
            let checkbox = f as HTMLInputElement;
            // console.log("Unchecking this checkbox", checkbox);
            // Uncheck the checbox
            checkbox.checked = false;
          });
        }
      });
    }
  }
};

// Watch the Region Field for changes. If there is only one option, hide it.
// @TODO Should this be expanded where if a select only has one option it's always hidden?
const country_select = document.getElementById(
  "en__field_supporter_country"
) as HTMLSelectElement;
const region_select = document.getElementById(
  "en__field_supporter_region"
) as HTMLSelectElement;
if (country_select) {
  country_select.addEventListener("change", () => {
    setTimeout(() => {
      if (
        region_select.options.length == 1 &&
        region_select.options[0].value == "other"
      ) {
        region_select.classList.add("hide");
      } else {
        region_select.classList.remove("hide");
      }
    }, 100);
  });
}

// @TODO "Footer in Viewport Check" should be made its own TS file
const contentFooter = document.querySelector(".content-footer");

const isInViewport = (e: any) => {
  const distance = e.getBoundingClientRect();
  // console.log("Footer: ", distance);
  return (
    distance.top >= 0 &&
    distance.left >= 0 &&
    distance.bottom <=
      (window.innerHeight || document.documentElement.clientHeight) &&
    distance.right <=
      (window.innerWidth || document.documentElement.clientWidth)
  );
};

// Checks to see if the page is so short, the footer is above the fold. If the footer is above the folde we'll use this class to ensure at a minimum the page fills the full viewport height.
if (contentFooter && isInViewport(contentFooter)) {
  document.body.setAttribute("data-engrid-footer-above-fold", "");
} else {
  document.body.setAttribute("data-engrid-footer-below-fold", "");
}
