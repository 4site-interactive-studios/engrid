# Senior Code Review — Verifiable Bugs

## Scope
Reviewed TypeScript source in `packages/scripts/src` for runtime bugs that can be verified from code paths and current behavior.

---

## 1) `ENGrid.deepMerge` throws when `target` is undefined
- **Severity:** High (runtime crash)
- **Location:** `packages/scripts/src/engrid.ts` (`deepMerge`)
- **Why this is a bug:** The implementation dereferences `target[key]` before ensuring `target` exists. Passing `undefined` as `target` throws `TypeError`.

### Reproduction
```bash
node - <<'NODE'
const {ENGrid}=require('./packages/scripts/dist/engrid.js');
try { console.log(ENGrid.deepMerge(undefined,{a:{b:1}})); }
catch(e){ console.error('ERR', e.message); }
NODE
```

### Actual result
```text
ERR Cannot read properties of undefined (reading 'a')
```

### Expected result
A deep merge utility should safely initialize missing objects instead of throwing on `undefined` input.

---

## 2) `ENGrid.getOption` drops valid falsy option values
- **Severity:** High (configuration corruption)
- **Location:** `packages/scripts/src/engrid.ts` (`getOption`)
- **Why this is a bug:** `getOption` returns `window.EngridOptions[key] || null`, which converts `false`, `0`, and `""` to `null`. This makes it impossible to distinguish explicit values from missing options.

### Reproduction
```bash
node - <<'NODE'
const {ENGrid}=require('./packages/scripts/dist/engrid.js');
global.window={EngridOptions:{Debug:false, MinAmount:0, Label:''}};
console.log('Debug', ENGrid.getOption('Debug'));
console.log('MinAmount', ENGrid.getOption('MinAmount'));
console.log('Label', ENGrid.getOption('Label'));
NODE
```

### Actual result
```text
Debug null
MinAmount null
Label null
```

### Expected result
Should return `false`, `0`, and `""` respectively.

---

## 3) `ENGrid.getUrlParameter("name[]")` matches unintended keys by prefix
- **Severity:** Medium (incorrect data mapping)
- **Location:** `packages/scripts/src/engrid.ts` (`getUrlParameter` array branch)
- **Why this is a bug:** The current logic uses `key.startsWith(name.replace("[]", ""))`, so querying `foo[]` also captures unrelated keys like `fooBar`.

### Reproduction
```bash
node - <<'NODE'
const {ENGrid}=require('./packages/scripts/dist/engrid.js');
global.window={location:{search:'?fooBar=1&foo[0]=a&foo[1]=b'}};
console.log(JSON.stringify(ENGrid.getUrlParameter('foo[]')));
NODE
```

### Actual result
```text
[{"fooBar":"1"},{"foo[0]":"a"},{"foo[1]":"b"}]
```

### Expected result
Only `foo[...]` keys should be returned.

---

## 4) Malformed closing tags when injecting attribution markup
- **Severity:** Medium (DOM/rendering risk)
- **Location:** `packages/scripts/src/media-attribution.ts`
- **What is wrong:** The code inserts `<figattribution>` but closes with `</figure>` in both branches.
- **Why this is a bug:** This produces invalid/mismatched HTML and can yield unexpected DOM trees or rendering issues depending on browser parser behavior.

### Evidence
- Linked branch closes with `</figure>` instead of `</figattribution>`.
- Non-linked branch closes with `</figure>` instead of `</figattribution>`.

---

## 5) Auto-country initialization is skipped on network/parse failure
- **Severity:** Medium (initialization gap)
- **Location:** `packages/scripts/src/auto-country-select.ts`
- **What is wrong:** `this.init()` is called only inside the happy-path `fetch(...).then(...).then(...)` chain or in the non-fetch `else` branch.
- **Why this is a bug:** If `/cdn-cgi/trace` fails (network error, non-200, malformed response, JSON parse error), there is no `.catch(...)` and `this.init()` is never called, so downstream initialization logic is skipped entirely.

### Evidence
- No `.catch(...)` is attached to the fetch chain.
- `this.init()` only appears inside success path or `else` block.

---

## 6) `RememberMe` attempts to set `checked` on a wrapper `<div>` instead of the checkbox input
- **Severity:** Medium (UX/state consistency)
- **Location:** `packages/scripts/src/remember-me.ts`
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

## 7) Frequency-based min/max amount validation is not initialized on load
- **Severity:** Medium (validation correctness)
- **Location:** `packages/scripts/src/min-max-amount.ts`
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

## 8) `CountryDisable` can throw when option is not configured
- **Severity:** High (runtime crash)
- **Location:** `packages/scripts/src/country-disable.ts`
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
1. **High:** `ENGrid.deepMerge` undefined target crash.
2. **High:** `ENGrid.getOption` falsy-value loss.
3. **High:** `country-disable.ts` unguarded option access.
4. **Medium:** `ENGrid.getUrlParameter` prefix overmatch in array branch.
5. **Medium:** `min-max-amount.ts` FAMNT init gap.
6. **Medium:** `remember-me.ts` checkbox state mismatch.
7. **Medium:** `media-attribution.ts` malformed closing tags.
8. **Medium:** `auto-country-select.ts` missing fetch failure fallback.
