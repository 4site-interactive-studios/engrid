// Component that adds data attributes to the Body
import { ENGrid, Country } from "./";
export class DataAttributes {
    constructor() {
        this._country = Country.getInstance();
        this.setDataAttributes();
    }
    setDataAttributes() {
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
        if (!document.querySelector(".page-backgroundImage img, .page-backgroundImage video")) {
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
        const otherAmountDiv = document.querySelector(".en__field--donationAmt .en__field__item--other");
        if (otherAmountDiv) {
            otherAmountDiv.setAttribute("data-currency-symbol", ENGrid.getCurrencySymbol());
        }
        // Add a payment type data attribute
        const paymentTypeSelect = ENGrid.getField("transaction.paymenttype");
        if (paymentTypeSelect) {
            ENGrid.setBodyData("payment-type", paymentTypeSelect.value);
            paymentTypeSelect.addEventListener("change", () => {
                ENGrid.setBodyData("payment-type", paymentTypeSelect.value);
            });
        }
        // Footer in Viewport Check
        const contentFooter = document.querySelector(".content-footer");
        if (contentFooter && ENGrid.isInViewport(contentFooter)) {
            ENGrid.setBodyData("footer-above-fold", "");
        }
        else {
            ENGrid.setBodyData("footer-below-fold", "");
        }
        // Add demo data attribute
        if (ENGrid.demo)
            ENGrid.setBodyData("demo", "");
    }
}
