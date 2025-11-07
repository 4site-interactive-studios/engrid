// DataLayer: singleton helper for pushing structured analytics events/vars to window.dataLayer.
// On load it emits one aggregated event `pageJsonVariablesReady` with:
//   EN_PAGEJSON_* (normalized pageJson), EN_URLPARAM_*, EN_RECURRING_FREQUENCIES (donation pages),
//   and EN_SUBMISSION_SUCCESS_{PAGETYPE} when on the final page.
// User actions emit: EN_FORM_VALUE_UPDATED (field changes) and submission opt‑in/out events.
// Queued end‑of‑gift events/variables (via addEndOfGiftProcessEvent / addEndOfGiftProcessVariable)
// are replayed after a successful gift process load.
// Sensitive payment/bank fields are excluded; selected PII fields are Base64 “hashed” (btoa — not cryptographic).
// Replace with a real hash (e.g., SHA‑256) if required.

import { EngridLogger, ENGrid, EnForm, RememberMeEvents } from ".";

/**
 * User data interface matching Google Analytics Enhanced Conversions spec
 * All fields are optional and will be SHA-256 hashed before pushing to dataLayer
 * 
 * Reference: https://developers.google.com/analytics/devguides/collection/protocol/ga4/reference/events#user_data
 * 
 * Field requirements:
 * - email_address: SHA-256 hashed, lowercase, trimmed
 * - phone_number: SHA-256 hashed, E.164 format preferred
 * - first_name: SHA-256 hashed, normalized (capitalized)
 * - last_name: SHA-256 hashed, normalized (capitalized)
 * - street_address: SHA-256 hashed, combined from address1, address2, address3
 * - city: SHA-256 hashed, normalized
 * - region: SHA-256 hashed, uppercase (state/province)
 * - postal_code: SHA-256 hashed, uppercase, no spaces/hyphens
 * - country: SHA-256 hashed, uppercase (ISO country code or name)
 */
interface UserData {
  email_address?: string;
  phone_number?: string;
  first_name?: string;
  last_name?: string;
  street_address?: string;
  city?: string;
  region?: string;
  postal_code?: string;
  country?: string;
}

/**
 * Enhanced Conversions data structure for Google Analytics
 * Matches GA4 Measurement Protocol specification
 * 
 * Structure: { user_data: { email_address: "hash", ... } }
 * This is pushed directly to dataLayer for Google Tag Manager to process
 */
interface EnhancedConversionsData {
  user_data: UserData;
}

export class DataLayer {
  private logger: EngridLogger = new EngridLogger(
    "DataLayer",
    "#f1e5bc",
    "#009cdc",
    "📊"
  );
  private dataLayer = (window as any).dataLayer || [];
  private _form: EnForm = EnForm.getInstance();
  private static instance: DataLayer;
  private endOfGiftProcessStorageKey = "ENGRID_END_OF_GIFT_PROCESS_EVENTS";
  private enhancedConversionsStorageKey = "ENGRID_ENHANCED_CONVERSIONS_DATA";
  private fieldChangeDebounceTimer: number | null = null;
  private fieldChangeDebounceDelay = 500; // ms

  private excludedFields = [
    // Credit Card
    "transaction.ccnumber",
    "transaction.ccexpire.delimiter",
    "transaction.ccexpire",
    "transaction.ccvv",
    "supporter.creditCardHolderName",

    // Bank Account
    "supporter.bankAccountNumber",
    "supporter.bankAccountType",
    "transaction.bankname",
    "supporter.bankRoutingNumber",
  ];

  private hashedFields = [
    // Supporter Address, Phone Numbers, and Address
    "supporter.emailAddress",
    "supporter.phoneNumber",
    "supporter.phoneNumber2",
    "supporter.address1",
    "supporter.address2",
    "supporter.address3",

    // In Honor/Memory Inform Email and Address
    "transaction.infemail",
    "transaction.infadd1",
    "transaction.infadd2",
    "transaction.infadd3",

    // Billing Address
    "supporter.billingAddress1",
    "supporter.billingAddress2",
    "supporter.billingAddress3",
  ];

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
  constructor() {
    if (ENGrid.getOption("RememberMe")) {
      RememberMeEvents.getInstance().onLoad.subscribe((hasData: boolean) => {
        this.logger.log("Remember me - onLoad", hasData);
        this.onLoad();
      });
    } else {
      this.onLoad();
    }
    this._form.onSubmit.subscribe(() => this.onSubmit());
  }

