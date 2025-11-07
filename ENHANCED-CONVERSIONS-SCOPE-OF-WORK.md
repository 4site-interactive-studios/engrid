# Enhanced Conversions Implementation - Scope of Work

## Overview

This document outlines the scope of work for implementing Google Analytics Enhanced Conversions in the ENgrid framework. The implementation automatically collects, normalizes, and hashes user PII (Personally Identifiable Information) data, then pushes it to the dataLayer in the format required by Google Analytics 4 Enhanced Conversions.

## Objectives

1. Automatically collect user PII from form fields (email, phone, name, address)
2. Normalize data according to Google Analytics specifications
3. Hash all PII using SHA-256 before pushing to dataLayer
4. Integrate seamlessly with existing ENgrid features (Remember Me, TidyContact)
5. Push enhanced conversions data at appropriate times (page load, field changes, form submit)
6. Ensure data quality by capturing standardized values from TidyContact

## Implementation Location

**Primary File:** `packages/scripts/src/data-layer.ts`

The DataLayer class has been enhanced with Enhanced Conversions functionality while maintaining backward compatibility with existing dataLayer features.

## Technical Implementation

### 1. SHA-256 Hashing Utility

**Location:** `DataLayer.sha256Hash()` (private async method)

**Implementation Details:**
- Uses `crypto.subtle.digest("SHA-256")` for cryptographic hashing
- Returns lowercase hexadecimal string (64 characters)
- Falls back to `btoa()` if `crypto.subtle` is unavailable (with warning)
- Handles edge cases: empty strings, non-string values, errors
- Browser compatibility: Chrome 37+, Firefox 34+, Safari 11+, Edge 12+
- Requires HTTPS (or localhost) for proper operation

**Audit Points:**
- Verify hash length is always 64 hex characters
- Confirm fallback behavior when `crypto.subtle` unavailable
- Check error handling doesn't leak data
- Validate hash format matches GA4 spec (lowercase hex)

### 2. Data Normalization Functions

**Location:** `DataLayer.normalize*()` methods (private)

**Functions Implemented:**
- `normalizeEmail()`: Lowercase, trim, remove leading/trailing dots, remove whitespace
- `normalizePhone()`: Remove non-digits except leading +, remove extensions, convert to E.164 format
- `normalizeAddress()`: Trim, normalize whitespace
- `normalizeName()`: Capitalize words, preserve hyphens and apostrophes (e.g., "O'Brien", "Mary-Jane")
- `normalizePostalCode()`: Uppercase, remove spaces and hyphens
- `normalizeRegion()`: Uppercase, trim
- `normalizeCountry()`: Uppercase, trim

**Audit Points:**
- Verify normalization handles international formats correctly
- Check edge cases: empty strings, special characters, unicode
- Confirm phone normalization produces valid E.164 format when possible
- Validate name normalization preserves special characters correctly

### 3. User Data Collection

**Location:** `DataLayer.collectUserData()` (private method)

**Fields Collected:**
- `email_address`: From `supporter.emailAddress`
- `phone_number`: From `supporter.phoneNumber`
- `first_name`: From `supporter.firstName`
- `last_name`: From `supporter.lastName`
- `street_address`: Combined from `supporter.address1`, `address2`, `address3`
- `city`: From `supporter.city`
- `region`: From `supporter.region`
- `postal_code`: From `supporter.postcode`
- `country`: From `supporter.country`

**Implementation Details:**
- Uses `ENGrid.getFieldValue()` to collect form data
- Handles various field types: text inputs, select dropdowns, radio buttons, checkboxes
- Skips empty fields (not included in userData object)
- Normalizes all collected data before returning

**Audit Points:**
- Verify all required GA4 fields are collected
- Check field name mappings are correct
- Confirm empty fields are properly excluded
- Validate address combination logic (address1 + address2 + address3)

### 4. Data Structure Builder

**Location:** `DataLayer.hashUserData()` (private async method)

**Implementation Details:**
- Takes normalized UserData object
- Hashes each field individually using SHA-256
- Returns UserData object with hashed values
- Only hashes fields that have values

**Data Structure:**
```typescript
interface UserData {
  email_address?: string;      // SHA-256 hashed
  phone_number?: string;       // SHA-256 hashed
  first_name?: string;         // SHA-256 hashed
  last_name?: string;          // SHA-256 hashed
  street_address?: string;     // SHA-256 hashed
  city?: string;               // SHA-256 hashed
  region?: string;             // SHA-256 hashed
  postal_code?: string;        // SHA-256 hashed
  country?: string;             // SHA-256 hashed
}

interface EnhancedConversionsData {
  user_data: UserData;
}
```

