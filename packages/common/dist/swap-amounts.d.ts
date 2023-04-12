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
import { DonationAmount } from ".";
export declare class SwapAmounts {
    private logger;
    _amount: DonationAmount;
    private _frequency;
    private defaultChange;
    private swapped;
    constructor();
    swapAmounts(): void;
    loadEnAmounts(amountArray: {
        amounts: [string, number];
        default: number;
    }): {
        selected: boolean;
        label: string;
        value: string;
    }[];
    shouldRun(): boolean;
    ignoreCurrentValue(): boolean;
}
