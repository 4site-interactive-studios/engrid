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
    /**
     * Constructor - initializes DataLayer and sets up event listeners
     *
     * Integration with Remember Me:
     * - If RememberMe option is enabled, waits for RememberMeEvents.onLoad
     * - Enhanced conversions push happens after Remember Me loads data
     * - This ensures form fields are populated before collecting user data
     *
     * Integration with ENGrid:
     * - Uses ENGrid.getOption() to check RememberMe setting
     * - Uses ENGrid.getFieldValue() to collect form field values
     * - Uses EnForm.getInstance() for form submission events
     */
    constructor();
    static getInstance(): DataLayer;
    private transformJSON;
    private onLoad;
    private onSubmit;
    private attachEventListeners;
    private handleFieldValueChange;
    /**
     * Debounced push of enhanced conversions to avoid excessive pushes on rapid field changes
     *
     * Performance optimizations:
     * - Debounce delay: 500ms (configurable via fieldChangeDebounceDelay)
     * - Prevents multiple pushes during rapid typing
     * - Async SHA-256 operations don't block the main thread
     * - sessionStorage operations are synchronous but fast
     * - Only pushes if data has actually changed (checked in pushEnhancedConversions)
     */
    private debouncedPushEnhancedConversions;
    /**
     * Hash a value using SHA-256
     * Falls back to btoa if crypto.subtle is not available
     *
     * Browser compatibility:
     * - crypto.subtle is available in: Chrome 37+, Firefox 34+, Safari 11+, Edge 12+
     * - Requires HTTPS (or localhost) for security
     * - Returns lowercase hex string (64 characters for SHA-256)
     *
     * Edge cases handled:
     * - Empty strings return empty string
     * - Non-string values are converted to string
     * - Errors during hashing fall back to btoa with warning
     * - Non-HTTPS contexts fall back to btoa with warning
     */
    private sha256Hash;
    /**
     * Synchronous hash method for backward compatibility
     * Uses btoa for now, but should be replaced with async sha256Hash where possible
     */
    private hash;
    /**
     * Normalize email address: lowercase, trim whitespace, remove leading/trailing dots
     * Handles edge cases: multiple spaces, special characters, empty strings
     */
    private normalizeEmail;
    /**
     * Normalize phone number: remove non-digit characters, keep leading +
     * Handles edge cases: extensions (x, ext, extension), parentheses, dashes, spaces
     * Converts to E.164 format when possible
     */
    private normalizePhone;
    /**
     * Normalize address: trim whitespace, remove extra spaces, normalize common abbreviations
     * Handles edge cases: multiple spaces, special characters, empty strings
     */
    private normalizeAddress;
    /**
     * Normalize name: trim whitespace, capitalize first letter of each word
     * Handles edge cases: hyphens, apostrophes, multiple spaces, special characters
     * Preserves hyphens and apostrophes (e.g., "O'Brien", "Mary-Jane")
     */
    private normalizeName;
    /**
     * Normalize postal code: uppercase, remove spaces and hyphens
     * Handles edge cases: various formats (US ZIP+4, Canadian postal codes, etc.)
     */
    private normalizePostalCode;
    /**
     * Normalize region/state: uppercase, trim
     * Handles edge cases: special characters, empty strings
     */
    private normalizeRegion;
    /**
     * Normalize country: uppercase, trim
     * Handles edge cases: special characters, empty strings, country codes vs names
     */
    private normalizeCountry;
    /**
     * Collect user data from form fields
     *
     * Handles various field types:
     * - Text inputs: email, phone, names, addresses
     * - Select dropdowns: country, region
     * - Radio buttons: (handled by ENGrid.getFieldValue)
     * - Checkboxes: (handled by ENGrid.getFieldValue)
     *
     * Edge cases:
     * - Empty fields are skipped (not included in userData)
     * - Multiple address fields are combined into street_address
     * - Only collects data if field has a value
     */
    private collectUserData;
    /**
     * Merge user data, preferring new data over cached data
     *
     * Edge cases handled:
     * - Partial data: merges fields from multiple sources
     * - Conflicting values: new data (from form) takes precedence over cached
     * - Empty strings: treated as no value (won't overwrite existing)
     * - Remember Me integration: cached data from Remember Me is merged with current form data
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
     *
     * Edge cases handled:
     * - Empty fields: skipped, not included in user_data
     * - Multiple pages: data is cached in sessionStorage and merged across pages
     * - Remember Me cleared: cached data persists until new data overwrites it
     * - Cross-domain: sessionStorage is domain-specific, data doesn't persist across domains
     * - Partial data: merges available fields, doesn't require all fields
     * - No data: returns early if no user data is available
     * - Data unchanged: skips push if data hasn't changed since last push
     *
     * Integration points:
     * - ENGrid: uses ENGrid.getFieldValue() to collect form data
     * - Remember Me: pushes after Remember Me loads (if enabled)
     * - dataLayer: pushes to window.dataLayer for GTM processing
     */
    private pushEnhancedConversions;
    private getFieldLabel;
    addEndOfGiftProcessEvent(eventName: string, eventProperties?: object): void;
    addEndOfGiftProcessVariable(variableName: string, variableValue?: any): void;
    private storeEndOfGiftProcessData;
    private addEndOfGiftProcessEventsToDataLayer;
    private getEndOfGiftProcessData;
}
