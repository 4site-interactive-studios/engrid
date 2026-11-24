# ENgrid for developers

[![npm version - scripts](https://img.shields.io/npm/v/@4site/engrid-scripts?label=%404site%2Fengrid-scripts)](https://www.npmjs.com/package/@4site/engrid-scripts)
[![npm version - styles](https://img.shields.io/npm/v/@4site/engrid-styles?label=%404site%2Fengrid-styles)](https://www.npmjs.com/package/@4site/engrid-styles)
[![License: Unlicense](https://img.shields.io/badge/license-Unlicense-blue.svg)](https://github.com/4site-interactive-studios/engrid/blob/main/LICENSE)

Setup, repository structure, developer tools and the class, option and source file reference for every capability in [FEATURES.md](FEATURES.md).

## Getting started

Start a new theme from the template repository:

```shell
git clone https://github.com/4site-interactive-studios/engrid-template.git my-org-theme
cd my-org-theme
npm install
npm run watch
```

For full setup instructions, see [Creating an ENgrid Theme](https://engrid.4sitestudios.com/docs/v2/creating-an-engrid-theme).

## Repository structure

This is a Lerna monorepo with two packages, written in TypeScript and SCSS. Themes install both as npm dependencies and extend them.

- **[@4site/engrid-scripts](https://www.npmjs.com/package/@4site/engrid-scripts)**: the TypeScript that powers ENgrid's behavior
- **[@4site/engrid-styles](https://www.npmjs.com/package/@4site/engrid-styles)**: the SCSS base styles and layouts

## Working on ENgrid itself

```shell
git clone https://github.com/4site-interactive-studios/engrid.git
cd engrid
npm install
npm run build
npm run watch
```

## Developer tools

| Tool | What it does | How to use it |
| --- | --- | --- |
| Debug panel quick-fill | Fills the form with test data | `Debug` or `?debug=true` |
| Debug panel layout and theme switcher | Switches layout, theme and sub-theme live | `Debug` or `?debug=true` |
| Debug panel force submit | Forces the form to submit | `Debug` or `?debug=true` |
| Debug panel edit link | Links to the page in EN's page builder | `Debug` or `?debug=true` |
| Debug outlines | Outlines layout sections and image sizes | `data-engrid-debug` on `<body>` |
| Hidden field inspector | Shows hidden inputs as visible labeled fields | `Debug` |
| Brand guide test markup | Loads sample markup to style a theme against | `?development=branding` |
| Asset swapping | Loads local, cache-flushed or branch builds on a live page | `?assets=` URL parameter, `window.EngridLoader` |
| CSS and JS kill switches | Turns ENgrid's CSS or JS off to isolate problems | `?engridcss=false`, `?engridjs=false` |
| Debug logger | Styled console logging that stays silent in production | `?debug=log` |
| Per-page option overrides | Overrides theme options on a single page | `window.EngridPageOptions` |
| Form lifecycle hooks | Submit, validate and error hooks, with async support | `EnForm` events and option callbacks |
| Amount, frequency, fee and country events | Subscribe to changes in gift amount, frequency, fee and country | Event singletons |
| Helper function library | 45 helpers for fields, amounts, page data, errors and more | `ENGrid` static methods |
| Accessible modal base class | Focus trap, Escape to close and click-outside handling | Extend `Modal` |
| Cookie helper | Read and write cookies | Import `cookie` |
| Missing page data warning | Console warning when EN's page data is not exposed | Always on |
| SCSS functions | Helpers for SVG colors and property fallbacks | Build time |
| Legacy name aliases | Keeps seven renamed CSS properties working | Always on |

<details>
<summary>ENgrid by the numbers</summary>

| Item | Count |
| --- | --- |
| Theme options | 57 |
| CSS custom properties for theming | 446 |
| Helper and utility classes | About 265 |
| Data attributes set on the page body | 64 |
| Helper functions | 45 |
| Page layouts | 6, plus an embedded layout |
| Events you can subscribe to | 7 emitters |

Counted from the source at v0.28.11.

</details>

## Contributing

Issues and pull requests are welcome at [github.com/4site-interactive-studios/engrid](https://github.com/4site-interactive-studios/engrid/issues). CSS property names follow [NAMING.md](NAMING.md).

## How to turn each feature on

### Donations and payments

| Capability | How it is turned on | Source |
| --- | --- | --- |
| Live amount and frequency on the submit button | `$AMOUNT` / `$FREQUENCY` in the button label | `live-variables.ts` |
| Live giving amount and frequency text | `.live-giving-amount`, `.live-giving-frequency` | `live-variables.ts` |
| Live monthly upsell amount text | `.live-giving-upsell-amount` | `live-variables.ts` |
| Click-to-convert monthly links | `.monthly-upsell` links | `live-variables.ts` |
| Click-to-submit links | `.form-submit` links | `live-variables.ts` |
| Amount lists swapped per frequency | `window.EngridAmounts` or `engrid-amounts` URL parameter | `swap-amounts.ts` |
| Processing fee (tip jar) checkbox | EN fee-cover field, or `supporter.processing_fees` checkbox with fee data attributes | `processing-fees.ts` |
| Premiums filtered by amount and frequency | `CustomPremium` (off by default), premium pages | `custom-premium.ts` |
| Premium title merge tag | `{$PREMIUMTITLE}` | `premium-gift.ts` |
| Amounts and frequencies as buttons | `radio-to-buttons` and count classes | `_engrid-donations.scss` |
| Per-frequency amount suffixes | `--give-*-donation-amount-appended-label` properties | `_engrid-donations.scss` |
| Submit button lock with spinner | Always on | `live-variables.ts`, `engrid.ts`, `_engrid-loading-animations.scss` |
| Recurring gift setting kept in sync | Always on | `live-variables.ts` |
| Sticky Next Suggested Gift | `StickyNSG` (off by default) | `sticky-nsg.ts` |
| Other amount handling | Always on | `other-amount.ts` |
| Other amount numeric keypad | Always on | `other-amount.ts` |
| Currency symbol on amount buttons | `AddCurrencySymbol` (on by default) | `amount-label.ts` |
| Minimum and maximum gift validation | Donation pages; `MinAmount`, `MaxAmount` and message options | `min-max-amount.ts` |
| Amount limits read from EN validators | `UseAmountValidatorFromEN` (off by default) | `min-max-amount.ts` |
| Auto-updated card expiry years | `AutoYear` (off by default) | `auto-year.ts` |
| Give-by-select payment tiles | Always on | `give-by-select.ts` |
| Preferred payment method | `PreferredPaymentMethod` (off by default) | `preferred-payment-method.ts` |
| Payment method from the URL | `?payment=` URL parameter | `preferred-payment-method.ts` |
| Frequency set by links or checkboxes | `setRecurrFreq-{FREQ}` links, `engrid.recurrfreq` checkboxes | `set-recurr-freq.ts` |
| Click anywhere to select a premium | Premium pages | `premium-gift.ts` |
| Premium block styling | Premium pages | `premium-gift.ts`, `_engrid-premiums.scss` |
| Stripe bank modal submit fix | Always on | `stripe-financial-connections.ts` |
| Wallet fallback to card | Always on | `digital-wallets.ts` |
| Supporter Hub card update shortcut | Supporter Hub pages | `supporter-hub.ts` |
| Supporter Hub currency label fix | Supporter Hub pages | `supporter-hub.ts` |
| Supporter Hub duplicate submit guard | Supporter Hub pages | `supporter-hub.ts` |
| Custom Apple Pay | `applePay` (off by default) plus merchant ID | `apple-pay.ts`, `_engrid-apple-pay.scss` |
| Stripe digital wallets (Apple Pay, Google Pay) | Donation and event pages with EN's wallet element | `digital-wallets.ts`, `_engrid-digital-wallets.scss` |
| PayPal One Touch and Venmo | Donation and event pages with EN's wallet element | `digital-wallets.ts` |
| Donor-advised fund giving (Chariot) | Donation and event pages with EN's wallet element | `digital-wallets.ts` |
| VGS secure card fields | EN VGS fields on the page; `VGS` option for styling | `vgs.ts` |

### Upsells and conversion

| Capability | How it is turned on | Source |
| --- | --- | --- |
| Upsell lightbox | `window.EngridUpsell` | `upsell-lightbox.ts`, `_engrid-modal.scss` |
| Upsell checkbox | `window.EngridUpsell.upsellCheckbox` | `upsell-checkbox.ts` |
| Frequency upsell modal | `window.EngridFrequencyUpsell` | `frequency-upsell.ts`, `frequency-upsell-modal.ts` |
| Exit intent lightbox | `window.EngridExitIntent` | `exit-intent-lightbox.ts`, `_engrid-exit-intent-lightbox.scss` |
| Mobile call-to-action button | `MobileCTA` (off by default) | `mobile-cta.ts`, `_engrid-mobile-cta.scss` |
| Post-donation second-gift embed | `<engrid-post-donation>` tag on the thank-you page | `post-donation-embed.ts` |
| Opt-in ladder | Theme instantiates `OptInLadder`; `OptInLadder` option | `optin-ladder.ts` |
| Double the Donation widget styling | Always on | `_engrid-double-the-donation.scss` |

### Personalization and conditional content

| Capability | How it is turned on | Source |
| --- | --- | --- |
| Country auto-detection | Always on (needs Cloudflare trace on the page domain) | `auto-country-select.ts` |
| Hide elements from the URL | `engrid_hide[...]` URL parameter | `data-hide.ts` |
| URL merge tags | `{engrid_data~[key]~[default]}` plus `engrid_data[key]` URL parameter | `data-replace.ts`, `_engrid-data-replace.scss` |
| Live frequency merge tags | `[[frequency]]` | `live-frequency.ts` |
| Remember Me | `RememberMe` (off by default) | `remember-me.ts` |
| Remember Me across domains | `RememberMe.remoteUrl` | `remember-me.ts` |
| Remember Me encryption | `RememberMe.encryptData` | `remember-me.ts` |
| Click-to-reveal content | `setattr--{attr}--{value}` class | `set-attr.ts` |
| Conditional content by radio or checkbox | `engrid__{field}-{value}` classes | `show-hide-radio-checkboxes.ts` |
| Conditional content by amount | `showifamount-*` classes | `show-if-amount.ts`, `_engrid-show-if-amount.scss` |
| Conditional content by question presence | `engrid__supporterquestions{id}-present` / `-absent` | `show-if-present.ts` |
| Conditional content by frequency | `recurring-frequency-*-show` / `-hide` classes | `_engrid-donations.scss` |
| Conditional content by payment type | `showif-*` / `hideif-*` payment classes | `_engrid-digital-wallets.scss` |
| Conditional content by premium | `showif-has-premium`, `showif-no-premium` | `_engrid-premiums.scss` |
| Conditional content on the thank-you page | After a completed gift | `thank-you-page-conditional-content.ts` |
| Sticky prepopulation | `StickyPrepopulation` (off by default) | `sticky-prepopulation.ts` |
| Page variants from a link | `data-engrid-*` URL parameters | `url-params-to-body-attrs.ts` |
| Welcome back | `WelcomeBack` (off by default) | `welcome-back.ts`, `_engrid-welcome-back.scss` |

### Forms and fields

| Capability | How it is turned on | Source |
| --- | --- | --- |
| Autosubmit from a link | `?autosubmit=Y` | `autosubmit.ts` |
| Fast form fill | `.fast-personal-details`, `.fast-address-details` | `fast-form-fill.ts`, `_engrid-fast-form-fill.scss` |
| US-only form | `.us-only-form` on a form block | `us-only-form.ts` |
| Multi-step progress bar | `ProgressBar` plus `data-engrid-progress-indicator` markup | `progress-bar.ts`, `_engrid-progress-bar.scss` |
| Field widths and positions | `iN-*` classes | `_engrid-components-layout.scss` |
| Visually hidden labels | `hide-label`, `hide-labels`, `hide` | `_engrid-components-layout.scss` |
| No flash of unfinished content | `hide-until-*-js-loading-finished` | `_engrid-components-layout.scss` |
| Fancy inline errors | `data-engrid-errors="fancy"` on `<body>` | `_engrid-fancy-errors.scss` |
| Field layout helpers | `direction-column`, `inline-other`, `label-tooltip` | `_engrid-fields.scss` |
| Required-field asterisks | `data-highlight-required-fields` on `<body>` | `_engrid-theme-flex2.scss` |
| Browser autofill hints | Always on | `autocomplete.ts` |
| Per-page checkbox labels | `.checkbox-label` block | `checkbox-label.ts`, `_engrid-checkbox-label.scss` |
| Country list trimming | `CountryDisable` | `country-disable.ts` |
| Floating labels | Always on | `input-has-value-and-focus.ts` |
| Input placeholders | `data-engrid-add-input-placeholders` on `<body>`; `Placeholders` option for custom text | `input-placeholders.ts` |
| Universal opt-in | `universal-opt-in` class | `universal-opt-in.ts` |
| Prefill fields from the URL | URL parameter named after any field | `url-to-form.ts` |
| Error styling | Always on | `_engrid-errors.scss` |
| Chrome autofill fix | Always on | `_engrid-autofill.scss` |

### Advocacy, eCards and events

| Capability | How it is turned on | Source |
| --- | --- | --- |
| eCard to target | `window.EngridEcardToTarget` | `ecard-to-target.ts` |
| Embedded eCard on donation pages | `window.EngridEmbeddedEcard` | `embedded-ecard.ts`, `_engrid-embedded-ecard.scss` |
| Sender name added to messages | Email-to-target pages | `add-name-to-message.ts` |
| Click a target row to select it | Advocacy and email-to-target pages | `advocacy.ts` |
| eCard details from the URL | `engrid_ecard.schedule`, `.name`, `.email` URL parameters | `ecard.ts` |
| eCard auto-add recipient | eCard pages | `ecard.ts` |
| eCard styling | eCard pages | `_engrid-ecards.scss` |
| Event ticket price formatting | Pages with ticket elements | `event-tickets.ts`, `_engrid-event-tickets.scss` |
| Event ticket and occurrence layout | Event pages | `_engrid-events.scss` |
| Social share block styling | Always on | `_engrid-social-share.scss` |
| Click-to-call styling | Click-to-call pages | `_engrid-click-to-call.scss` |
| Tweet-to-target styling | Tweet-to-target pages | `_engrid-tweet-to-target.scss` |
| Letter-to-target styling | Email-to-target pages | `_engrid-letter-to-target.scss` |

### Accessibility

| Capability | How it is turned on | Source |
| --- | --- | --- |
| Screen-reader-only content | `engrid__sr-only` | `_engrid-a11y.scss` |
| Required and invalid states for screen readers | Always on | `a11y.ts` |
| Fallback field labels | Always on | `a11y.ts` |
| Radio groups announced as groups | Always on | `a11y.ts` |
| Spoken error summary | Always on | `a11y.ts` |
| Errors placed after their field | Always on | `a11y.ts` |
| Focus on first error | Always on | `a11y.ts` |
| eCard image alt text | eCard pages | `a11y.ts` |
| Accessible eCard form and preview | eCard pages | `ecard.ts` |
| Skip to main content link | `SkipToMainContentLink` (on by default) | `skip-link.ts`, `_engrid-skip-link.scss` |
| Keyboard focus outlines | Always on | `_engrid-premiums.scss`, `_engrid-ecards.scss`, `_engrid-click-to-expand.scss` |
| Accessible premium gifts | Premium pages | `premium-gift.ts` |
| Accessible Supporter Hub overlays | Supporter Hub pages | `supporter-hub.ts` |
| Supporter Hub announcements | Supporter Hub pages | `supporter-hub.ts` |

### Layout, media and display

| Capability | How it is turned on | Source |
| --- | --- | --- |
| Six page layouts | `data-engrid-layout` on `<body>` | `layouts` |
| 18-section page grid | Section classes on EN columns | `_engrid-layout.scss` |
| Background video cropping | `crop-on-left`, `crop-on-right` | `_engrid-background-image.scss` |
| Rotating backgrounds | Theme instantiates `PageBackgroundRotation` | `page-background-rotation.ts`, `_engrid-page-background-rotation.scss` |
| Media attribution | `data-attribution-source` attributes; `MediaAttribution` (on by default) | `media-attribution.ts`, `_engrid-media-attribution.scss` |
| Click to expand | `div.click-to-expand`; `ClickToExpand` (on by default) | `click-to-expand.ts`, `_engrid-click-to-expand.scss` |
| Ticker | `.engrid-ticker` | `ticker.ts`, `_engrid-ticker.scss` |
| Flip | `flip-horizontally`, `flip-vertically` | `_engrid-flip.scss` |
| Grayscale | `grayscale` classes | `_engrid-grayscale.scss` |
| Text highlight | `highlight` | `_engrid-highlight.scss` |
| Animated ellipsis | `ellipsis-loader` | `_engrid-ellipsis-animation.scss` |
| Empty sections collapse | Always on | `data-attributes.ts`, `_engrid-layout.scss` |
| Page context for styling | Always on | `data-attributes.ts` |
| Page background image or video | `.page-backgroundImage` block | `page-background.ts`, `_engrid-background-image.scss` |
| Banner image as background | `UseBodyBannerImageAsBackground` | `page-background.ts`, `_engrid-banner-image.scss` |
| Lazy-loaded images | `SrcDefer` (on by default) | `src-defer.ts` |
| Background video autoplay | `SrcDefer` (on by default) | `src-defer.ts` |
| Responsive EN base styles | Always on | `_engrid-enpage-overrides.scss` |
| Column fixes | Always on | `_engrid-columns.scss` |
| Responsive media | Always on | `_engrid-media.scss` |
| Fluid thermometer | Always on | `_engrid-thermometer.scss` |
| Supporter Hub layout fixes | Supporter Hub pages | `_engrid-supporter-hub.scss` |

### Data quality and validation

| Capability | How it is turned on | Source |
| --- | --- | --- |
| Auto-capitalization | `CapitalizeFields` (off by default) | `capitalize-fields.ts` |
| Live field validation | `ENValidators` (off by default) | `en-validators.ts` |
| Full region name capture | `RegionLongFormat` | `expand-region-name.ts` |
| US ZIP validation and formatting | `PostalCodeValidator` (off by default) | `postal-code-validator.ts` |
| Required only when visible | `i-required`, `iN-required` classes | `required-if-visible.ts` |
| FreshAddress email validation | `FreshAddress` | `freshaddress.ts` |
| NeverBounce email validation | `NeverBounceAPI` | `neverbounce.ts`, `_engrid-neverbounce.scss` |
| TidyContact address standardization (paid service) | `TidyContact` | `tidycontact.ts` |
| TidyContact phone standardization (paid service) | `TidyContact` | `tidycontact.ts`, `_engrid-tidycontact.scss` |

### International

| Capability | How it is turned on | Source |
| --- | --- | --- |
| Country redirect | `CountryRedirect` | `country-redirect.ts` |
| Currency by country | `CustomCurrency` | `custom-currency.ts` |
| Live currency merge tags | `[$]`, `[$$$]` | `live-currency.ts` |
| Address fields by country | `TranslateFields` (on by default) | `translate-fields.ts` |
| Custom field label translations | `window.EngridTranslate` | `translate-fields.ts`, `translate-options.ts` |
| Translated interface text | Page language; `window.EngridI18n` to extend | `engrid.ts`, `i18n-options.ts` |
| Number format options | `ThousandsSeparator`, `DecimalSeparator`, `DecimalPlaces` | `engrid.ts`, `options.ts` |

### Embeds

| Capability | How it is turned on | Source |
| --- | --- | --- |
| Auto-resizing embedded forms | Always on | `iframe.ts` |
| Embedded page status messages | Always on | `iframe.ts` |
| Embedded layout | `data-engrid-embedded` on `<body>` | `_engrid-layout-embedded.scss` |
| Conditional content in iframes | `showif-iframe`, `hideif-iframe` | `_engrid-layout-embedded.scss` |
| Iframe queue | Theme instantiates `IframeQueue`; `window.EngridIframeQueue` | `iframe-queue.ts` |
| Scroll to first error | Always on | `iframe.ts` |
| eCard preview from an embed | Always on | `ecard-preview.ts` |

### Analytics and tracking

| Capability | How it is turned on | Source |
| --- | --- | --- |
| Page data sent to Google Tag Manager | Always on | `data-layer.ts` |
| Campaign parameters sent to Google Tag Manager | Always on | `data-layer.ts` |
| Field interaction events | Always on | `data-layer.ts` |
| Opt-in events on submit | Always on | `data-layer.ts` |
| Hashed contact data | Always on | `data-layer.ts` |
| End-of-gift event replay | Always on | `data-layer.ts` |
| Conversion component events | With each component | `upsell-lightbox.ts`, `exit-intent-lightbox.ts`, `optin-ladder.ts`, `other-amount.ts` |
| Suppress purchase on chained eCards | `SuppressPurchaseEcard` | `data-layer.ts` |

### Branding and theming

| Capability | How it is turned on | Source |
| --- | --- | --- |
| Theme and sub-theme scoping | `data-engrid-theme`, `data-engrid-subtheme` on `<body>` | `_engrid-theme-flex2.scss`, `debug-panel.ts` |
| Starter theme | `data-engrid-theme="flex2"` | `_engrid-theme-flex2.scss` |
| Color settings | CSS custom properties | `_engrid-colors.scss` |
| Typography settings | CSS custom properties | `_engrid-typography.scss` |
| Field settings | CSS custom properties | `_engrid-fields.scss` |
| Button system | CSS custom properties; `button`, `arrow`, `next-step`, `primary` classes | `_engrid-buttons.scss` |
| Spacing and scale settings | CSS custom properties | `_engrid-utilities.scss` |
| Section styling settings | CSS custom properties | `_engrid-layout.scss`, `_engrid-body.scss` |

### Page Builder tools

| Capability | How it is turned on | Source |
| --- | --- | --- |
| Quick edit shortcut | `?pbedit` | `app.ts` |
| Color-coded page builder | Inside the page builder | `_engrid-page-builder.scss` |

## Developer resources

- [ENgrid documentation](https://engrid.4sitestudios.com/)
- [Developer Training Guide](https://engrid.4sitestudios.com/docs/v2/training)
- [ENgrid template repository](https://github.com/4site-interactive-studios/engrid-template/)
- [Community EN Slack channel](https://join.slack.com/t/endevelopers/shared_invite/enQtNTgyMDU5NDEzOTQxLWM1YjkwYmM2NjcxODdhNjI4MmRhMjI1ZTJlNzZlYTM5MmI4OTg3NTlhZTljMDMyMjczZmYyNTBjZmM4ZDY4MTA)
