export declare class FrequencyUpsell {
    private logger;
    private upsellModal;
    private readonly options;
    private _frequency;
    private _amount;
    private _form;
    private modalSeen;
    constructor();
    /**
     * Check if the FrequencyUpsell should run:
     * - Check if the FrequencyUpsell is enabled in the window object
     * - Check that we don't have an EngridUpsell active on this page
     * - Check that we don't have an EngagingNetworks upsell active on this page
     * @returns {boolean} - true if the FrequencyUpsell should run, false otherwise
     */
    shouldRun(): boolean;
    getUpsellAmount(): number;
    private addEventListeners;
}
