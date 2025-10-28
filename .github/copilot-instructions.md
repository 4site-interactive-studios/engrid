# Copilot Instructions for ENgrid

## High-Level Architecture
- ENgrid is a Lerna workspace with two publishable packages: `packages/scripts` (TypeScript) and `packages/styles` (SCSS). Only edit the sources; `dist/` artifacts are generated.
- `packages/scripts/src/app.ts` orchestrates runtime features by instantiating helpers exported via `packages/scripts/src/index.ts`.
- `ENGrid` (`packages/scripts/src/engrid.ts`) centralizes DOM helpers, Engaging Networks integrations, and shared utilities (URL params, field setters, body data attributes).
- Front-end behaviour is driven by Engaging Networks globals (`window.pageJson`, `window.EngagingNetworks`, `window.EngridOptions`) and data attributes stamped on `<body>`.

## Key Workflows
- Install dependencies once with `npm install` at repo root; Lerna bootstraps package links.
- Build everything via `npm run build` (runs `lerna bootstrap` then `lerna run build`), or watch with `npm run watch` (`lerna run watch`).
- Within a package you can run `npm run watch` to recompile just scripts (tsc via nodemon) or styles (sass via nodemon).
- Version bumps rely on `npm run version`, which executes `write-version.js` to sync `AppVersion` and then rebuilds.

## Patterns & Conventions
- Globals are hung off `window.EngridOptions`; override per page through `window.EngridPageOptions` before `new App(...)` runs.
- Features toggle themselves by checking DOM/body data attributes (`data-engrid-*`). For example, `digital-wallets.ts` only defaults Stripe wallets when `data-engrid-payment-type-option-*="true"`.
- Evented logic uses singletons in `packages/scripts/src/events` (e.g., `DonationAmount.getInstance()`); prefer extending those patterns over ad-hoc listeners.
- Styles aggregate through `packages/styles/src/main.scss`, which imports feature partials (digital wallets, tidycontact, etc.) and layout themes under `packages/styles/src/themes/`.

## Integration Notes
- Loader behaviour (`packages/scripts/src/loader.ts`) swaps CSS/JS assets based on `window.EngridLoader` or URL flags like `?assets=local&engridcss=false`; respect this when altering bootstrapping.
- Use helpers from the `ENGrid` abstract class (`packages/scripts/src/engrid.ts`) where possible.
- Many helpers expect the Engaging Networks form markup (`form.en__component`); use `ENGrid.checkNested` or guard early when working outside that environment.
- Client-specific repos in sibling folders consume the built assets; keep shared business logic in core packages unless a customization truly belongs downstream.
- Tip: when debugging, `?debug=true` sets body `data-engrid-debug`, unlocking debug panels and conditional UI.

## When in Doubt
- Search in `packages/scripts/src` before creating new utilities; most EN behaviours already exist (currency, remember-me, plaid, vgs).
- Do not hand-edit files under any `dist/` directory—run the relevant build instead.
- Follow repo Prettier config (`.prettierrc.js`); formatting is enforced even though there are no automated tests.
- Document new options by updating the interfaces in `packages/scripts/src/interfaces` and exposing them through `OptionsDefaults`.