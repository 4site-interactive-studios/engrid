export declare class PreferredPaymentMethod {
    private logger;
    private readonly availabilityTimeoutMs;
    private cleanupHandlers;
    private selectionFinalized;
    private config;
    constructor();
    private shouldRun;
    private resolveConfig;
    private buildCandidateList;
    private getFieldPreference;
    private getUrlPreference;
    private tryCandidateAtIndex;
    private waitForAvailability;
    private applySelection;
    private paymentMethodExists;
    private isPaymentMethodAvailable;
    private findPaymentInput;
    private getGiveBySelectInputs;
    private getGiveBySelectContainer;
    private getInputContainer;
    private findLabelForInput;
    private normalizePaymentValue;
    private getAvailabilityAttributeFilters;
    private cleanupAllObservers;
}