  public static getInstance(): DataLayer {
    if (!DataLayer.instance) {
      DataLayer.instance = new DataLayer();
      (window as any)._dataLayer = DataLayer.instance;
    }

    return DataLayer.instance;
  }

  private transformJSON(value: any) {
    if (typeof value === "string") {
      return value
        .toUpperCase()
        .trim()
        .replace(/\s+/g, "-")
        .replace(/:-/g, "-");
    }
    if (typeof value === "boolean") {
      return value ? "TRUE" : "FALSE";
    }
    if (typeof value === "number") {
      return value; // Preserve numeric type for analytics platforms that infer number vs string
    }
    return "";
  }

  private onLoad() {
    // Collect all data layer variables to push at once
    const dataLayerData: { [key: string]: any } = {};

    if (ENGrid.getGiftProcess()) {
      this.logger.log("EN_SUCCESSFUL_DONATION");
      this.addEndOfGiftProcessEventsToDataLayer();
    }

    if (window.pageJson) {
      const pageJson = window.pageJson as Record<string, any>;
      for (const property in pageJson) {
        const key = `EN_PAGEJSON_${property.toUpperCase()}`;
        const value = pageJson[property];
        dataLayerData[key] = this.transformJSON(value);
      }
      if (ENGrid.getPageCount() === ENGrid.getPageNumber()) {
        dataLayerData[
          `EN_SUBMISSION_SUCCESS_${pageJson.pageType.toUpperCase()}`
        ] = "TRUE";
      }
    }

    const urlParams = new URLSearchParams(window.location.search);
    urlParams.forEach((value, key) => {
      dataLayerData[`EN_URLPARAM_${key.toUpperCase()}`] =
        this.transformJSON(value);
    });

    if (ENGrid.getPageType() === "DONATION") {
      const recurrFreqEls = document.querySelectorAll(
        '[name="transaction.recurrfreq"]'
      ) as NodeListOf<HTMLInputElement>;

      const recurrValues = [...recurrFreqEls].map((el) => el.value);

      dataLayerData[`EN_RECURRING_FREQUENCIES`] = recurrValues;
    }

    // Push all collected variables at once
    if (Object.keys(dataLayerData).length > 0) {
      dataLayerData.event = "pageJsonVariablesReady";
      this.dataLayer.push(dataLayerData);
    }

    this.attachEventListeners();

    // Push enhanced conversions on page load
    this.pushEnhancedConversions();
  }

  private onSubmit() {
    // Push enhanced conversions before form submission
    this.pushEnhancedConversions();

    const optIn = document.querySelector(
      ".en__field__item:not(.en__field--question) input[name^='supporter.questions'][type='checkbox']:checked"
    );
    if (optIn) {
      this.logger.log("EN_SUBMISSION_WITH_EMAIL_OPTIN");
      this.dataLayer.push({
        event: "EN_SUBMISSION_WITH_EMAIL_OPTIN",
      });
    } else {
      this.logger.log("EN_SUBMISSION_WITHOUT_EMAIL_OPTIN");
      this.dataLayer.push({
        event: "EN_SUBMISSION_WITHOUT_EMAIL_OPTIN",
      });
    }
  }

  private attachEventListeners() {
    const textInputs = document.querySelectorAll(
      ".en__component--advrow input:not([type=checkbox]):not([type=radio]):not([type=submit]):not([type=button]):not([type=hidden]):not([unhidden]), .en__component--advrow textarea"
    ) as NodeListOf<HTMLInputElement>;

    textInputs.forEach((el) => {
      el.addEventListener("blur", (e) => {
        this.handleFieldValueChange(e.target as HTMLInputElement);
      });
    });

    const radioAndCheckboxInputs = document.querySelectorAll(
      ".en__component--advrow input[type=checkbox], .en__component--advrow input[type=radio]"
    ) as NodeListOf<HTMLInputElement>;

    radioAndCheckboxInputs.forEach((el) => {
      el.addEventListener("change", (e) => {
        this.handleFieldValueChange(e.target as HTMLInputElement);
      });
    });

    const selectInputs = document.querySelectorAll(
      ".en__component--advrow select"
    ) as NodeListOf<HTMLInputElement>;

    selectInputs.forEach((el) => {
      el.addEventListener("change", (e) => {
        this.handleFieldValueChange(e.target as HTMLInputElement);
      });
    });
  }