**Audit Points:**
- Verify data structure matches GA4 Measurement Protocol spec exactly
- Confirm all PII fields are hashed (no plaintext)
- Check optional fields are handled correctly
- Validate object structure pushed to dataLayer

### 5. Enhanced Conversions Push Method

**Location:** `DataLayer.pushEnhancedConversions()` (private async method)

**Implementation Details:**
- Collects current user data from form fields
- Merges with cached data from sessionStorage
- Checks if data has changed (skips push if unchanged)
- Hashes merged data using SHA-256
- Caches unhashed merged data for future merges
- Pushes `{ user_data: { ...hashedFields } }` to dataLayer

**Audit Points:**
- Verify no plaintext PII is pushed to dataLayer
- Check data merging logic handles conflicts correctly
- Confirm change detection prevents redundant pushes
- Validate error handling doesn't expose data

### 6. Integration Points

#### 6.1 Page Load Integration
**Location:** `DataLayer.onLoad()`

- Pushes enhanced conversions after page loads
- Waits for Remember Me to load if enabled (via RememberMeEvents.onLoad)
- Ensures form fields are populated before collecting data

**Audit Points:**
- Verify timing: pushes after Remember Me loads
- Check it doesn't push if no data available
- Confirm integration with Remember Me events

#### 6.2 Field Change Integration
**Location:** `DataLayer.handleFieldValueChange()` and `debouncedPushEnhancedConversions()`

- Monitors user data fields for changes
- Debounces pushes (500ms delay) to avoid excessive API calls
- Triggers on: blur (text inputs), change (selects, checkboxes, radios)

**User Data Fields Monitored:**
- supporter.emailAddress
- supporter.phoneNumber
- supporter.firstName
- supporter.lastName
- supporter.address1, address2, address3
- supporter.city
- supporter.region
- supporter.postcode
- supporter.country

**Audit Points:**
- Verify debounce delay is appropriate (500ms)
- Check all user data fields are monitored
- Confirm debounce prevents excessive pushes
- Validate async operations don't block UI

#### 6.3 Form Submit Integration
**Location:** `DataLayer.onSubmit()`

- Checks for TidyContact `submitPromise` (if TidyContact is standardizing data)
- Waits for TidyContact API to complete before pushing
- Ensures standardized/validated data is captured, not raw user input
- Falls back to immediate push if TidyContact not enabled or fails

**TidyContact Integration Details:**
- TidyContact standardizes addresses to CASS format
- TidyContact standardizes phone numbers to E.164 format
- Enhanced conversions waits for standardization to complete
- Captures final standardized values for better data quality

**Audit Points:**
- Verify TidyContact integration waits for standardization
- Check fallback behavior when TidyContact fails
- Confirm standardized data is captured (not raw input)
- Validate timing: pushes after TidyContact completes

#### 6.4 Remember Me Integration
**Location:** `DataLayer.constructor()` and `onLoad()`

- Subscribes to `RememberMeEvents.onLoad` if Remember Me is enabled
- Waits for Remember Me to populate form fields before collecting data
- Ensures enhanced conversions captures pre-filled data

**Audit Points:**
- Verify integration with Remember Me events
- Check data is collected after Remember Me loads
- Confirm pre-filled data is included in enhanced conversions

### 7. Data Merging and Caching

**Location:** `DataLayer.mergeUserData()`, `getCachedUserData()`, `cacheUserData()`

**Implementation Details:**
- Uses sessionStorage to cache unhashed user data
- Merges cached data with current form data
- New data (from form) takes precedence over cached data
- Empty strings don't overwrite existing cached values
- Enables data collection across multiple pages in a session

**Storage Key:** `ENGRID_ENHANCED_CONVERSIONS_DATA`

**Audit Points:**
- Verify merge logic handles conflicts correctly
- Check empty strings don't overwrite existing data
- Confirm sessionStorage usage is appropriate
- Validate data persists across pages correctly
- Check data is cleared appropriately (sessionStorage lifecycle)

### 8. Security Considerations

