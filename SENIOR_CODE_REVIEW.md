# Senior Code Review Findings (Verifiable Bugs)

## 1) Malformed closing tags when injecting attribution markup
- **File:** `packages/scripts/src/media-attribution.ts`
- **What is wrong:** The code inserts `<figattribution>` but closes with `</figure>` in both branches.
- **Why this is a bug:** This produces invalid/mismatched HTML and can yield unexpected DOM trees or rendering issues depending on browser parser behavior.
- **Evidence:**
  - Linked branch closes with `</figure>` instead of `</figattribution>`.
  - Non-linked branch closes with `</figure>` instead of `</figattribution>`.

## 2) Auto-country initialization is skipped on network/parse failure
- **File:** `packages/scripts/src/auto-country-select.ts`
- **What is wrong:** `this.init()` is called only inside the happy-path `fetch(...).then(...).then(...)` chain or in the non-fetch `else` branch.
- **Why this is a bug:** If `/cdn-cgi/trace` fails (network error, non-200, malformed response, JSON parse error), there is no `.catch(...)` and `this.init()` is never called, so downstream initialization logic is skipped entirely.
- **Evidence:**
  - No `.catch(...)` is attached to the fetch chain.
  - `this.init()` only appears inside success path or `else` block.
