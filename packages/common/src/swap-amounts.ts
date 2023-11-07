// This script allows you to override the default donation amounts in Engaging Networks
// with a custom list of amounts.
/**
 * Example:
 * window.EngridAmounts = {
 *   "onetime": {
 *     amounts: {
 *       "10": 10,
 *       "30": 30,
 *       "50": 50,
 *       "100": 100,
 *       "Other": "other",
 *     },
 *     default: 30,
 *   },
 *   "monthly": {
 *     amounts: {
 *       "5": 5,
 *       "15": 15,
 *       "25": 25,
 *       "30": 30,
 *       "Other": "other",
 *     },
 *     default: 15,
 *   },
 * };
 */
import { DonationAmount, DonationFrequency, ENGrid, EngridLogger } from ".";

export class SwapAmounts {
  private logger: EngridLogger = new EngridLogger(
    "SwapAmounts",
    "purple",
    "white",
    "💰"
  );
  public _amount: DonationAmount = DonationAmount.getInstance();
  private _frequency: DonationFrequency = DonationFrequency.getInstance();
  private defaultChange: boolean = false;
  private swapped: boolean = false;
  constructor() {
    if (!this.shouldRun()) return;
    this._frequency.onFrequencyChange.subscribe(() => this.swapAmounts());
    this._amount.onAmountChange.subscribe(() => {
      if (this._frequency.frequency in window.EngridAmounts === false) return;
      this.defaultChange = false;
      if (!this.swapped) return;
      // Check if the amount is not default amount for the frequency
      if (
        this._amount.amount !=
        window.EngridAmounts[this._frequency.frequency].default
      ) {
        this.defaultChange = true;
      }
    });
  }
  swapAmounts() {
    if (this._frequency.frequency in window.EngridAmounts) {
      window.EngagingNetworks.require._defined.enjs.swapList(
        "donationAmt",
        this.loadEnAmounts(window.EngridAmounts[this._frequency.frequency]),
        {
          ignoreCurrentValue: this.ignoreCurrentValue(),
        }
      );
      this._amount.load();
      this.logger.log(
        "Amounts Swapped To",
        window.EngridAmounts[this._frequency.frequency]
      );
      this.swapped = true;
    }
  }
  loadEnAmounts(amountArray: { amounts: [string, number]; default: number }) {
    let ret = [];
    for (let amount in amountArray.amounts) {
      ret.push({
        selected: amountArray.amounts[amount] === amountArray.default,
        label: amount,
        value: amountArray.amounts[amount].toString(),
      });
    }
    return ret;
  }
  shouldRun() {
    return "EngridAmounts" in window;
  }
  ignoreCurrentValue() {
    return !(
      window.EngagingNetworks.require._defined.enjs.checkSubmissionFailed() ||
      ENGrid.getUrlParameter("transaction.donationAmt") !== null ||
      this.defaultChange
    );
  }
}