  private handleFieldValueChange(el: HTMLInputElement | HTMLSelectElement) {
    if (el.value === "" || this.excludedFields.includes(el.name)) return;

    const value = this.hashedFields.includes(el.name)
      ? this.hash(el.value)
      : el.value;

    if (["checkbox", "radio"].includes(el.type)) {
      if ((el as HTMLInputElement).checked) {
        if (el.name === "en__pg") {
          //Premium gift handling
          this.dataLayer.push({
            event: "EN_FORM_VALUE_UPDATED",
            enFieldName: el.name,
            enFieldLabel: "Premium Gift",
            enFieldValue: el
              .closest(".en__pg__body")
              ?.querySelector(".en__pg__name")?.textContent,
            enProductId: (
              document.querySelector(
                '[name="transaction.selprodvariantid"]'
              ) as HTMLInputElement
            )?.value,
          });
        } else {
          this.dataLayer.push({
            event: "EN_FORM_VALUE_UPDATED",
            enFieldName: el.name,
            enFieldLabel: this.getFieldLabel(el),
            enFieldValue: value,
          });
        }
      }
      // Check if this is a user data field for enhanced conversions
      this.debouncedPushEnhancedConversions();
      return;
    }

    this.dataLayer.push({
      event: "EN_FORM_VALUE_UPDATED",
      enFieldName: el.name,
      enFieldLabel: this.getFieldLabel(el),
      enFieldValue: value,
    });

    // Check if this is a user data field for enhanced conversions
    const userDataFields = [
      "supporter.emailAddress",
      "supporter.phoneNumber",
      "supporter.firstName",
      "supporter.lastName",
      "supporter.address1",
      "supporter.address2",
      "supporter.address3",
      "supporter.city",
      "supporter.region",
      "supporter.postcode",
      "supporter.country",
    ];
    if (userDataFields.includes(el.name)) {
      this.debouncedPushEnhancedConversions();
    }
  }

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
  private debouncedPushEnhancedConversions(): void {
    if (this.fieldChangeDebounceTimer !== null) {
      window.clearTimeout(this.fieldChangeDebounceTimer);
    }
    this.fieldChangeDebounceTimer = window.setTimeout(() => {
      // Fire and forget - async operation won't block
      this.pushEnhancedConversions();
      this.fieldChangeDebounceTimer = null;
    }, this.fieldChangeDebounceDelay);
  }

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
  private async sha256Hash(value: string): Promise<string> {
    // Handle empty or invalid input
    if (!value) return "";
    if (typeof value !== "string") {
      value = String(value);
    }

    // Check if crypto.subtle is available (HTTPS or localhost)
    if (
      typeof window !== "undefined" &&
      window.crypto &&
      window.crypto.subtle
    ) {
      try {
        // Encode the string as UTF-8
        const encoder = new TextEncoder();
        const data = encoder.encode(value);
        
        // Hash using SHA-256
        const hashBuffer = await crypto.subtle.digest("SHA-256", data);
        
        // Convert ArrayBuffer to hex string
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray
          .map((b) => b.toString(16).padStart(2, "0"))
          .join("");
        
        // Verify hash length (SHA-256 should be 64 hex characters)
        if (hashHex.length !== 64) {
          this.logger.warn(
            `Unexpected hash length: ${hashHex.length}, expected 64`
          );
        }
        
        return hashHex;
      } catch (error) {
        // Log error but don't throw - fall back gracefully
        this.logger.error("SHA-256 hashing failed, falling back to btoa", error);
        return btoa(value);
      }
    } else {
      // Fallback for non-HTTPS contexts or older browsers
      this.logger.warn(
        "crypto.subtle not available, using btoa fallback for hashing. " +
        "Enhanced conversions require HTTPS for proper SHA-256 hashing."
      );
      return btoa(value);
    }
  }

  /**
   * Synchronous hash method for backward compatibility
   * 
   * NOTE: This method uses btoa (Base64) for existing EN_FORM_VALUE_UPDATED events.
   * Enhanced Conversions uses the async sha256Hash() method which provides proper
   * SHA-256 hashing for Google Analytics Enhanced Conversions.
   * 
   * Design decision:
   * - Enhanced Conversions: Uses async sha256Hash() for proper SHA-256 hashing
   * - Existing events (EN_FORM_VALUE_UPDATED): Uses btoa() for backward compatibility
   * - The hash() method remains synchronous to avoid breaking existing synchronous code
   * 
   * If you need SHA-256 hashing for hashedFields in EN_FORM_VALUE_UPDATED events,
   * you would need to refactor handleFieldValueChange() to be async, which may
   * have broader implications for the codebase.
   */
  private hash(value: string): string {
    // For enhanced conversions, we use async sha256Hash
    // This method is kept for backward compatibility with existing code
    return btoa(value);
  }

