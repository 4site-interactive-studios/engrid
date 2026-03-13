<img src="https://raw.githubusercontent.com/4site-interactive-studios/engrid/main/reference-materials/repo/repo-hero.jpg">

# ENgrid — Page Template Framework for Engaging Networks

[![npm version - scripts](https://img.shields.io/npm/v/@4site/engrid-scripts?label=%404site%2Fengrid-scripts)](https://www.npmjs.com/package/@4site/engrid-scripts)
[![npm version - styles](https://img.shields.io/npm/v/@4site/engrid-styles?label=%404site%2Fengrid-styles)](https://www.npmjs.com/package/@4site/engrid-styles)
[![License: Unlicense](https://img.shields.io/badge/license-Unlicense-blue.svg)](https://github.com/4site-interactive-studios/engrid/blob/main/LICENSE)

ENgrid is an open-source page template framework built by [4Site Studios](https://www.4sitestudios.com/engaging-networks/?ms=github) for [Engaging Networks](https://www.engagingnetworks.net/). It provides mobile-first, accessible, conversion-optimized page templates for donation, advocacy, e-card, event, survey, premium, and other EN page types — with features that go well beyond what Engaging Networks offers out of the box.

## Why ENgrid?

- **Conversion-focused** — Smart donation amount handling, upsell lightboxes, live giving variables, and dozens of enhancements designed to increase completion rates and average gift size
- **Accessible by default** — Skip links, ARIA attributes, keyboard focus management, and autocomplete attributes are applied automatically to help meet WCAG standards
- **Content editor friendly** — All on-page content is editable through the EN page builder. Background images, layouts, click-to-expand sections, conditional content, media attribution, and more — all without developer involvement
- **Developer extensible** — Built with TypeScript, SCSS, and Webpack. Per-client GitHub repos, 30+ body data attributes, sub-brand theming, a debug panel, and 35+ helper functions
- **Fast** — Single CSS and JS file, prefetched render-critical assets, lazy loaded images — the fastest page load times possible on Engaging Networks
- **Open source** — Released under [The Unlicense](https://github.com/4site-interactive-studios/engrid/blob/main/LICENSE). All code is published on GitHub with full release notes documenting every change

## Features

### Giving Pages
- Smart donation amount handling (strips commas, non-numeric characters)
- Auto-updated credit card expiration year options
- Full VGS support with custom styling and error handling
- Tip Jar / Processing Fee checkbox
- Donation Upsell Lightbox with customizable one-time to recurring upsells
- Conditional hide/show fields (e.g., In Honor/Memorial giving)
- Card, Check, PayPal, Apple Pay, Google Pay, Venmo, and DAF support (varies by payment processor)
- Live giving variables — insert the selected amount and frequency anywhere on the page
- CVV "What's this?" tooltip
- Conditional content based on giving amount, frequency, or any selected radio/checkbox value
- Remember Me — save and pre-fill supporter info across visits, cross-domain/subdomain
- Enhanced currency selector with per-currency amount buttons
- Premium gift displays with multiple themes
- Post-donation donation embed for follow-up gifts on the thank you page

### Advocacy & e-Card
- Advocacy opt-in upsell lightbox
- Title field "Why is this required?" tooltip for Email-to-Senate actions
- Improved e-card recipient UX
- Ecard-to-target for sending ecards to advocacy targets

### Accessibility
- Skip to main content link for keyboard navigation
- Accessible outlines around fields when navigating by keyboard
- Optional accessible drop-down menu
- Automatic `autocomplete` attributes on common input fields
- Automatic `aria-required` on required fields
- Automatic `aria-labelledby` on input fields with labels
- Automatic `aria-label` on Other Amount input and split selects

### Content Editor Capabilities
- All on-page content editable through the EN page builder — nothing hard-coded
- Per-page background images and videos
- Six built-in page layouts
- Click-to-expand content sections (click, touch, or keyboard accessible)
- Media attribution overlays for photographer/artist credits with optional links
- Seamless WordPress embedding via the Promotions Plugin or shortcodes
- Color-coded hidden and conditional content inside the page builder
- Easy classes for visually hiding labels while maintaining accessibility
- Simple CSS classes for conditional show/hide by amount, frequency, or selection
- Default social sharing meta tags with per-page override support
- Custom merge tags replaced with dynamic values from URL parameters
- Ecard form embedding into donation/advocacy pages
- Quick edit shortcut — add `?pbedit` to any page URL to jump to the page builder

### Developer Capabilities
- 30+ data attributes on the `<body>` tag for granular styling and functional control
- Per-client GitHub repos with all source code and assets
- Works with all EN page types — donation, premium, e-card, email-to-target, event, survey, and more
- Sub-brand theming and A/B testing support
- Optional placeholder values in input fields
- International address formatting — fields update labels, ordering, and visibility based on selected country (US, CA, UK, FR, DE, NL, AU)
- Debug panel for quick-filling forms, changing layouts, forcing submissions, and shortcuts to the page builder
- 35+ helper functions for common EN tasks (getting/setting field values, etc.)

### Quality of Life
- Exit intent lightbox to capture abandoning visitors
- Enhanced browser and password manager autofill via data attributes
- IP-based country auto-detection on page load
- Auto-capitalization of First Name, Last Name, Address, City, and Region
- Lazy loading with off-thread image rendering for high-resolution imagery
- Single CSS + JS file with prefetched render-critical assets for fastest EN page loads
- Automatic GTM Data Layer events for page type, field interactions, and form actions
- Welcome Back returning supporter recognition
- Multi-step form support controlled via content blocks in the page builder

### TidyContact Integration (Paid Add-on)
- **TidyContact Address** — Format US addresses to the CASS standard in real time on form submission
- **TidyContact Phone** — Format mobile numbers to the Twilio E.164 format in real time
- **TidyContact Email** — Validate email addresses in real time before form submission
- **TidyContact QuickFill** — Remember Me to save and pre-fill supporter info cross-domain/subdomain

## Organizations Using ENgrid

| | | |
|---|---|---|
| Amnesty International USA (AIUSA) | American Technion Society (ATS) | Catholic Extension |
| Center for Science in the Public Interest (CSPI) | Earth Island Institute | Engaging Networks |
| Evangelical Lutheran Church in America (ELCA) | Food and Water Watch (FWW) | Friends of Canadian Broadcasting |
| Human Rights Campaign (HRC) | International Fund for Animal Welfare (IFAW) | Just Liberty |
| Mercy for Animals | National Parks Conservation Association (NPCA) | National Trust for Historic Preservation (NTHP) |
| National Wildlife Federation (NWF) | Oceana | Ocean Conservancy |
| Organic Consumers Association | Oxfam America | Oxfam Canada |
| People for the Ethical Treatment of Animals (PETA) | Polaris Project | Rainforest Action Network (RAN) |
| Saint Anthony's Guild (Friar Works) | Save the Children Action Network (SCAN) | Save Tibet |
| Shatterproof | SPCA International (SPCAI) | The Nature Conservancy (TNC) |
| Turtle Island Restoration Network | Van Andel Institute | World Wildlife Fund (WWF) |

## Getting Started

Start a new client theme from the template repo:

```
git clone https://github.com/4site-interactive-studios/engrid-template.git my-org-theme
cd my-org-theme
npm install
npm run watch
```

For full setup instructions, see [Creating an ENgrid Theme](https://engrid.4sitestudios.com/docs/v2/creating-an-engrid-theme) in the documentation.

## Documentation

- [Features Overview](https://engrid.4sitestudios.com/docs/v2/features-overview) — What ENgrid can do
- [Content Editor Guide](https://engrid.4sitestudios.com/docs/v2/content-editor-guide) — For non-developers managing page content
- [Developer Training Guide](https://engrid.4sitestudios.com/docs/v2/training) — Setup, theming, and development workflow
- [Release Notes](https://www.4sitestudios.com/engrid-release-notes/) — What's new in each release

## Repository Structure

This is a Lerna monorepo containing two packages:

- **[@4site/engrid-scripts](https://www.npmjs.com/package/@4site/engrid-scripts)** — TypeScript framework powering ENgrid's functionality
- **[@4site/engrid-styles](https://www.npmjs.com/package/@4site/engrid-styles)** — SCSS base styles for ENgrid page templates

Client themes install these as npm dependencies and extend them with organization-specific customizations.

## Development

```shell
# Clone the repo
git clone https://github.com/4site-interactive-studios/engrid.git
cd engrid

# Install dependencies
npm install

# Build all packages
npm run build

# Watch for changes during development
npm run watch
```

## ENgrid Resources

- [ENgrid Documentation](https://engrid.4sitestudios.com/)
- [ENgrid Template Repository](https://github.com/4site-interactive-studios/engrid-template/)
- [ENgrid Release Notes](https://www.4sitestudios.com/engrid-release-notes/)
- [Community EN Slack Channel](https://join.slack.com/t/endevelopers/shared_invite/enQtNTgyMDU5NDEzOTQxLWM1YjkwYmM2NjcxODdhNjI4MmRhMjI1ZTJlNzZlYTM5MmI4OTg3NTlhZTljMDMyMjczZmYyNTBjZmM4ZDY4MTA)

## Engaging Networks Resources

- [Engaging Networks Supportal](https://engagingnetworks.support/)
- [Engaging Networks Academy](https://engagingnetworks.academy/)
- [Engaging Networks Code Blocks](https://github.com/EngagingNetworks/page-builder-code-blocks)
- [Engaging Networks Page Styles](https://github.com/EngagingNetworks/page-builder-css-styles)

## Interested in ENgrid?

We'd love to hear from you.

**Bryan Casler**
Vice President of Digital and AI Strategy
4Site Interactive Studios
Cell: (315) 877-3420
Email: bryan@4sitestudios.com

[Contact 4Site Studios](https://www.4sitestudios.com/contact/) | [Learn more about ENgrid](https://www.4sitestudios.com/engaging-networks/?ms=github)
