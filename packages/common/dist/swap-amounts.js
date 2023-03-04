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
import { DonationAmount, DonationFrequency, ENGrid, EngridLogger, ProcessingFees, } from ".";
export class SwapAmounts {
    constructor() {
        this.logger = new EngridLogger("SwapAmounts", "purple", "white", "💰");
        this._amount = DonationAmount.getInstance();
        this._frequency = DonationFrequency.getInstance();
        this._fees = ProcessingFees.getInstance();
        this.logger.log("Ignore Value", this.ignoreCurrentValue());
        if (!this.shouldRun())
            return;
        this._frequency.onFrequencyChange.subscribe(() => this.swapAmounts());
    }
    swapAmounts() {
        if (this._frequency.frequency in window.EngridAmounts) {
            const loadEnAmounts = (amountArray) => {
                let ret = [];
                for (let amount in amountArray.amounts) {
                    ret.push({
                        selected: amountArray.amounts[amount] === amountArray.default,
                        label: amount,
                        value: amountArray.amounts[amount].toString(),
                    });
                }
                return ret;
            };
            window.EngagingNetworks.require._defined.enjs.swapList("donationAmt", loadEnAmounts(window.EngridAmounts[this._frequency.frequency]), {
                ignoreCurrentValue: this.ignoreCurrentValue(),
            });
            this._amount.load();
            this.logger.log("Amounts Swapped To", window.EngridAmounts[this._frequency.frequency]);
        }
    }
    shouldRun() {
        return "EngridAmounts" in window;
    }
    ignoreCurrentValue() {
        return !(window.EngagingNetworks.require._defined.enjs.checkSubmissionFailed() ||
            ENGrid.getUrlParameter("transaction.donationAmt") !== null);
    }
}
