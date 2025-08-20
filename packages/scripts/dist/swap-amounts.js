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
 *     stickyDefault: false, // Optional. When true, every swap forces the default amount to be (re)selected
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
 *     stickyDefault: true, // Example forcing default on each frequency swap
 *   },
 * };
 */
import { DonationAmount, DonationFrequency, ENGrid, EngridLogger } from ".";
export class SwapAmounts {
    constructor() {
        this.logger = new EngridLogger("SwapAmounts", "purple", "white", "💰");
        this._amount = DonationAmount.getInstance();
        this._frequency = DonationFrequency.getInstance();
        this.defaultChange = false; // Tracks if user changed away from default after swap
        this.swapped = false; // Tracks if we've already executed at least one swap
        this.loadAmountsFromUrl();
        if (!this.shouldRun())
            return;
        // Respond when frequency changes
        this._frequency.onFrequencyChange.subscribe(() => this.swapAmounts());
        // Track if donor moves away from the swapped default amount
        this._amount.onAmountChange.subscribe(() => {
            const configs = window.EngridAmounts;
            if (!configs)
                return;
            const freq = this._frequency.frequency;
            if (!(freq in configs))
                return;
            if (!this.swapped)
                return; // ignore early changes before initial swap
            const currentConfig = configs[freq];
            this.defaultChange = this._amount.amount !== currentConfig.default;
        });
    }
    loadAmountsFromUrl() {
        const urlParams = new URLSearchParams(window.location.search);
        const amounts = urlParams.get("engrid-amounts");
        if (amounts) {
            this.defaultChange = true; // if amounts come from URL, treat as user-set
            const amountArray = amounts
                .split(",")
                .map((amt) => amt.trim())
                .filter(Boolean);
            if (!amountArray.length)
                return;
            const urlDefaultParam = ENGrid.getUrlParameter("transaction.donationAmt");
            const parsedFirst = parseFloat(amountArray[0]);
            const defaultAmount = (urlDefaultParam && parseFloat(urlDefaultParam)) ||
                parsedFirst;
            const amountsObj = {};
            amountArray.forEach((raw) => {
                const numeric = parseFloat(raw);
                amountsObj[raw] = isNaN(numeric) ? raw : numeric;
            });
            // Ensure Other choice always present at the end
            amountsObj["Other"] = "other";
            const config = {
                amounts: amountsObj,
                default: defaultAmount,
                // stickyDefault omitted so it defaults to false behavior
            };
            window.EngridAmounts = {
                onetime: config,
                monthly: config,
            };
        }
    }
    swapAmounts() {
        const configs = window.EngridAmounts;
        if (!configs)
            return;
        const freq = this._frequency.frequency;
        const config = configs[freq];
        if (!config)
            return;
        const stickyDefault = !!config.stickyDefault;
        // If stickyDefault, always ignore current value so selected flag in list enforces default
        const ignoreCurrentValue = stickyDefault ? true : this.ignoreCurrentValue();
        window.EngagingNetworks.require._defined.enjs.swapList("donationAmt", this.toEnAmountList(config), { ignoreCurrentValue });
        this._amount.load();
        this.logger.log("Amounts Swapped To", config, { ignoreCurrentValue });
        this.swapped = true;
    }
    /**
     * Convert the internal config object into the structure Engaging Networks expects
     */
    toEnAmountList(config) {
        return Object.entries(config.amounts).map(([label, value]) => ({
            selected: value === config.default,
            label,
            value: value.toString(),
        }));
    }
    shouldRun() {
        return !!window.EngridAmounts;
    }
    ignoreCurrentValue() {
        const urlParam = ENGrid.getUrlParameter("transaction.donationAmt");
        if (urlParam !== null) {
            const urlAmount = parseFloat(urlParam);
            return this._amount.amount !== urlAmount;
        }
        // If submission failed or donor manually changed away from default, respect current value
        const submissionFailed = window.EngagingNetworks.require._defined.enjs.checkSubmissionFailed();
        return !(submissionFailed || this.defaultChange);
    }
}
