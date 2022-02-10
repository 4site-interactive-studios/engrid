import { SimpleEventDispatcher } from "strongly-typed-events";

export class DonationAmount {
  private _onAmountChange = new SimpleEventDispatcher<number>();
  private _amount: number = 0;
  private _radios: string = "";
  private _other: string = "";
  private _dispatch: boolean = true;
  private static instance: DonationAmount;

  private constructor(
    radios = "transaction.donationAmt",
    other = "transaction.donationAmt.other"
  ) {
    this._other = other;
    this._radios = radios;
    // Watch Radios Inputs for Changes
    document.addEventListener("change", (e: Event) => {
      const element = e.target as HTMLInputElement;
      if (element && element.name == radios) {
        this.amount = parseFloat(element.value);
      }
    });
    // Watch Other Amount Field
    const otherField = document.querySelector(
      `[name='${this._other}']`
    ) as HTMLInputElement;
    if (otherField) {
      otherField.addEventListener("keyup", (e: Event) => {
        this.amount = parseFloat(otherField.value);
      });
    }
  }

  public static getInstance(
    radios = "transaction.donationAmt",
    other = "transaction.donationAmt.other"
  ): DonationAmount {
    if (!DonationAmount.instance) {
      DonationAmount.instance = new DonationAmount(radios, other);
    }

    return DonationAmount.instance;
  }

  get amount(): number {
    return this._amount;
  }

  // Every time we set an amount, trigger the onAmountChange event
  set amount(value: number) {
    this._amount = value || 0;
    if (this._dispatch) this._onAmountChange.dispatch(this._amount);
  }

  public get onAmountChange() {
    return this._onAmountChange.asEvent();
  }

  // Set amount var with currently selected amount
  public load() {
    const currentAmountField = document.querySelector(
      'input[name="' + this._radios + '"]:checked'
    ) as HTMLInputElement;
    if (currentAmountField && currentAmountField.value) {
      let currentAmountValue = parseFloat(currentAmountField.value);

      if (currentAmountValue > 0) {
        this.amount = parseFloat(currentAmountField.value);
      } else {
        const otherField = document.querySelector(
          'input[name="' + this._other + '"]'
        ) as HTMLInputElement;
        currentAmountValue = parseFloat(otherField.value);
        this.amount = parseFloat(otherField.value);
      }
    }
  }
  // Force a new amount
  public setAmount(amount: number, dispatch: boolean = true) {
    // Run only if it is a Donation Page with a Donation Amount field
    if (!document.getElementsByName(this._radios).length) {
      return;
    }
    // Set dispatch to be checked by the SET method
    this._dispatch = dispatch;
    // Search for the current amount on radio boxes
    let found = Array.from(
      document.querySelectorAll('input[name="' + this._radios + '"]')
    ).filter(
      (el) => el instanceof HTMLInputElement && parseInt(el.value) == amount
    );
    // We found the amount on the radio boxes, so check it
    if (found.length) {
      const amountField = found[0] as HTMLInputElement;
      amountField.checked = true;
      // Clear OTHER text field
      this.clearOther();
    } else {
      const otherField = document.querySelector(
        'input[name="' + this._other + '"]'
      ) as HTMLInputElement;
      otherField.focus();
      otherField.value = parseFloat(amount.toString()).toFixed(2);
    }
    // Set the new amount and trigger all live variables
    this.amount = amount;
    // Revert dispatch to default value (true)
    this._dispatch = true;
  }
  // Clear Other Field
  public clearOther() {
    const otherField = document.querySelector(
      'input[name="' + this._other + '"]'
    ) as HTMLInputElement;
    otherField.value = "";
    const otherWrapper = otherField.parentNode as HTMLElement;
    otherWrapper.classList.add("en__field__item--hidden");
  }
}
