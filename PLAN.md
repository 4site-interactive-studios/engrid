# ENgrid Documentation Generation Plan

## Problem Statement
The ENgrid project has approximately 75 TypeScript files in `packages/scripts/src/`, but only 19 have documentation links in their headers. We need to create comprehensive documentation for all undocumented files, following the ENgrid documentation standards.

## Approach
1. Identify all files that need documentation (excluding app.ts, interfaces/, events/)
2. Categorize files by functionality/feature area
3. Group related files that can share documentation
4. Generate documentation following the ENgrid documentation writing guidelines
5. Add "Docs:" links to the file headers pointing to the generated documentation

## Files Already Documented (19)
- click-to-expand.ts
- custom-premium.ts
- ecard-to-target.ts
- embedded-ecard.ts
- exit-intent-lightbox.ts
- frequency-upsell-modal.ts
- frequency-upsell.ts
- iframe.ts
- optin-ladder.ts
- page-background.ts
- post-donation-embed.ts
- preferred-payment-method.ts
- remember-me.ts
- required-if-visible.ts
- tidycontact.ts
- translate-fields.ts
- upsell-checkbox.ts
- upsell-lightbox.ts
- welcome-back.ts

## Files Needing Documentation (~56)

### Core/Infrastructure
- [ ] engrid.ts (ENGrid Core Functions) - HIGH PRIORITY
- [ ] loader.ts
- [ ] logger.ts
- [ ] cookie.ts
- [ ] version.ts
- [ ] deprecated.ts

### Form Field Behavior
- [ ] a11y.ts
- [ ] autocomplete.ts
- [ ] capitalize-fields.ts
- [ ] checkbox-label.ts
- [ ] input-has-value-and-focus.ts
- [ ] input-placeholders.ts
- [ ] show-hide-radio-checkboxes.ts

### Form Validation
- [ ] en-validators.ts
- [ ] postal-code-validator.ts
- [ ] neverbounce.ts
- [ ] freshaddress.ts

### Data & Attributes
- [ ] data-attributes.ts
- [ ] data-hide.ts
- [ ] data-layer.ts
- [ ] data-replace.ts
- [ ] set-attr.ts
- [ ] url-params-to-body-attrs.ts
- [ ] url-to-form.ts

### Payment Processing
- [ ] digital-wallets.ts
- [ ] apple-pay.ts
- [ ] stripe-financial-connections.ts
- [ ] vgs.ts
- [ ] give-by-select.ts
- [ ] custom-currency.ts
- [ ] live-currency.ts

### Donations & Amounts
- [ ] amount-label.ts
- [ ] other-amount.ts
- [ ] min-max-amount.ts
- [ ] swap-amounts.ts
- [ ] show-if-amount.ts
- [ ] live-frequency.ts
- [ ] set-recurr-freq.ts

### UI Components
- [ ] modal.ts (abstract component for lightboxes)
- [ ] mobile-cta.ts
- [ ] menu.js
- [ ] progress-bar.ts
- [ ] ticker.ts
- [ ] skip-link.ts

### Advocacy/eCards
- [ ] advocacy.ts
- [ ] ecard.ts

### Special Features
- [ ] add-name-to-message.ts
- [ ] auto-country-select.ts
- [ ] auto-year.ts
- [ ] autosubmit.ts
- [ ] branding-html.ts
- [ ] country-disable.ts
- [ ] country-redirect.ts
- [ ] debug-hidden-fields.ts
- [ ] debug-panel.ts
- [ ] event-tickets.ts
- [ ] expand-region-name.ts
- [ ] fast-form-fill.ts
- [ ] live-variables.ts
- [ ] media-attribution.ts
- [ ] premium-gift.ts
- [ ] show-if-present.ts
- [ ] src-defer.ts
- [ ] supporter-hub.ts
- [ ] thank-you-page-conditional-content.ts
- [ ] universal-opt-in.ts
- [ ] us-only-form.ts

### Not Needing Docs
- [ ] app.ts (excluded per guidelines)
- [ ] index.ts (exports only, no functionality)

## Workplan

### Phase 1: Core & Infrastructure (6 files)
- [ ] Document engrid.ts as "ENGrid Core Functions"
- [ ] Document loader.ts
- [ ] Document logger.ts
- [ ] Document cookie.ts
- [ ] Document version.ts
- [ ] Document deprecated.ts

### Phase 2: Form Fields & Validation (13 files)
- [ ] Document form field behavior files (a11y, autocomplete, capitalize, checkbox-label, input-has-value-and-focus, input-placeholders, show-hide-radio-checkboxes)
- [ ] Document validation files (en-validators, postal-code-validator, neverbounce, freshaddress)

### Phase 3: Data & Attributes (7 files)
- [ ] Document data-* files (data-attributes, data-hide, data-layer, data-replace)
- [ ] Document set-attr, url-params-to-body-attrs, url-to-form

### Phase 4: Payment & Donations (13 files)
- [ ] Document payment files (digital-wallets, apple-pay, stripe-financial-connections, vgs, give-by-select, custom-currency, live-currency)
- [ ] Document donation/amount files (amount-label, other-amount, min-max-amount, swap-amounts, show-if-amount, live-frequency, set-recurr-freq)

### Phase 5: UI Components (6 files)
- [ ] Document modal.ts
- [ ] Document mobile-cta, menu.js, progress-bar, ticker, skip-link

### Phase 6: Advocacy & Special Features (18 files)
- [ ] Document advocacy.ts and ecard.ts
- [ ] Document remaining special feature files

### Phase 7: Update File Headers
- [ ] Add "Docs:" comments to all newly documented files

## Notes
- Follow ENgrid documentation writing guidelines strictly
- Use frontmatter (title, description) for every file
- Group related files when appropriate (e.g., upsell-checkbox and upsell-lightbox share docs)
- Use callouts for important information
- Document all configuration options in tables
- Include code examples
- Flag unclear behavior with TODO comments for human review
- Place all generated docs in `reference-materials/docs/generated/`
