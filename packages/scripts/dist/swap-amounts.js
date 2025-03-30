// This script allows you to override the default donation amounts in Engaging Networks
// with a custom list of amounts.
// If the URL contains a query parameter "engrid-amounts" with a comma separated values, the script will load the
// amounts from the parameter and set them as the default amounts for the donation
// form.
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
    constructor() {
        this.logger = new EngridLogger("SwapAmounts", "purple", "white", "💰");
        this._amount = DonationAmount.getInstance();
        this._frequency = DonationFrequency.getInstance();
        this.defaultChange = false;
        this.swapped = false;
        this.loadAmountsFromUrl();
        if (!this.shouldRun())
            return;
        this._frequency.onFrequencyChange.subscribe(() => this.swapAmounts());
        this._amount.onAmountChange.subscribe(() => {
            if (this._frequency.frequency in window.EngridAmounts === false)
                return;
            this.defaultChange = false;
            if (!this.swapped)
                return;
            // Check if the amount is not default amount for the frequency
            if (this._amount.amount !=
                window.EngridAmounts[this._frequency.frequency].default) {
                this.defaultChange = true;
            }
        });
    }
    loadAmountsFromUrl() {
        const urlParams = new URLSearchParams(window.location.search);
        const amounts = urlParams.get("engrid-amounts");
        if (amounts) {
            const amountArray = amounts.split(",").map((amt) => amt.trim());
            const defaultAmount = parseFloat(ENGrid.getUrlParameter("transaction.donationAmt")) || parseFloat(amountArray[0]);
            const amountsObj = {};
            for (let i = 0; i < amountArray.length; i++) {
                amountsObj[amountArray[i].toString()] = isNaN(parseFloat(amountArray[i]))
                    ? amountArray[i]
                    : parseFloat(amountArray[i]);
            }
            amountsObj["Other"] = "other";
            window.EngridAmounts = {
                onetime: { amounts: amountsObj, default: defaultAmount },
                monthly: { amounts: amountsObj, default: defaultAmount },
            };
        }
    }
    swapAmounts() {
        if (this._frequency.frequency in window.EngridAmounts) {
            window.EngagingNetworks.require._defined.enjs.swapList("donationAmt", this.loadEnAmounts(window.EngridAmounts[this._frequency.frequency]), {
                ignoreCurrentValue: this.ignoreCurrentValue(),
            });
            this._amount.load();
            this.logger.log("Amounts Swapped To", window.EngridAmounts[this._frequency.frequency]);
            this.swapped = true;
        }
    }
    loadEnAmounts(amountArray) {
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
        return !(window.EngagingNetworks.require._defined.enjs.checkSubmissionFailed() ||
            ENGrid.getUrlParameter("transaction.donationAmt") !== null ||
            this.defaultChange);
    }
}
