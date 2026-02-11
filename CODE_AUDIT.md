# ENgrid Code Audit

**Date:** 2026-02-11
**Scope:** `packages/scripts/src/` (~15,700 lines TypeScript)
**Approach:** Focused on real bugs that cause incorrect behavior in practice, versus things that could theoretically be true at the extreme. Good code is called out so you know an area was reviewed.

---

## Real Bugs Found & Fixed

### BUG-1: `onLoad` handler bound but never called
**File:** `app.ts:501`

`.bind()` returns a new function but doesn't invoke it. Any pre-existing `window.onload` handler was silently dropped.

**Fix:** Changed to `onLoad.call(window, e)`.

---

### BUG-2/3: Null crash in `DonationAmount.clearOther()` and `load()`
**File:** `events/donation-amount.ts:82-87, 167-173`

Both methods query for the "other amount" input and immediately access `.value` without a null check. The `as HTMLInputElement` cast silences TypeScript but doesn't prevent the runtime TypeError. On pages where the client removes the "other" field, this crashes.

**Fix:** Added null guards before accessing the element.

---

### BUG-4: `splice()` during `forEach` skips elements
**File:** `show-hide-radio-checkboxes.ts:141-146, 161-166`

When removing stale state entries, `splice()` inside `forEach` mutates the array mid-iteration. If two consecutive entries share the same class, splicing the first shifts the second into its index position, and `forEach` advances past it. The duplicate remains in sessionStorage.

**Fix:** Replaced with `filter()` to build a clean array, then repopulated in place.

---

### BUG-5: `_dispatch` flag permanently stuck after error
**File:** `events/donation-amount.ts:114-164`, `events/donation-frequency.ts:108-145`

