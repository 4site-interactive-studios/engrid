import { ENGrid } from "./engrid";
import { EnForm } from "./events";
import { EngridLogger } from "./logger";
export class DigitalWallets {
    constructor() {
        this.logger = new EngridLogger("DigitalWallets", "#fff", "#333", "👛");
        this._form = EnForm.getInstance();
        //digital wallets not enabled.
        if (!document.getElementById("en__digitalWallet")) {
            ENGrid.setBodyData("payment-type-option-stripedigitalwallet", "false");
            ENGrid.setBodyData("payment-type-option-apple-pay", "false");
            ENGrid.setBodyData("payment-type-option-google-pay", "false");
            ENGrid.setBodyData("payment-type-option-paypal-one-touch", "false");
            ENGrid.setBodyData("payment-type-option-venmo", "false");
            ENGrid.setBodyData("payment-type-option-daf", "false");
            this.logger.log("No digital wallet container found, skipping digital wallet setup.");
            return;
        }
        // Add giveBySelect classes to the separate wallet containers
        // and hide them on load.
        const stripeButtons = document.getElementById("en__digitalWallet__stripeButtons__container");
        if (stripeButtons) {
            stripeButtons.classList.add("giveBySelect-stripedigitalwallet");
            stripeButtons.classList.add("showif-stripedigitalwallet-selected");
            // stripeButtons.style.display = "none";
        }
        const paypalTouchButtons = document.getElementById("en__digitalWallet__paypalTouch__container");
        if (paypalTouchButtons) {
            paypalTouchButtons.classList.add("giveBySelect-paypaltouch");
            paypalTouchButtons.classList.add("showif-paypaltouch-selected");
            // paypalTouchButtons.style.display = "none";
        }
        const donorAdvisedFundButtonContainer = document.getElementById("en__digitalWallet__chariot__container");
        if (donorAdvisedFundButtonContainer) {
            donorAdvisedFundButtonContainer.classList.add("giveBySelect-daf");
            donorAdvisedFundButtonContainer.classList.add("showif-daf-selected");
        }
        /**
         * Check for presence of elements that indicated Stripe digital wallets
         * (Google Pay, Apple Pay) have loaded, and add functionality for them.
         * If they haven't yet loaded, set up a Mutation Observer to check for
         * when they do.
         */
        if (document.querySelector("#en__digitalWallet__stripeButtons__container > *")) {
            this.addStripeDigitalWallets();
        }
        else {
            ENGrid.setBodyData("payment-type-option-apple-pay", "false");
            ENGrid.setBodyData("payment-type-option-google-pay", "false");
            ENGrid.setBodyData("payment-type-option-stripedigitalwallet", "false");
            const stripeContainer = document.getElementById("en__digitalWallet__stripeButtons__container");
            if (stripeContainer) {
                this.checkForWalletsBeingAdded(stripeContainer, "stripe");
            }
            // If the default payment type is Stripe Digital Wallet and the page doesnt support it, set the payment type to Card
            const paymentType = ENGrid.getPaymentType();
            if (paymentType.toLowerCase() === "stripedigitalwallet") {
                ENGrid.setPaymentType("card");
            }
        }
        /**
         * Check for presence of elements that indicated Paypal digital wallets
         * (Paypal One Touch, Venmo, Etc) have loaded, and add functionality for them.
         * If they haven't yet loaded, set up a Mutation Observer to check for
         * when they do.
         */
        if (document.querySelector("#en__digitalWallet__paypalTouch__container > *")) {
            this.addPaypalTouchDigitalWallets();
        }
        else {
            ENGrid.setBodyData("payment-type-option-paypal-one-touch", "false");
            ENGrid.setBodyData("payment-type-option-venmo", "false");
            const paypalContainer = document.getElementById("en__digitalWallet__paypalTouch__container");
            if (paypalContainer) {
                this.checkForWalletsBeingAdded(paypalContainer, "paypalTouch");
            }
        }
        /**
         * Check for presence of elements that indicate DAF is present, and add functionality for it.
         * If it hasn't loaded yet, set up a Mutation Observer to check for when it does.
         */
        if (document.querySelector("#en__digitalWallet__chariot__container > *")) {
            this.addDAF();
        }
        else {
            ENGrid.setBodyData("payment-type-option-daf", "false");
            const donorAdvisedFundButtonContainer = document.getElementById("en__digitalWallet__chariot__container");
            if (donorAdvisedFundButtonContainer) {
                this.checkForWalletsBeingAdded(donorAdvisedFundButtonContainer, "daf");
            }
        }
    }
    addStripeDigitalWallets() {
        this.logger.log("Stripe Digital Wallets detected");
        this.addOptionToPaymentTypeField("stripedigitalwallet", "GooglePay / ApplePay");
        // ENGrid.setBodyData(
        //   "payment-type-option-apple-pay",
        //   DigitalWallets.isApplePayAvailable.toString()
        // );
        // ENGrid.setBodyData(
        //   "payment-type-option-google-pay",
        //   !DigitalWallets.isApplePayAvailable.toString()
        // );
        // TODO: Change to trustworthy detection of Google Pay & Apple Pay availability
        ENGrid.setBodyData("payment-type-option-apple-pay", "true");
        ENGrid.setBodyData("payment-type-option-google-pay", "true");
        ENGrid.setBodyData("payment-type-option-stripedigitalwallet", "true");
        this.addStripeDigitalWalletListener()
            ? this.logger.log("Stripe Digital Wallet listener added successfully")
            : this.logger.log("Failed to add Stripe Digital Wallet listener");
    }
    addPaypalTouchDigitalWallets() {
        this.logger.log("Paypal Touch Digital Wallets detected");
        this.addOptionToPaymentTypeField("paypaltouch", "Paypal / Venmo");
        ENGrid.setBodyData("payment-type-option-paypal-one-touch", "true");
        ENGrid.setBodyData("payment-type-option-venmo", "true");
        this.addPaypalOneTouchListener()
            ? this.logger.log("Paypal Touch listener added successfully")
            : this.logger.log("Failed to add Paypal Touch listener");
    }
    addDAF() {
        this.logger.log("DAF Digital Wallet detected");
        this.addOptionToPaymentTypeField("daf", "Donor Advised Fund");
        ENGrid.setBodyData("payment-type-option-daf", "true");
        this.addDAFListener()
            ? this.logger.log("DAF listener added successfully")
            : this.logger.log("Failed to add DAF listener");
    }
    addOptionToPaymentTypeField(value, label) {
        const paymentTypeField = document.querySelector('[name="transaction.paymenttype"]');
        if (paymentTypeField &&
            !paymentTypeField.querySelector(`[value=${value}]`)) {
            const walletOption = document.createElement("option");
            walletOption.value = value;
            walletOption.innerText = label;
            paymentTypeField.appendChild(walletOption);
        }
        // If this payment type is set as the default on GiveBySelect, set the payment type to this value
        // We need to do this here because the digital wallets are sometimes slow to load
        const giveBySelect = document.querySelector('input[name="transaction.giveBySelect"][value="' + value + '"]');
        if (giveBySelect && giveBySelect.dataset.default === "true") {
            giveBySelect.checked = true;
            const event = new Event("change", {
                bubbles: true,
                cancelable: true,
            });
            giveBySelect.dispatchEvent(event);
        }
    }
    checkForWalletsBeingAdded(node, walletType) {
        const callback = (mutationList, observer) => {
            for (const mutation of mutationList) {
                //Once a child node has been added, set up the appropriate digital wallet
                if (mutation.type === "childList" && mutation.addedNodes.length) {
                    if (walletType === "stripe") {
                        this.addStripeDigitalWallets();
                    }
                    else if (walletType === "paypalTouch") {
                        this.addPaypalTouchDigitalWallets();
                    }
                    else if (walletType === "daf") {
                        this.addDAF();
                    }
                    //Disconnect observer and break loop to prevent multiple additions
                    observer.disconnect();
                    break;
                }
            }
        };
        const observer = new MutationObserver(callback);
        observer.observe(node, { childList: true, subtree: true });
    }
    addPaypalOneTouchListener() {
        var _a, _b, _c, _d, _e;
        const paypalTouch = (_d = (_c = (_b = (_a = window.EngagingNetworks) === null || _a === void 0 ? void 0 : _a.require) === null || _b === void 0 ? void 0 : _b._defined) === null || _c === void 0 ? void 0 : _c.enPaypalTouch) === null || _d === void 0 ? void 0 : _d.paypalTouch;
        if (!((_e = paypalTouch === null || paypalTouch === void 0 ? void 0 : paypalTouch.library) === null || _e === void 0 ? void 0 : _e.Buttons)) {
            this.logger.log("Paypal Touch library not found, cannot add listener");
            return false;
        }
        const buttons = paypalTouch.library.Buttons.bind(paypalTouch.library);
        // setTimeout(() => {
        paypalTouch.library.Buttons = (o) => buttons(Object.assign(Object.assign({}, o), { onClick: (d, a) => (this._form.dispatchIntentSubmit(),
                o.onClick && o.onClick(d, a)) }));
        paypalTouch.unloadButton && paypalTouch.unloadButton();
        paypalTouch.loadButton && paypalTouch.loadButton();
        // }, 750);
        return true;
    }
    addStripeDigitalWalletListener() {
        var _a, _b, _c, _d, _e, _f;
        return !!((_f = (_e = (_d = (_c = (_b = (_a = window.EngagingNetworks) === null || _a === void 0 ? void 0 : _a.require) === null || _b === void 0 ? void 0 : _b._defined) === null || _c === void 0 ? void 0 : _c.enStripeButtons) === null || _d === void 0 ? void 0 : _d.stripeButtons) === null || _e === void 0 ? void 0 : _e.paymentRequest) === null || _f === void 0 ? void 0 : _f.on("paymentmethod", this._form.dispatchIntentSubmit.bind(this._form)));
    }
    addDAFListener() {
        const chariotButton = document.getElementById("chariot-button");
        chariotButton === null || chariotButton === void 0 ? void 0 : chariotButton.addEventListener("click", this._form.dispatchIntentSubmit.bind(this._form));
        return !!chariotButton;
    }
}
