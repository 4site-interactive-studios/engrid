// Component that adds data attributes to the Body

import { ENGrid, Country, DonationFrequency, EngridLogger } from ".";

export class DataAttributes {
  private logger: EngridLogger = new EngridLogger(
    "Data Attribute Changed",
    "#FFFFFF",
    "#4d9068",
    "🛠️"
  );

  private _country: Country = Country.getInstance();
  private _frequency: DonationFrequency = DonationFrequency.getInstance();
  constructor() {
    this.setDataAttributes();
  }

  private setDataAttributes() {
    // Add the Page Type as a Data Attribute on the Body Tag
    if (ENGrid.checkNested(window, "pageJson", "pageType")) {
      ENGrid.setBodyData("page-type", window.pageJson.pageType);
    }

    // Add the currency code as a Data Attribute on the Body Tag
    ENGrid.setBodyData("currency-code", ENGrid.getCurrencyCode());

    // Add a body banner data attribute if the banner contains no image or video
    if (!document.querySelector(".body-banner img, .body-banner video")) {
      ENGrid.setBodyData("body-banner", "empty");
    }

    // Add a page-alert data attribute if it is empty
    if (!document.querySelector(".page-alert *")) {
      ENGrid.setBodyData("no-page-alert", "");
    }

    // Add a content-header data attribute if it is empty
    if (!document.querySelector(".content-header *")) {
      ENGrid.setBodyData("no-content-header", "");
    }

    // Add a body-headerOutside data attribute if it is empty
    if (!document.querySelector(".body-headerOutside *")) {
      ENGrid.setBodyData("no-body-headerOutside", "");
    }

    // Add a body-header data attribute if it is empty
    if (!document.querySelector(".body-header *")) {
      ENGrid.setBodyData("no-body-header", "");
    }

    // Add a body-title data attribute if it is empty
    if (!document.querySelector(".body-title *")) {
      ENGrid.setBodyData("no-body-title", "");
    }

    // Add a body-banner data attribute if it is empty
    if (!document.querySelector(".body-banner *")) {
      ENGrid.setBodyData("no-body-banner", "");
    }

    // Add a body-bannerOverlay data attribute if it is empty
    if (!document.querySelector(".body-bannerOverlay *")) {
      ENGrid.setBodyData("no-body-bannerOverlay", "");
    }

    // Add a body-top data attribute if it is empty
    if (!document.querySelector(".body-top *")) {
      ENGrid.setBodyData("no-body-top", "");
    }

    // Add a body-main data attribute if it is empty
    if (!document.querySelector(".body-main *")) {
      ENGrid.setBodyData("no-body-main", "");
    }

    // Add a body-bottom data attribute if it is empty
    if (!document.querySelector(".body-bottom *")) {
      ENGrid.setBodyData("no-body-bottom", "");
    }

    // Add a body-footer data attribute if it is empty
    if (!document.querySelector(".body-footer *")) {
      ENGrid.setBodyData("no-body-footer", "");
    }

    // Add a body-footerOutside data attribute if it is empty
    if (!document.querySelector(".body-footerOutside *")) {
      ENGrid.setBodyData("no-body-footerOutside", "");
    }

    // Add a content-footerSpacer data attribute if it is empty
    if (!document.querySelector(".content-footerSpacer *")) {
      ENGrid.setBodyData("no-content-footerSpacer", "");
    }

    // Add a content-preFooter data attribute if it is empty
    if (!document.querySelector(".content-preFooter *")) {
      ENGrid.setBodyData("no-content-preFooter", "");
    }

    // Add a content-footer data attribute if it is empty
    if (!document.querySelector(".content-footer *")) {
      ENGrid.setBodyData("no-content-footer", "");
    }

    // Add a page-backgroundImage banner data attribute if the page background image contains no image or video
    if (
      !document.querySelector(
        ".page-backgroundImage img, .page-backgroundImage video"
      )
    ) {
      ENGrid.setBodyData("no-page-backgroundImage", "");
    }

    // Add a page-backgroundImageOverlay data attribute if it is empty
    if (!document.querySelector(".page-backgroundImageOverlay *")) {
      ENGrid.setBodyData("no-page-backgroundImageOverlay", "");
    }

    // Add a page-customCode data attribute if it is empty
    if (!document.querySelector(".page-customCode *")) {
      ENGrid.setBodyData("no-page-customCode", "");
    }

    // Add a country data attribute
    if (this._country.country) {
      ENGrid.setBodyData("country", this._country.country);
      this._country.onCountryChange.subscribe((country) => {
        ENGrid.setBodyData("country", country);
      });
    }
    const otherAmountDiv = document.querySelector(
      ".en__field--donationAmt .en__field__item--other"
    );
    if (otherAmountDiv) {
      otherAmountDiv.setAttribute(
        "data-currency-symbol",
        ENGrid.getCurrencySymbol()
      );
    }
    // Add a payment type data attribute
    const paymentTypeSelect = ENGrid.getField(
      "transaction.paymenttype"
    ) as HTMLSelectElement;
    if (paymentTypeSelect) {
      ENGrid.setBodyData("payment-type", paymentTypeSelect.value);
      paymentTypeSelect.addEventListener("change", () => {
        ENGrid.setBodyData("payment-type", paymentTypeSelect.value);
      });
    }
    // Footer in Viewport Check
    const contentFooter = document.querySelector(
      ".content-footer"
    ) as HTMLElement;
    if (contentFooter && ENGrid.isInViewport(contentFooter)) {
      ENGrid.setBodyData("footer-above-fold", "");
    } else {
      ENGrid.setBodyData("footer-below-fold", "");
    }

    // Add demo data attribute
    if (ENGrid.demo) ENGrid.setBodyData("demo", "");

    // Add data-first-page and data-last-page
    if (ENGrid.getPageNumber() === 1) {
      ENGrid.setBodyData("first-page", "");
    }
    if (ENGrid.getPageNumber() === ENGrid.getPageCount()) {
      ENGrid.setBodyData("last-page", "");
    }
    // "Temporary solutions are forever, you know..."
    // - Fernando Santos
    // "I know, but what if we just..."
    // - Bryan Casler

    // Add data attribute if browser does not support :has selector
    if (!CSS.supports("selector(:has(*))")) {
      ENGrid.setBodyData("css-has-selector", "false");
    }
    if (ENGrid.getPageType() === "DONATION") {
      this.addFrequencyDataAttribute();
      this.addGiftAmountDataAttribute();
    }
  }
  // Add a data attribute to the body tag with how many visible frequency options there are
  private addFrequencyDataAttribute() {
    const frequencyOptions = document.querySelectorAll(
      ".en__field--recurrfreq .en__field__item label.en__field__label"
    ) as NodeListOf<HTMLLabelElement>;
    let visibleFrequencyOptions = 0;
    frequencyOptions.forEach((option) => {
      if (ENGrid.isVisible(option)) {
        visibleFrequencyOptions++;
      }
    });
    ENGrid.setBodyData("visible-frequency", visibleFrequencyOptions.toString());
  }
  // Add a data attribute to the body tag with how many visible gift amount options there are
  private addGiftAmountDataAttribute() {
    const updateGiftAmountData = () => {
      const giftAmountOptions = document.querySelectorAll(
        ".en__field--donationAmt .en__field__element .en__field__item"
      ) as NodeListOf<HTMLElement>;
      let visibleGiftAmountOptions = 0;
      giftAmountOptions.forEach((option) => {
        if (ENGrid.isVisible(option)) {
          visibleGiftAmountOptions++;
        }
      });
      ENGrid.setBodyData("visible-gift-amount", visibleGiftAmountOptions.toString());
      this.logger.log("Visible Gift Amount Changed to: " + visibleGiftAmountOptions.toString());
    };

    // Initial update
    updateGiftAmountData();

    // Observe changes in the donation amount section
    const observer = new MutationObserver(updateGiftAmountData);
    const targetNode = document.querySelector(".en__field--donationAmt");
    
    if (targetNode) {
      observer.observe(targetNode, {
        childList: true,
        subtree: true,
        attributes: true,
      });
    }

    // Run update updateGiftAmountData when frequency changes
    this._frequency.onFrequencyChange.subscribe(() => {
      setTimeout(() => {
        updateGiftAmountData();
      }, 10);
    });
  }
}