`setAmount()` and `setFrequency()` set `this._dispatch = dispatch` at the start and `this._dispatch = true` at the end. If any operation between them throws (e.g., from BUG-2/3's null access), `_dispatch` stays `false` permanently. All subsequent amount/frequency changes silently stop dispatching events, breaking live variables, submit button labels, processing fees, and upsell logic.

**Fix:** Wrapped operation bodies in `try/finally` to always restore `_dispatch = true`.

---

### BUG-6: Exit intent fires `open()` twice per trigger
**File:** `exit-intent-lightbox.ts:86-99`

When `relatedTarget` is null (the real trigger), `open()` was called immediately AND a timeout was set to call it again. The `this.opened` guard prevents visible duplication, but it still pushes a duplicate `exit_intent_lightbox_shown` event to the dataLayer.

**Fix:** Removed the immediate call; the timeout alone handles it.

---

### BUG-7: `JSON.parse` without try/catch in RememberMe
**File:** `remember-me.ts:151-153`

`updateFieldData()` parses cookie/postMessage data with bare `JSON.parse()`. If the cookie is corrupted (partial write, encoding issue, manual edit), this throws an unhandled exception. The iframe message handler at line 113 correctly uses `isJson()` first, but the cookie path at line 348 passes data directly.

**Fix:** Wrapped in try/catch; malformed data is silently ignored so the form loads fresh.

---

### BUG-8: `postMessage` with wildcard `"*"` origin
**File:** `remember-me.ts:94-96, 336-343`, `iframe.ts:93, 162-167, 185-193`

Outgoing `postMessage` calls used `"*"` as the target origin. Since ENgrid forms are designed to be embedded in iframes on third-party sites, any embedding page could receive these messages. RememberMe messages contain supporter field data.

Note: the incoming direction was already correct -- `remember-me.ts:318` verifies `event.source === iframe.contentWindow`.

**Fix:**
- RememberMe: Extract origin from the configured `remoteUrl` via `new URL().origin`.
- iFrame: Derive parent origin from `document.referrer`, falling back to `"*"` only when the referrer is unavailable.

---

### BUG-9: `sessionStorage` access without try/catch in DonationFrequency
**File:** `events/donation-frequency.ts:36, 63-66, 86`

Firefox with cookies disabled, some Safari private browsing modes, and various privacy extensions throw on `sessionStorage` access. The `App` class already wraps its RememberMe and DebugPanel sessionStorage in try/catch (lines 353-364, 471-479), showing the team is aware of this issue, but `DonationFrequency` was missed.

**Fix:** Wrapped all three sessionStorage access points in try/catch.

---

## Moderate Patterns Fixed

### MOD-1: `Function()` constructor for upsell calculation
**File:** `upsell-lightbox.ts:247-249`

Used `Function('"use strict";return (' + expression + ')')()` to evaluate expressions like `"amount / 12"`. The input is developer-configured (not user form input), so the security risk is limited to the client's own page config. However, `Function()` is flagged by CSP policies and code scanners.

**Fix:** Replaced with a safe arithmetic evaluator that validates input against `[0-9\s.+\-*/()]` and uses a reduce-based parser.

### MOD-3: Infinite `run()` retry loop
**File:** `app.ts:157-161`

If the EN framework never loads, `run()` retried every 100ms forever. In practice this rarely matters on EN-hosted pages, but on misconfigured pages it creates a silent infinite loop.

**Fix:** Added a retry counter, stops after 50 attempts (~5 seconds) with a clear error message.

---

## Moderate Issues NOT Fixed (Correct but worth noting)

### MOD-2: `innerHTML` with option-derived content
**Files:** `upsell-lightbox.ts`, `exit-intent-lightbox.ts`, `live-variables.ts`, `engrid.ts`

Content comes from developer-set options, not user form input. Safe in current usage but would become XSS vectors if content sources change. No action needed now.

### MOD-4: 1000ms hardcoded timeout for frequency loading
**File:** `app.ts:319-321`

The comment acknowledges a ~20% race condition with SwapAmounts. A MutationObserver would be more reliable, but the timeout works well enough for the vast majority of page loads.

### MOD-5: `==` instead of `===` throughout
All flagged instances compare strings to string literals -- `==` and `===` behave identically. No bugs result. A codebase-wide cleanup to `===` would improve consistency but isn't a correctness issue.

### MOD-6: NeverBounce array access without bounds check
**File:** `neverbounce.ts:64-65`

Runs inside a `setTimeout` after NB registration when the field should exist. Wrapping in a null check would be defensive but the current code works in practice.

---

## Good Code (Areas reviewed and solid)

### Singleton event system
**Files:** `events/donation-amount.ts`, `events/donation-frequency.ts`, `events/en-form.ts`, `events/processing-fees.ts`

The `getInstance()` pattern with strongly-typed-events gives type-safe pub/sub with exactly one event bus per concern. Solid architecture that keeps modules decoupled.

### `checkNested()` for deep property access
**File:** `engrid.ts:445-453`

Used consistently before accessing deeply nested EN framework properties. Prevents cascading TypeErrors from the third-party framework not being in the expected state.

### RememberMe incoming message validation
**File:** `remember-me.ts:318`

Correctly verifies `event.source === iframe.contentWindow` to prevent other windows from injecting data.

### `cleanAmount()` currency parsing
**File:** `engrid.ts:358-396`

Handles international currency formats (comma vs dot separators, varying decimal places). Correctly handles `1,234.56`, `1.234,56`, `1234`, and returns 0 for ambiguous inputs.

### `watchForError` callback deduplication
**File:** `engrid.ts:574-604`

Uses data attributes on the error element to prevent registering the same MutationObserver callback twice. Creative and effective.

### Try/catch around RememberMe and DebugPanel sessionStorage
**File:** `app.ts:353-364, 471-479`

Correctly handles browsers where localStorage/sessionStorage throws.

### Digital wallets MutationObserver with disconnect
**File:** `digital-wallets.ts:173-196`

Observer disconnects itself after detecting wallet buttons, preventing it from running indefinitely. Right pattern for one-time DOM detection.

### DataLayer PII handling
**File:** `data-layer.ts:26-60, 330-338`

Sensitive fields (CC numbers, bank accounts) are excluded. PII fields use `crypto.subtle.digest("SHA-256")` (the comment at line 8 mentioning Base64/btoa is outdated but the implementation is correct).

### VGS expiration date validation
**File:** `vgs.ts:218-276`

Month/year cross-validation correctly prevents selecting expired dates by disabling past months when current year is selected.

### Modal focus trap
**File:** `modal.ts:118-149`

Correct Tab/Shift+Tab focus wrapping. The handler is an arrow function property so `addEventListener`/`removeEventListener` correctly pair up.

### Modular feature initialization
**File:** `app.ts:185-467`

Features conditionally initialized based on options and page type. Each feature class guards its own constructor. Clean and prevents cross-feature interference.
