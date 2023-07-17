import { ENGrid } from "./engrid";

export class DigitalWallets {
  constructor() {
    //digital wallets not enabled.
    if (!document.getElementById("en__digitalWallet")) {
      ENGrid.setBodyData("payment-type-option-apple-pay", "false");
      ENGrid.setBodyData("payment-type-option-google-pay", "false");
      ENGrid.setBodyData("payment-type-option-paypal-one-touch", "false");
      ENGrid.setBodyData("payment-type-option-venmo", "false");
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
