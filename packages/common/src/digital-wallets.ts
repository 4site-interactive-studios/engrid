import { ENGrid } from "./engrid";

export class DigitalWallets {
  constructor() {
    //digital wallets not enabled.
    if (!document.getElementById("en__digitalWallet")) {
      ENGrid.setBodyData("payment-type-option-apple-pay", "false");
      ENGrid.setBodyData("payment-type-option-google-pay", "false");
      ENGrid.setBodyData("payment-type-option-paypal-one-touch", "false");
      ENGrid.setBodyData("payment-type-option-venmo", "false");
      ENGrid.setBodyData("payment-type-option-daf", "false");
      return;
    }

    // Add giveBySelect classes to the separate wallet containers
    // and hide them on load.
    const stripeButtons = document.getElementById(
      "en__digitalWallet__stripeButtons__container"
    );
    if (stripeButtons) {
      stripeButtons.classList.add("giveBySelect-stripedigitalwallet");
      stripeButtons.classList.add("showif-stripedigitalwallet-selected");
      // stripeButtons.style.display = "none";
    }
    const paypalTouchButtons = document.getElementById(
      "en__digitalWallet__paypalTouch__container"
    );
    if (paypalTouchButtons) {
      paypalTouchButtons.classList.add("giveBySelect-paypaltouch");
      paypalTouchButtons.classList.add("showif-paypaltouch-selected");
      // paypalTouchButtons.style.display = "none";
    }
    const donorAdvisedFundButtonContainer = document.getElementById(
      "en__digitalWallet__chariot__container"
    );
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
    if (
      document.querySelector("#en__digitalWallet__stripeButtons__container > *")
    ) {
      this.addStripeDigitalWallets();
    } else {
      ENGrid.setBodyData("payment-type-option-apple-pay", "false");
      ENGrid.setBodyData("payment-type-option-google-pay", "false");

      const stripeContainer = document.getElementById(
        "en__digitalWallet__stripeButtons__container"
      );

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
    if (
      document.querySelector("#en__digitalWallet__paypalTouch__container > *")
    ) {
      this.addPaypalTouchDigitalWallets();
    } else {
      ENGrid.setBodyData("payment-type-option-paypal-one-touch", "false");
      ENGrid.setBodyData("payment-type-option-venmo", "false");

      const paypalContainer = document.getElementById(
        "en__digitalWallet__paypalTouch__container"
      );

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
    } else {
      ENGrid.setBodyData("payment-type-option-daf", "false");

      const donorAdvisedFundButtonContainer = document.getElementById(
        "en__digitalWallet__chariot__container"
      );

      if (donorAdvisedFundButtonContainer) {
        this.checkForWalletsBeingAdded(donorAdvisedFundButtonContainer, "daf");
      }
    }
  }

  private addStripeDigitalWallets() {
    this.addOptionToPaymentTypeField(
      "stripedigitalwallet",
      "GooglePay / ApplePay"
    );
    ENGrid.setBodyData("payment-type-option-apple-pay", "true");
    ENGrid.setBodyData("payment-type-option-google-pay", "true");
  }

  private addPaypalTouchDigitalWallets() {
    this.addOptionToPaymentTypeField("paypaltouch", "Paypal / Venmo");
    ENGrid.setBodyData("payment-type-option-paypal-one-touch", "true");
    ENGrid.setBodyData("payment-type-option-venmo", "true");
  }

  private addDAF() {
    this.addOptionToPaymentTypeField("daf", "Donor Advised Fund");
    ENGrid.setBodyData("payment-type-option-daf", "true");
  }

  private addOptionToPaymentTypeField(value: string, label: string) {
    const paymentTypeField = document.querySelector(
      '[name="transaction.paymenttype"]'
    ) as HTMLSelectElement;

    if (
      paymentTypeField &&
      !paymentTypeField.querySelector(`[value=${value}]`)
    ) {
      const walletOption = document.createElement("option");
      walletOption.value = value;
      walletOption.innerText = label;
      paymentTypeField.appendChild(walletOption);
    }
    // If this payment type is set as the default on GiveBySelect, set the payment type to this value
    // We need to do this here because the digital wallets are sometimes slow to load
    const giveBySelect = document.querySelector(
      'input[name="transaction.giveBySelect"][value="' + value + '"]'
    ) as HTMLInputElement;
    if (giveBySelect && giveBySelect.dataset.default === "true") {
      giveBySelect.checked = true;
      const event = new Event("change", {
        bubbles: true,
        cancelable: true,
      });
      giveBySelect.dispatchEvent(event);
    }
  }

  private checkForWalletsBeingAdded(node: HTMLElement, walletType: string) {
    const callback = (
      mutationList: Array<MutationRecord>,
      observer: MutationObserver
    ) => {
      for (const mutation of mutationList) {
        //Once a child node has been added, set up the appropriate digital wallet
        if (mutation.type === "childList" && mutation.addedNodes.length) {
          if (walletType === "stripe") {
            this.addStripeDigitalWallets();
          } else if (walletType === "paypalTouch") {
            this.addPaypalTouchDigitalWallets();
          } else if (walletType === "daf") {
            this.addDAF();
          }
          //Disconnect observer to prevent multiple additions
          observer.disconnect();
        }
      }
    };

    const observer = new MutationObserver(callback);
    observer.observe(node, { childList: true, subtree: true });
  }
}
