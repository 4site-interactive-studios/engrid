# Senior Code Review: Verifiable Bugs

## Scope
Reviewed TypeScript source in `packages/scripts/src` for runtime bugs that can be verified from code paths and current behavior.

---

## 1) `RememberMe` attempts to set `checked` on a wrapper `<div>` instead of the checkbox input

- **File:** `packages/scripts/src/remember-me.ts`
- **Relevant code path:** `insertRememberMeOptin()`
- **Issue:** The code queries `#remember-me-opt-in` and casts it to `HTMLInputElement`, but that node is created as a `<div>`. In the `else if (this.rememberMeOptIn)` branch, it assigns `rememberMeOptInField.checked = true`, which does not update the real checkbox (`#remember-me-checkbox`).
- **Why this is a bug:** Returning users with remembered data can see inconsistent state (opt-in intended to be checked, UI checkbox not actually checked).

### Verification steps
1. Ensure the `remember-me-opt-in` wrapper already exists in DOM (e.g., re-init path).
2. Set `this.rememberMeOptIn = true` before entering the `else if` branch.
3. Run `insertRememberMeOptin()`.
4. Observe that `#remember-me-checkbox.checked` is unchanged, while only a non-semantic property may be attached to the wrapper div.

### Suggested fix
In the existing-element branch, target `#remember-me-checkbox` and set its `checked` property instead of mutating the wrapper element.

---

## 2) Frequency-based min/max amount validation is not initialized on load

- **File:** `packages/scripts/src/min-max-amount.ts`
- **Relevant code path:** `setValidationConfigFromEN()` for validator type `FAMNT`
- **Issue:** For `FAMNT`, min/max are only updated inside `this._frequency.onFrequencyChange.subscribe(...)`. There is no immediate initialization for the current selected frequency when the class starts.
- **Why this is a bug:** Until the user toggles frequency, validation can use stale defaults (`MinAmount`/`MaxAmount` options), causing incorrect accept/reject behavior on first submit.

### Verification steps
1. Configure an EN validator with `FAMNT` format (e.g., `SINGLE:10~100000|MONTHLY:5~100000`).
2. Load page with initial frequency already selected (e.g., monthly) and do **not** change frequency.
3. Enter an amount valid for monthly but invalid for defaults (or vice versa).
4. Trigger validation and observe it uses non-`FAMNT` initialized values until frequency changes.

### Suggested fix
After wiring the subscription, immediately compute/apply min/max for the current frequency (or refactor shared logic to an `applyRangeForFrequency(freq)` helper and call it both on init and on change).

---

## 3) `CountryDisable` can throw when option is not configured

- **File:** `packages/scripts/src/country-disable.ts`
- **Relevant code path:** constructor
- **Issue:** `const CountryDisable = ENGrid.getOption("CountryDisable") as string[];` is followed by `CountryDisable.length` without null/undefined guard.
- **Why this is a bug:** If the option is absent, accessing `.length` on `undefined` throws and can break downstream script initialization.

### Verification steps
1. Run page without setting `CountryDisable` option.
2. Instantiate `CountryDisable`.
3. Observe runtime error similar to: `Cannot read properties of undefined (reading 'length')`.

### Suggested fix
Default to an empty array and guard the option shape:
- `const countryDisable = ENGrid.getOption("CountryDisable") as string[] | undefined;`
- `const disabled = Array.isArray(countryDisable) ? countryDisable : [];`

---

## Recommended Priority
1. **High:** `country-disable.ts` unguarded option access (hard runtime exception risk).
2. **Medium:** `min-max-amount.ts` FAMNT init gap (validation correctness risk).
3. **Medium:** `remember-me.ts` checkbox state mismatch (UX/state consistency risk).
