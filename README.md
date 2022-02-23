<img src="https://raw.githubusercontent.com/4site-interactive-studios/engrid-scripts/master/reference-materials/repo/repo-hero.jpg">

# 4Site's ENgrid Page Template Framework

<!--- <img align="right" width="200" height="200" src="https://engagingnetworks.academy/wp-content/uploads/2019/09/D-D-Partner.png"> -->

This project started as a labor of love for our clients and ourselves. Originating in 2017 as a partnership between Engaging Networks and 4Site Studios to create the first freely available page templates for their platform; we created [Engaging Networks Page Template](https://github.com/4site-interactive-studios/Engaging-Networks-Page-Template). That project was incredibly successful, and those templates are still used today for all new Engaging Networks clients. They're easy for junior developers and code dabblers to ease into, and they include Internet Explorer 11 support.

Since then, we've continued to enhance and refine our work, culminating in a complete re-write in late 2019 that was named "ENgrid". Making use of today's latest web technologies Webpack, Typescript, ES6, SCSS, CSS Grids, we've created a new framework for marketers, fundraisers, and everyone in between that will ensure your pages stand out and deliver the performance you're looking for.

Designed and Developed by [4Site Studios](http://4sitestudios.com/en?ms=github) while working with:

- Amnesty International USA
- Earth Island Institute
- Human Rights Campaign via Lautman Maska Neill & Company
- Humane Society
- International Fund for Animal Welfare
- Mercy for Animals
- National Trust for Historic Preservation
- National Wildlife Federation
- Oceana
- Ocean Conservancy
- Organic Consumers
- Oxfam America
- Oxfam Canada
- People for the Ethical Treatment of Animals
- Polaris Project
- Rainforest Action Network
- Saint Anthony's Guild (Friar Works)
- Save Tibet via Schultz and Williams

## ENgrid Features

### Giving Pages
- Comma handling in Other Donation Amount input field
- Auto Credit Card Type selection based on Credit Card Number
- Strip all non-number values from Credit Card field on submission
- Tip Jar / Additional Gift Checkbox, works in addition to ENs native processing fee checkbox
- Donation Upsell Lightbox
- Conditional Hide/Show fields (e.g. In Honor of Giving Fields)
- Give by Check, Card, Paypal
- Auto update CC Expiration Date fields
- Insert the currently select giving amount and/or frequency anywhere on page with our "Live giving variables" that act like live merge tags
- CVV "What's this" tooltip
- Conditionally hide/show content based on giving amount
- Conditionally hide/show content based on giving frequency


### Advocacy Pages
- Advocacy "Opt-in Upsell" Lightbox
- Title field "Why is this required?" tooltip for Email to Senate target actions

### e-Card Pages
- Tweaked UI / UX for an improved e-card "add recipient" experience

### Accessability Enhancements
- Skip content link accessability enhancement
- Optional accessible outlines around fields when you navigate to them with your keyboard
- Optional accessible drop-down menu

### Improvements for Content Editors
- All on page contnet is editable, nothing hard coded into the page template
- Per Page Background Images and Videos!
- Per Page Layouts (Six Built In)
- Click-to-expand content sections activate with a click, touch. Or opened with enter or spacebar when focused with a keyboard.
- Add an attribution overlay to images and videos to include the photographers name, no more editing in Photoshop and hard coding it in. You can also optionally add a link
- All pages using our page template can be seamlessly embedded in your website with Shortcodes using our WordPress iFrame embed plugin
- In page builder, conditional content is visually color coded
- Easy to add classes for visually hiding labels / fields, but keeping in line with accessability best practices
- Easy to add classes for conditionally showing / hiding content based on gift amount (e.g. .showifamount-greaterthanorequalto-15)
- Page template allows for default Facebook / Twitter social sharing meta tags with support for EN's per-page social sharing widget to override them
- ENgrid content editor documentation

### Improvements for Developers
- Each client project gets its own GitHub repo containing all source code and assets
- Works with all page types (e.g. Donation, Premium, e-Card, Email to Target, Event, etc..). We add coverage as any new page types or display scenarios come up.
- Supports themes "Sub-Brand" theming and altneritive brand theming for the ultimate set up and A/B testing scenario
- Optional placeholder values in input fields
- Address Form Field Internationalization - If the user is on a US / English page and selects "France" as their country the Address Form fields will update their labels, change their ordering, and hide/show relevant fields for French Address formatting. Current address formatting support for (United States, Canada, United Kingdom, France, Germany, Netherlands, Australia).
- ENgrid developer documentation

### General Quality of Life Improvements
- Added data attributes to form fields to help improve browser / password manager auto-fill completions
- On pageload auto select users country based on IP address
- Capitalize first letter of First Name, Last Name, Address 1, City, Region fields on form submit 
- Lazy Load all image assets and moves them to their own CPU thread to prevent slow downs in rendering the page when they include high resoltion imagery
- Fastest page load times possible on Engaging Networks. All render critical assets are prefetched and there is only a single CSS and JS file
- Optional IE11 pop-up encouraging users to upgrade their browsers

### Additional 4Site ENgrid Services
- "Remember Me" to save and pre-fill supporter info. Works cross domain/sub-domain
- Format mobile numbers to the Twilio E.164 format, in real-time on form submission (coming soon)
- Format all US addresses to the CASSI address standard, in real-time on form submission (coming soon)

## ENgrid Resources

- [ENgrid Github Repository](https://github.com/4site-interactive-studios/engrid/)
- [ENgrid Documentation](https://docs.google.com/document/d/1Vhiudjm9pcDIgxirsiS7VWhqgqU_a6taVu2VTMOPbHI/edit)
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
