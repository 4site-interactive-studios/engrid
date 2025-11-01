## Onboarding Notes

**Task summary**
- Objective: research the ENgrid repo and surface at least one genuine bug. No fix requested yet; focus is locating and describing a defect.
- Primary technology stack: TypeScript/SCSS monorepo managed via Lerna-style packages. Active scripts live in `packages/scripts/src` with TypeScript entrypoint `index.ts` that re-exports numerous functional modules (forms, analytics, utilities). Styles live under `packages/styles`.

**Key instructions & constraints**
- Must document onboarding thoroughly (this file) before proceeding with implementation work.
- Prefer absolute paths with tooling commands; avoid undoing existing workspace changes.
- When/if VBA comes up, Windows vs. Mac compatibility must be handled (unlikely for this task but noted).

**Repository reconnaissance**
- Top-level artifacts: `README.md`, `CHANGELOG.md`, `package.json`, `lerna.json`, and shared `tsconfig.json`. Indicates multi-package setup, likely built with TypeScript + Webpack.
- `packages/scripts` (`@4site/engrid-scripts` v0.22.20) supplies the runtime JS. Its `package.json` exposes `build` (plain `tsc`) and `watch` via nodemon. External deps are minimal: `shuffle-seed`, `strongly-typed-events`.
- `packages/styles` manages SCSS assets, exporting compiled CSS in `dist/`.
- TypeScript sources of interest include `data-layer.ts`, `live-variables.ts`, `remember-me.ts`, etc.—supporting Engaging Networks donation/advocacy page features.

**Notable file reconnaissance**
- `README.md` details ENgrid’s purpose (Engaging Networks page templates) and enumerates feature set across giving, advocacy, accessibility, developer tooling, and analytics enhancements.
- `packages/scripts/src/data-layer.ts` defines a `DataLayer` singleton that listens to form interactions, normalizes data into `window.dataLayer`, and handles “end of gift” events persisted in `sessionStorage`. Sensitive fields are excluded; selected fields pass through `btoa` before logging.

**Initial observations & potential risk areas**
- `DataLayer.transformJSON` uppercases and hyphenates string values; could introduce collisions or data loss for freeform user inputs (worth validating against analytics expectations).
- Base64 “hashing” via `btoa` is explicitly non-cryptographic; doc comment warns to replace with real hash if needed—probably intentional, not the bug to report unless requirement contradicts.
- Form event listeners rely on `.en__component--advrow` structure; bug might emerge if elements fall outside that container.

**Investigation plan**
- Prioritize reviewing analytics-related modules (`data-layer.ts`, related utilities) to uncover logic errors (e.g., missing event pushes, incorrect selectors, mishandled session storage).
- Audit recent TypeScript modules around this area for regressions (search for TODO/FIXME, check event subscriptions, cross-reference with README claims).
- Consider dynamic scenarios (multi-page forms, RememberMe integration, donation vs advocacy) for mismatches in dataLayer emission. Look for conditions where required events never fire or values leak.

**Open questions / follow-ups**
- None at this time; will circle back if repo lacks context to confirm expected analytics behavior.