  /**
   * Normalize email address: lowercase, trim whitespace, remove leading/trailing dots
   * Handles edge cases: multiple spaces, special characters, empty strings
   */
  private normalizeEmail(email: string): string {
    if (!email || typeof email !== "string") return "";
    // Trim and lowercase
    let normalized = email.trim().toLowerCase();
    // Remove leading/trailing dots (but keep dots in the middle)
    normalized = normalized.replace(/^\.+|\.+$/g, "");
    // Remove any whitespace (emails shouldn't have spaces)
    normalized = normalized.replace(/\s+/g, "");
    return normalized;
  }

  /**
   * Normalize phone number: remove non-digit characters, keep leading +
   * Handles edge cases: extensions (x, ext, extension), parentheses, dashes, spaces
   * Converts to E.164 format when possible
   */
  private normalizePhone(phone: string): string {
    if (!phone || typeof phone !== "string") return "";
    // Trim whitespace
    let cleaned = phone.trim();
    // Remove common extension markers and everything after them
    cleaned = cleaned.replace(/\s*(x|ext|extension)[\s:]*\d+.*$/i, "");
    // Remove parentheses, dashes, dots, spaces
    cleaned = cleaned.replace(/[()\-.\s]/g, "");
    // Keep leading + if present
    if (cleaned.startsWith("+")) {
      // Ensure + is followed by digits only
      const digits = cleaned.slice(1).replace(/\D/g, "");
      return digits ? "+" + digits : "";
    }
    // Remove all non-digits
    return cleaned.replace(/\D/g, "");
  }

  /**
   * Normalize address: trim whitespace, remove extra spaces, normalize common abbreviations
   * Handles edge cases: multiple spaces, special characters, empty strings
   */
  private normalizeAddress(address: string): string {
    if (!address || typeof address !== "string") return "";
    // Trim and normalize whitespace
    let normalized = address.trim().replace(/\s+/g, " ");
    // Normalize common address abbreviations (optional, for consistency)
    // Street -> St, Avenue -> Ave, etc. (but keep original if preferred)
    return normalized;
  }

  /**
   * Normalize name: trim whitespace, capitalize first letter of each word
   * Handles edge cases: hyphens, apostrophes, multiple spaces, special characters
   * Preserves hyphens and apostrophes (e.g., "O'Brien", "Mary-Jane")
   */
  private normalizeName(name: string): string {
    if (!name || typeof name !== "string") return "";
    // Trim and normalize whitespace
    let normalized = name.trim().replace(/\s+/g, " ");
    // Split on spaces, hyphens, and apostrophes, but preserve them
    // Capitalize first letter of each word part
    normalized = normalized
      .split(/\s+/)
      .map((word) => {
        // Handle hyphenated names (e.g., "Mary-Jane")
        if (word.includes("-")) {
          return word
            .split("-")
            .map((part) =>
              part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()
            )
            .join("-");
        }
        // Handle apostrophes (e.g., "O'Brien")
        if (word.includes("'")) {
          return word
            .split("'")
            .map((part, index) => {
              if (index === 0) {
                return (
                  part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()
                );
              }
              return part.toLowerCase();
            })
            .join("'");
        }
        // Regular word
        return (
          word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        );
      })
      .join(" ");
    return normalized;
  }

  /**
   * Normalize postal code: uppercase, remove spaces and hyphens
   * Handles edge cases: various formats (US ZIP+4, Canadian postal codes, etc.)
   */
  private normalizePostalCode(postalCode: string): string {
    if (!postalCode || typeof postalCode !== "string") return "";
    // Uppercase, trim, remove all spaces and hyphens
    return postalCode.toUpperCase().trim().replace(/[\s\-]/g, "");
  }

  /**
   * Normalize region/state: uppercase, trim
   * Handles edge cases: special characters, empty strings
   */
  private normalizeRegion(region: string): string {
    if (!region || typeof region !== "string") return "";
    return region.toUpperCase().trim();
  }

