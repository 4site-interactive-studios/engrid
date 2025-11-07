export declare class DataLayer {
    private logger;
    private dataLayer;
    private _form;
    private static instance;
    private endOfGiftProcessStorageKey;
    private enhancedConversionsStorageKey;
    private fieldChangeDebounceTimer;
    private fieldChangeDebounceDelay;
    private excludedFields;
    private hashedFields;
    constructor();
    static getInstance(): DataLayer;
    private transformJSON;
    private onLoad;
    private onSubmit;
    private attachEventListeners;
    private handleFieldValueChange;
    /**
     * Debounced push of enhanced conversions to avoid excessive pushes on rapid field changes
     */
    private debouncedPushEnhancedConversions;
    /**
     * Hash a value using SHA-256
     * Falls back to btoa if crypto.subtle is not available
     */
    private sha256Hash;
    /**
     * Synchronous hash method for backward compatibility
     * Uses btoa for now, but should be replaced with async sha256Hash where possible
     */
    private hash;
    /**
     * Normalize email address: lowercase, trim whitespace
     */
    private normalizeEmail;
    /**
     * Normalize phone number: remove non-digit characters, keep leading +
     */
    private normalizePhone;
    /**
     * Normalize address: trim whitespace, remove extra spaces
     */
    private normalizeAddress;
    /**
     * Normalize name: trim whitespace, capitalize first letter of each word
     */
    private normalizeName;
    /**
     * Normalize postal code: uppercase, remove spaces
     */
    private normalizePostalCode;
    /**
     * Normalize region/state: uppercase, trim
     */
    private normalizeRegion;
    /**
     * Normalize country: uppercase, trim
     */
    private normalizeCountry;
    /**
     * Collect user data from form fields
     */
    private collectUserData;
    /**
     * Merge user data, preferring new data over cached data
     */
    private mergeUserData;
    /**
     * Hash user data fields according to Google Analytics Enhanced Conversions spec
     */
    private hashUserData;
    /**
     * Get cached user data from sessionStorage
     */
    private getCachedUserData;
    /**
     * Cache user data to sessionStorage
     */
    private cacheUserData;
    /**
     * Push enhanced conversions data to dataLayer
     */
    private pushEnhancedConversions;
    private getFieldLabel;
    addEndOfGiftProcessEvent(eventName: string, eventProperties?: object): void;
    addEndOfGiftProcessVariable(variableName: string, variableValue?: any): void;
    private storeEndOfGiftProcessData;
    private addEndOfGiftProcessEventsToDataLayer;
    private getEndOfGiftProcessData;
}
