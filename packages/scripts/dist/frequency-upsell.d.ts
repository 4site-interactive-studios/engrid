export declare class FrequencyUpsell {
    private logger;
    private upsellModal;
    private readonly options;
    private _frequency;
    private _amount;
    private _fee;
    private _form;
    private modalSeen;
    constructor();
    /**
     * Select the proper options (single config or A/B variant) and return a concrete FrequencyUpsellOptions object.
     * If an A/B test config is provided (abTest: true, options: [...]) a random variant is chosen and stored
     * in a 1-day cookie so subsequent visits get the same variant.
     */
    private selectOptions;
    private randomIndex;
    /**
     * Check if the FrequencyUpsell should run:
     * - Check if the FrequencyUpsell is enabled in the window object
     * - Check that we don't have an EngridUpsell active on this page
     * - Check that we don't have an EngagingNetworks upsell active on this page
     * @returns {boolean} - true if the FrequencyUpsell should run, false otherwise
     */
    shouldRun(): boolean;
    /**
     * Get the upsell amount with/without fees
     * We want to display to the user the amount with fees, but we need to set the donation amount to the value without fees
     * @param {boolean} withFee - true if we want to include the fees in the upsell amount
     * @returns {number} - The upsell amount with fees
     */
    getUpsellAmount(withFee: boolean): number;
    private addEventListeners;
    /**
     * Create the frequency field for the upsell, if it does not exist on the page already
     * This is required by DonationFrequency to set the frequency
     */
    private createFrequencyField;
}