  /**
   * Normalize country: uppercase, trim
   * Handles edge cases: special characters, empty strings, country codes vs names
   */
  private normalizeCountry(country: string): string {
    if (!country || typeof country !== "string") return "";
    return country.toUpperCase().trim();
  }

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
  private collectUserData(): UserData {
    const userData: UserData = {};

    // Email - text input
    const email = ENGrid.getFieldValue("supporter.emailAddress");
    if (email && email.trim()) {
      const normalized = this.normalizeEmail(email);
      if (normalized) {
        userData.email_address = normalized;
      }
    }

    // Phone - text input
    const phone = ENGrid.getFieldValue("supporter.phoneNumber");
    if (phone && phone.trim()) {
      const normalized = this.normalizePhone(phone);
      if (normalized) {
        userData.phone_number = normalized;
      }
    }

    // First Name - text input
    const firstName = ENGrid.getFieldValue("supporter.firstName");
    if (firstName && firstName.trim()) {
      const normalized = this.normalizeName(firstName);
      if (normalized) {
        userData.first_name = normalized;
      }
    }

    // Last Name - text input
    const lastName = ENGrid.getFieldValue("supporter.lastName");
    if (lastName && lastName.trim()) {
      const normalized = this.normalizeName(lastName);
      if (normalized) {
        userData.last_name = normalized;
      }
    }

    // Street Address - combine address1, address2, address3 (text inputs)
    const address1 = ENGrid.getFieldValue("supporter.address1");
    const address2 = ENGrid.getFieldValue("supporter.address2");
    const address3 = ENGrid.getFieldValue("supporter.address3");
    const streetParts: string[] = [];
    if (address1 && address1.trim()) {
      const normalized = this.normalizeAddress(address1);
      if (normalized) streetParts.push(normalized);
    }
    if (address2 && address2.trim()) {
      const normalized = this.normalizeAddress(address2);
      if (normalized) streetParts.push(normalized);
    }
    if (address3 && address3.trim()) {
      const normalized = this.normalizeAddress(address3);
      if (normalized) streetParts.push(normalized);
    }
    if (streetParts.length > 0) {
      userData.street_address = streetParts.join(" ");
    }

    // City - text input
    const city = ENGrid.getFieldValue("supporter.city");
    if (city && city.trim()) {
      const normalized = this.normalizeAddress(city);
      if (normalized) {
        userData.city = normalized;
      }
    }

    // Region/State - select dropdown or text input
    const region = ENGrid.getFieldValue("supporter.region");
    if (region && region.trim()) {
      const normalized = this.normalizeRegion(region);
      if (normalized) {
        userData.region = normalized;
      }
    }

    // Postal Code - text input
    const postalCode = ENGrid.getFieldValue("supporter.postcode");
    if (postalCode && postalCode.trim()) {
      const normalized = this.normalizePostalCode(postalCode);
      if (normalized) {
        userData.postal_code = normalized;
      }
    }

    // Country - select dropdown
    const country = ENGrid.getFieldValue("supporter.country");
    if (country && country.trim()) {
      const normalized = this.normalizeCountry(country);
      if (normalized) {
        userData.country = normalized;
      }
    }

    return userData;
  }

  /**
   * Merge user data, preferring new data over cached data
   * 
   * Edge cases handled:
   * - Partial data: merges fields from multiple sources
   * - Conflicting values: new data (from form) takes precedence over cached
   * - Empty strings: treated as no value (won't overwrite existing)
   * - Remember Me integration: cached data from Remember Me is merged with current form data
   */
  private mergeUserData(
    existing: UserData,
    newData: UserData
  ): UserData {
    const merged: UserData = { ...existing };
    
    // Only merge new data if it has a value (not empty string)
    for (const key in newData) {
      const value = newData[key as keyof UserData];
      // Prefer new data if it exists and is not empty
      if (value && value.trim && value.trim() !== "") {
        merged[key as keyof UserData] = value;
      } else if (value && typeof value === "string" && value !== "") {
        // For non-trimmable values (shouldn't happen, but safety check)
        merged[key as keyof UserData] = value;
      }
    }
    
    return merged;
  }

