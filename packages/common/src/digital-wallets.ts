export class DigitalWallets {
  private digitalWalletEnabled: boolean = false;

  constructor() {
    setTimeout(() => {
      this.digitalWalletEnabled =
        !!document.querySelector(
          "#en__digitalWallet__paypalTouch__container > *"
        ) ||
        !!document.querySelector(
          "#en__digitalWallet__stripeButtons__container > *"
        );

      this.init();
    }, 2500);
  }

  private init() {
    const paymentTypeField = document.querySelector(
      '[name="transaction.paymenttype"]'
    );

    if (paymentTypeField) {
      if (this.digitalWalletEnabled) {
        const walletOption = document.createElement("option");
        walletOption.value = "digitalwallet";
        walletOption.innerText = "digitalwallet";
        paymentTypeField.appendChild(walletOption);
      }
    }
  }
}
