<img src="https://raw.githubusercontent.com/4site-interactive-studios/engrid-scripts/master/reference-materials/repo/repo-hero.jpg">

# 4Site's ENgrid Page Template Framework

<!--- <img align="right" width="200" height="200" src="https://engagingnetworks.academy/wp-content/uploads/2019/09/D-D-Partner.png"> -->

This project started as a labor of love for our clients and ourselves. Originating in 2017 as a partnership between Engaging Networks and 4Site Studios to create the first freely available page templates for their platform, we created [Engaging Networks Page Template](https://github.com/4site-interactive-studios/Engaging-Networks-Page-Template). That project was incredibly successful, and those templates are still used today for all new Engaging Networks clients. They're easy for junior developers and code dabblers to ease into, and they include Internet Explorer 11 support.

Since then, we've continued to enhance and refine our work, culminating in a complete re-write in late 2019 that was named "ENgrid". Using today's latest web technologies, Webpack, Typescript, ES6, SCSS, and CSS Grids, we've created a new framework for marketers, fundraisers, and everyone in between that will ensure your pages stand out and deliver the performance you're looking for.

Designed and Developed by [4Site Studios](http://4sitestudios.com/en?ms=github) while working with:

- Amnesty International USA (AIUSA)
- Catholic Extension
- Earth Island Institute
- Human Rights Campaign (HRC) via Lautman Maska Neill & Company
- International Fund for Animal Welfare (IFAW)
- Mercy for Animals
- National Trust for Historic Preservation
- National Wildlife Federation (NWF)
- Oceana
- Ocean Conservancy
- Organic Consumers
- Oxfam America
- Oxfam Canada
- People for the Ethical Treatment of Animals (PETA)
- Polaris Project
- Rainforest Action Network (RAN)
- Saint Anthony's Guild (Friar Works)
- Save Tibet via Schultz and Williams
- The Nature Conservancy (TNC)
- World Wildlife Fund (WWF)

## ENgrid Features

### Giving Pages
- Comma and non-number handling in Other Donation Amount input field
- Auto Credit Card Type selection based on Credit Card Number
- Strip all non-number values from the Credit Card field on form submission
- Tip Jar / Additional Gift Checkbox that works in addition to ENs native processing fee checkbox
- Donation Upsell Lightbox, an alternative to EN's native upsell lightbox that can be further customized
- Conditional Hide/Show fields (e.g., In Honor of Giving Fields)
- Give by Check, Card, Paypal, Apple Pay, Google Pay, and Venmo (Depends on Payment processor support)
- Auto-update CC Expiration Date fields
- Insert the currently selected giving amount and frequency anywhere on the page with our "Live giving variables" that act like live merge tags
- CVV "What's this" tooltip
- Conditionally hide/show content based on giving amount
- Conditionally hide/show content based on giving frequency

### Advocacy Pages
- Advocacy "Opt-in Upsell" Lightbox
- Title field "Why is this required?" tooltip for Email to Senate target actions

### e-Card Pages
- Tweaked UI / UX for an improved e-card "add recipient" experience

### Accessibility Enhancements
- Skip content link accessibility enhancement
- Accessible outlines around fields when you navigate to them with your keyboard
- Optional accessible drop-down menu

### Improvements for Content Editors
- All on-page content is editable; nothing hard coded into the page template
- Per Page Background Images and Videos!
- Per Page Layouts (Six Built-In)
- Click-to-expand content sections can be opened with a click, touch, or by pressing "enter" or "spacebar" when focused with a keyboard.
- Add an attribution overlay to images and videos to include the photographer's name, no more editing in Photoshop and hard coding it in. You can also optionally add a link
- All pages using our page template can be seamlessly embedded in your website with Shortcodes using our WordPress iFrame embed plugin or our custom script
- Inside page builder, hidden and conditional content is visually color-coded
- Easy to add classes for visually hiding labels/fields while keeping in line with accessibility best practices
- Easy to add classes for conditionally showing / hiding content based on gift amount (e.g., .showifamount-greaterthanorequalto-15)
- Easy to add classes for conditionally showing / hiding content based on the selected value of another radio or checkbox input
- Page template allows for default Facebook / Twitter social sharing meta tags with support for EN's per-page social sharing widget to override them
- ENgrid content editor documentation

### Improvements for Developers
- Each client project gets its own GitHub repo containing all source code and assets
- Works with all page types (e.g., Donation, Premium, e-Card, Email to Target, Event, etc.). We add coverage when any new page type or display scenario comes up.
- Supports themes "Sub-Brand" theming and alternative brand theming for the ultimate setup and A/B testing scenario
- Optional placeholder values in input fields
- Address Form Field Internationalization - If the user is on a US / English page and selects "France" as their country, the Address Form fields will update their labels, change their ordering, and hide/show relevant fields for French Address formatting. Current address formatting support for (United States, Canada, United Kingdom, France, Germany, Netherlands, and Australia).
- ENgrid developer documentation

### General Quality of Life Improvements
- Added data attributes to form fields to help improve browser/password manager auto-fill completions
- On page load auto select the users country based on IP address
- Capitalize the first letter of First Name, Last Name, Address 1, City, and Region fields on the form submit 
- Lazy Load all image assets and moves them to their own CPU thread to prevent slowdowns in rendering the page when they include high-resolution imagery
- Fastest page load times possible on Engaging Networks. All render critical assets are prefetched, and there is only a single CSS and JS file
- Optional IE11 pop-up encouraging users to upgrade their browsers

### TidyContct Paid Services integrated with ENgrid
- TidyContact Address: Format all US addresses to the CASSI address standard in real-time on form submission
- TidyContact Phone: Format mobile numbers to the Twilio E.164 format in real-time on form submission
- TidyContact Email: Validate email addresses in real-time before the form is submitted 
- TidyContact QuickFill: "Remember Me" to save and pre-fill supporter info. Works cross-domain/sub-domain

## ENgrid Resources

- [ENgrid Github Repository](https://github.com/4site-interactive-studios/engrid/)
- [ENgrid Documentation](https://docs.google.com/document/d/1zF-86Iq8tCRk4HCv-JaJYZulkC273x-_QODUed9F0Pw/edit)
- [ENgrid Installation Instructions](https://github.com/4site-interactive-studios/engrid/wiki/ENgrid-Installation-Instructions)
- [Engaging Networks Email Template](https://github.com/4site-interactive-studios/Engaging-Networks-Email-Template)
- [Community Run EN Slack Channel](https://join.slack.com/t/endevelopers/shared_invite/enQtNTgyMDU5NDEzOTQxLWM1YjkwYmM2NjcxODdhNjI4MmRhMjI1ZTJlNzZlYTM5MmI4OTg3NTlhZTljMDMyMjczZmYyNTBjZmM4ZDY4MTA)

## Engaging Networks Resources

- [Engaging Networks Supportal](https://engagingnetworks.support/)
- [Engaging Networks Acadmey](https://engagingnetworks.academy/)
- [Engaging Networks Maintained Example Code Blocks](https://github.com/EngagingNetworks/page-builder-code-blocks)
- [Engaging Networks Maintained Example Page Styles](https://github.com/EngagingNetworks/page-builder-css-styles)

# Interested in a project or have questions?

We would love to hear from you.

Bryan Casler
Director of Digital Strategy  
4Site Interactive Studios  
Cell: (315) 877-3420  
Email: bryan@4sitestudios.com