**Security Measures:**
- All PII is SHA-256 hashed before pushing to dataLayer
- No plaintext PII in dataLayer
- No plaintext PII in logs (only field names logged)
- Sensitive payment fields excluded from collection
- Error handling prevents data leaks
- Browser compatibility checks prevent errors

**Excluded Fields:**
- Credit card numbers, CVV, expiration dates
- Bank account numbers, routing numbers
- Other sensitive payment information

**Audit Points:**
- Verify NO plaintext PII in dataLayer
- Check excluded fields are not collected
- Confirm error handling doesn't expose data
- Validate hashing is applied to all PII
- Check logs don't contain PII

### 9. Performance Optimizations

**Optimizations Implemented:**
- Debounced field change events (500ms delay)
- Async SHA-256 operations (non-blocking)
- Efficient sessionStorage caching
- Skips redundant pushes when data unchanged
- Change detection prevents unnecessary hashing

**Audit Points:**
- Verify debounce prevents excessive pushes
- Check async operations don't block main thread
- Confirm sessionStorage operations are efficient
- Validate change detection works correctly
- Check performance impact is minimal

### 10. Browser Compatibility

**Requirements:**
- `crypto.subtle` (SHA-256): Chrome 37+, Firefox 34+, Safari 11+, Edge 12+
- `sessionStorage`: All modern browsers
- HTTPS required for `crypto.subtle` (or localhost)

**Fallback Behavior:**
- Falls back to `btoa()` if `crypto.subtle` unavailable (with warning)
- Gracefully handles missing `sessionStorage`
- Error handling prevents crashes

**Audit Points:**
- Verify fallback behavior works correctly
- Check warnings are logged appropriately
- Confirm no crashes in unsupported browsers
- Validate HTTPS requirement is documented

## Data Flow

### Page Load Flow
1. Page loads
2. If Remember Me enabled → Wait for RememberMeEvents.onLoad
3. Collect user data from form fields
4. Merge with cached data (if any)
5. Hash all PII fields with SHA-256
6. Push `{ user_data: { ...hashedFields } }` to dataLayer
7. Cache unhashed merged data to sessionStorage

### Field Change Flow
1. User changes a user data field
2. Debounce timer starts (500ms)
3. If another change occurs, timer resets
4. After 500ms of no changes:
   - Collect current user data
   - Merge with cached data
   - Check if data changed
   - If changed: hash and push to dataLayer
   - Cache unhashed merged data

### Form Submit Flow
1. Form submit event fires
2. Check if TidyContact `submitPromise` exists
3. If exists:
   - Wait for TidyContact API to complete
   - TidyContact standardizes address (CASS) and phone (E.164)
   - Collect user data (now standardized)
   - Hash and push to dataLayer
4. If not exists:
   - Collect and push immediately

## Edge Cases Handled

1. **Empty Fields**: Skipped, not included in user_data
2. **Partial Data**: Merges available fields, doesn't require all fields
3. **Multiple Pages**: Data cached in sessionStorage, merged across pages
4. **Remember Me Cleared**: Cached data persists until new data overwrites
5. **Cross-Domain**: sessionStorage is domain-specific, data doesn't persist
6. **TidyContact Failure**: Falls back to current form data
7. **No TidyContact**: Works normally without TidyContact
8. **Data Unchanged**: Skips push if data hasn't changed
9. **No Data**: Returns early if no user data available
10. **Browser Incompatibility**: Falls back to btoa with warning
11. **HTTPS Required**: Warns if crypto.subtle unavailable
12. **Special Characters**: Normalization handles unicode, hyphens, apostrophes
13. **International Formats**: Phone, postal code, address formats handled

## Testing Scenarios

### Basic Functionality
- [ ] Enhanced conversions pushes on page load
- [ ] Enhanced conversions pushes on field changes (debounced)
- [ ] Enhanced conversions pushes on form submit
- [ ] Data structure matches GA4 spec
- [ ] All PII fields are SHA-256 hashed
- [ ] No plaintext PII in dataLayer

### Integration Testing
- [ ] Works with Remember Me enabled
- [ ] Works with Remember Me disabled
- [ ] Works with TidyContact enabled
- [ ] Works with TidyContact disabled
- [ ] Works with both Remember Me and TidyContact
- [ ] Captures standardized data from TidyContact