  /**
   * Hash user data fields according to Google Analytics Enhanced Conversions spec
   */
  private async hashUserData(userData: UserData): Promise<UserData> {
    const hashedData: UserData = {};

    if (userData.email_address) {
      hashedData.email_address = await this.sha256Hash(userData.email_address);
    }
    if (userData.phone_number) {
      hashedData.phone_number = await this.sha256Hash(userData.phone_number);
    }
    if (userData.first_name) {
      hashedData.first_name = await this.sha256Hash(userData.first_name);
    }
    if (userData.last_name) {
      hashedData.last_name = await this.sha256Hash(userData.last_name);
    }
    if (userData.street_address) {
      hashedData.street_address = await this.sha256Hash(
        userData.street_address
      );
    }
    if (userData.city) {
      hashedData.city = await this.sha256Hash(userData.city);
    }
    if (userData.region) {
      hashedData.region = await this.sha256Hash(userData.region);
    }
    if (userData.postal_code) {
      hashedData.postal_code = await this.sha256Hash(userData.postal_code);
    }
    if (userData.country) {
      hashedData.country = await this.sha256Hash(userData.country);
    }

    return hashedData;
  }

  /**
   * Get cached user data from sessionStorage
   */
  private getCachedUserData(): UserData {
    try {
      if (typeof window !== "undefined" && window.sessionStorage) {
        const cached = window.sessionStorage.getItem(
          this.enhancedConversionsStorageKey
        );
        if (cached) {
          return JSON.parse(cached);
        }
      }
    } catch (error) {
      this.logger.error("Failed to get cached user data", error);
    }
    return {};
  }

  /**
   * Cache user data to sessionStorage
   */
  private cacheUserData(userData: UserData): void {
    try {
      if (typeof window !== "undefined" && window.sessionStorage) {
        window.sessionStorage.setItem(
          this.enhancedConversionsStorageKey,
          JSON.stringify(userData)
        );
      }
    } catch (error) {
      this.logger.error("Failed to cache user data", error);
    }
  }

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
  private async pushEnhancedConversions(): Promise<void> {
    try {
      // Collect current user data
      const currentData = this.collectUserData();

      // Check if we have any data
      if (Object.keys(currentData).length === 0) {
        return;
      }

      // Merge with cached data
      const cachedData = this.getCachedUserData();
      const mergedData = this.mergeUserData(cachedData, currentData);

      // Check if data has changed
      const cachedString = JSON.stringify(cachedData);
      const mergedString = JSON.stringify(mergedData);
      if (cachedString === mergedString && Object.keys(cachedData).length > 0) {
        // Data hasn't changed, skip push
        return;
      }

      // Hash the merged data
      const hashedData = await this.hashUserData(mergedData);

      // Cache the unhashed merged data for future merges
      this.cacheUserData(mergedData);

      // Push to dataLayer in Google Analytics Enhanced Conversions format
      // Structure matches GA4 Measurement Protocol: { user_data: { email_address: "hash", ... } }
      const enhancedConversionsData: EnhancedConversionsData = {
        user_data: hashedData,
      };

      // Push to dataLayer - GTM will automatically process this for Enhanced Conversions
      // The user_data object will be merged with conversion events
      this.dataLayer.push(enhancedConversionsData);
      this.logger.log("Enhanced conversions data pushed", {
        fields: Object.keys(hashedData),
      });
    } catch (error) {
      this.logger.error("Failed to push enhanced conversions", error);
    }
  }

  private getFieldLabel(
    el: HTMLInputElement | HTMLSelectElement
  ): string | null {
    return el.closest(".en__field")?.querySelector("label")?.textContent || "";
  }

  public addEndOfGiftProcessEvent(
    eventName: string,
    eventProperties: object = {}
  ) {
    this.storeEndOfGiftProcessData({
      event: eventName,
      ...eventProperties,
    });
  }

  public addEndOfGiftProcessVariable(
    variableName: string,
    variableValue: any = ""
  ) {
    this.storeEndOfGiftProcessData({
      [variableName.toUpperCase()]: variableValue,
    });
  }

  private storeEndOfGiftProcessData(data: object) {
    const events = this.getEndOfGiftProcessData();
    events.push(data);
    window.sessionStorage.setItem(
      this.endOfGiftProcessStorageKey,
      JSON.stringify(events)
    );
  }

  private addEndOfGiftProcessEventsToDataLayer() {
    this.getEndOfGiftProcessData().forEach((event: object) => {
      this.dataLayer.push(event);
    });
    window.sessionStorage.removeItem(this.endOfGiftProcessStorageKey);
  }

  private getEndOfGiftProcessData(): Array<any> {
    let eventsData = window.sessionStorage.getItem(
      this.endOfGiftProcessStorageKey
    );
    return !eventsData ? [] : JSON.parse(eventsData);
  }
}
