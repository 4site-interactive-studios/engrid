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
import { DonationAmount } from ".";
export declare class SwapAmounts {
    private logger;
    _amount: DonationAmount;
    private _frequency;
    private defaultChange;
    private swapped;
    constructor();
    loadAmountsFromUrl(): void;
    swapAmounts(): void;
    /**
     * Convert the internal config object into the structure Engaging Networks expects
     */
    private toEnAmountList;
    shouldRun(): boolean;
    ignoreCurrentValue(): boolean;
}