### Edge Case Testing
- [ ] Empty fields are skipped
- [ ] Partial data is merged correctly
- [ ] Data persists across multiple pages
- [ ] Data doesn't persist across domains
- [ ] Special characters in names handled correctly
- [ ] International phone formats normalized
- [ ] International postal codes normalized
- [ ] TidyContact failure handled gracefully
- [ ] Browser without crypto.subtle falls back correctly
- [ ] Data unchanged detection prevents redundant pushes

### Security Testing
- [ ] No plaintext PII in dataLayer
- [ ] No plaintext PII in console logs
- [ ] Payment fields excluded from collection
- [ ] Error handling doesn't expose data
- [ ] All PII properly hashed

### Performance Testing
- [ ] Debounce prevents excessive pushes
- [ ] Async operations don't block UI
- [ ] sessionStorage operations are fast
- [ ] Change detection works efficiently
- [ ] No memory leaks

## Files Modified

1. **packages/scripts/src/data-layer.ts**
   - Added Enhanced Conversions functionality
   - Maintained backward compatibility
   - No breaking changes to existing API

## Dependencies

- No new external dependencies added
- Uses existing ENgrid utilities (ENGrid, EnForm, RememberMeEvents)
- Uses browser native APIs (crypto.subtle, sessionStorage)

## Configuration

**No configuration required** - Enhanced Conversions works automatically when DataLayer is instantiated.

**Optional Configuration:**
- `fieldChangeDebounceDelay`: Default 500ms (configurable via property)

## Browser Requirements

- **SHA-256 Hashing**: Chrome 37+, Firefox 34+, Safari 11+, Edge 12+
- **HTTPS Required**: For proper SHA-256 hashing (or localhost)
- **sessionStorage**: All modern browsers

## Google Analytics Integration

The implementation pushes data in the following format to `window.dataLayer`:

```javascript
{
  user_data: {
    email_address: "sha256hash...",
    phone_number: "sha256hash...",
    first_name: "sha256hash...",
    last_name: "sha256hash...",
    street_address: "sha256hash...",
    city: "sha256hash...",
    region: "sha256hash...",
    postal_code: "sha256hash...",
    country: "sha256hash..."
  }
}
```

Google Tag Manager will automatically process this `user_data` object and merge it with conversion events for Enhanced Conversions matching.

## Audit Checklist

### Code Review
- [ ] All PII fields are properly hashed
- [ ] No plaintext PII in dataLayer
- [ ] Normalization functions handle edge cases
- [ ] Error handling is comprehensive
- [ ] Integration points are correct
- [ ] Performance optimizations are effective
- [ ] Browser compatibility is handled

### Security Review
- [ ] No data leaks in logs
- [ ] No plaintext PII anywhere
- [ ] Payment fields excluded
- [ ] Error handling secure
- [ ] Hash implementation correct

### Integration Review
- [ ] Remember Me integration works
- [ ] TidyContact integration works
- [ ] ENGrid integration works
- [ ] dataLayer structure correct
- [ ] No conflicts with existing features

### Testing Review
- [ ] All scenarios tested
- [ ] Edge cases covered
- [ ] Performance acceptable
- [ ] Browser compatibility verified
- [ ] Security verified

## Known Limitations

1. **Synchronous hash() method**: Still uses btoa() for backward compatibility with existing EN_FORM_VALUE_UPDATED events. Enhanced Conversions uses async sha256Hash().
2. **HTTPS Requirement**: SHA-256 hashing requires HTTPS (or localhost). Falls back to btoa() with warning in non-HTTPS contexts.
3. **Browser Support**: Older browsers without crypto.subtle will use btoa() fallback.

## Future Enhancements (Out of Scope)

- Configuration options to enable/disable enhanced conversions
- More detailed logging in debug mode
- Unit tests for normalization functions
- Integration tests for full data flow

## Questions for Auditor

1. Does the data structure match GA4 Enhanced Conversions spec exactly?
2. Are there any security concerns with the implementation?
3. Is the TidyContact integration timing correct?
4. Are there any edge cases not handled?
5. Is the performance impact acceptable?
6. Are there any browser compatibility issues?
7. Is the error handling comprehensive?
8. Are there any data leaks or privacy concerns?

## References

- [Google Analytics Enhanced Conversions](https://support.google.com/google-ads/answer/9888166)
- [GA4 Measurement Protocol - user_data](https://developers.google.com/analytics/devguides/collection/protocol/ga4/reference/events#user_data)
- [SHA-256 Hashing](https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/digest)
