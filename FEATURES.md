# ENgrid features and enhancements

This is the full list behind the summary in the [README](README.md). Developers can find how to turn each one on in [DEVELOPERS.md](DEVELOPERS.md#how-to-turn-each-feature-on).

ENgrid has 72 features and 82 enhancements, plus 17 integration capabilities across nine services. All of them are listed below.

- **Feature**: something Engaging Networks (EN) pages can't do natively
- **Enhancement**: something Engaging Networks does that ENgrid improves or fixes
- **Integration**: a connection to a payment, validation or analytics service
- **On by default** applies to every page with no setup, and **Opt-in** is switched on per page or per theme

| Category | Features | Enhancements | Integrations | Total |
| --- | --- | --- | --- | --- |
| [Donations and payments](#donations-and-payments) | 11 | 20 | 5 | 36 |
| [Upsells and conversion](#upsells-and-conversion) | 7 | 1 | 0 | 8 |
| [Personalization and conditional content](#personalization-and-conditional-content) | 18 | 0 | 0 | 18 |
| [Forms and fields](#forms-and-fields) | 10 | 9 | 0 | 19 |
| [Advocacy, eCards and events](#advocacy-ecards-and-events) | 2 | 11 | 0 | 13 |
| [Accessibility](#accessibility) | 1 | 13 | 0 | 14 |
| [Layout, media and display](#layout-media-and-display) | 11 | 11 | 0 | 22 |
| [Data quality and validation](#data-quality-and-validation) | 0 | 5 | 4 | 9 |
| [International](#international) | 3 | 4 | 0 | 7 |
| [Embeds](#embeds) | 5 | 2 | 0 | 7 |
| [Analytics and tracking](#analytics-and-tracking) | 0 | 0 | 8 | 8 |
| [Branding and theming](#branding-and-theming) | 2 | 6 | 0 | 8 |
| [Page Builder tools](#page-builder-tools) | 2 | 0 | 0 | 2 |
| **Total** | **72** | **82** | **17** | **171** |

### Donations and payments

Donors see the right amounts, pay the way they prefer, and hit fewer dead ends.

| Capability | What it does | Type | Default |
| --- | --- | --- | --- |
| Live amount and frequency on the submit button | The submit button text updates as the donor changes the amount or frequency | Feature | Opt-in |
| Live giving amount and frequency text | Shows the selected amount and frequency anywhere in page copy | Feature | Opt-in |
| Live monthly upsell amount text | Shows a suggested monthly amount based on the one-time gift | Feature | Opt-in |
| Click-to-convert monthly links | A link in page copy switches the gift to monthly at the suggested amount | Feature | Opt-in |
| Click-to-submit links | Any link can submit the form | Feature | Opt-in |
| Amount lists swapped per frequency | Replaces EN's amount buttons with a different set for each frequency | Feature | Opt-in |
| Processing fee (tip jar) checkbox | Donors tick a box to add a percentage and fixed fee to their gift on submit, and the totals shown on the page update to match | Feature | Opt-in |
| Premiums filtered by amount and frequency | Shows or hides premium gifts by a minimum amount for each frequency, and falls back to a default gift or no gift | Feature | Opt-in |
| Premium title merge tag | Inserts the selected premium's name into page copy | Feature | Opt-in |
| Amounts and frequencies as buttons | Shows lists of options as rows of buttons, sized to the number of options | Feature | Opt-in |
| Per-frequency amount suffixes | Adds /mo, /qt or /yr to amount buttons | Feature | Opt-in |
| Submit button lock with spinner | The button shows "Processing..." and can't be clicked again after submit, then unlocks if there is an error | Enhancement | On by default |
| Recurring gift setting kept in sync | Keeps EN's recurring gift setting matched to the frequency the donor picked | Enhancement | On by default |
| Sticky Next Suggested Gift | Keeps EN's Next Suggested Gift amounts on later pages for 30 days | Enhancement | Opt-in |
| Other amount handling | Selects the Other option when the donor clicks into the field, cleans up the typed amount, and restores the previous amount if the field is left at 0 | Enhancement | On by default |
| Other amount numeric keypad | Opens the number keypad on phones for the Other field, and tells browsers and password managers not to fill it in | Enhancement | On by default |
| Currency symbol on amount buttons | Adds the currency symbol to amount buttons that show only a number | Enhancement | On by default |
| Minimum and maximum gift validation | Shows an error right away and stops the form from submitting when the amount is out of range | Enhancement | On by default |
| Amount limits read from EN validators | Takes the minimum and maximum from the amount validator you set in EN, including a separate range for each frequency | Enhancement | Opt-in |
| Auto-updated card expiry years | Rebuilds the expiry year list as the current year and the next 19 | Enhancement | Opt-in |
| Give-by-select payment tiles | Keeps the payment tiles (the buttons donors click to choose how to pay) matched to EN's payment type, and switches to another method if the selected one is hidden | Enhancement | On by default |
| Preferred payment method | Pre-selects a payment method from a supporter field or your default settings, and saves the donor's choice | Enhancement | Opt-in |
| Payment method from the URL | Pre-selects a payment method named in the link | Enhancement | Opt-in |
| Frequency set by links or checkboxes | Lets page copy or a checkbox change the gift frequency | Enhancement | Opt-in |
| Click anywhere to select a premium | Clicking a gift's title or description selects it | Enhancement | On by default |
| Premium block styling | Restyles EN's premium gift block to match your brand | Enhancement | On by default |
| Stripe bank modal submit fix | Makes the submit button clickable again when the donor closes Stripe's bank connection window (Stripe Financial Connections) | Enhancement | On by default |
| Wallet fallback to card | Switches to card payment when the selected digital wallet does not load | Enhancement | On by default |
| Supporter Hub card update shortcut | Clicking into the card field opens EN's update card steps | Enhancement | On by default |
| Supporter Hub currency label fix | Corrects currency labels in Supporter Hub pop-up panels | Enhancement | On by default |
| Supporter Hub duplicate submit guard | Stops a second submit while the first is still processing | Enhancement | On by default |
| Custom Apple Pay | Adds an Apple Pay button and payment sheet that work separately from EN's digital wallet buttons | Integration | Opt-in |
| Stripe digital wallets (Apple Pay, Google Pay) | Connects EN's Stripe wallet buttons to the payment tiles | Integration | On by default |
| PayPal One Touch and Venmo | Connects EN's PayPal and Venmo buttons to the payment tiles | Integration | On by default |
| Donor-advised fund giving (Chariot) | Connects EN's donor-advised fund button to the payment tiles | Integration | On by default |
| VGS secure card fields | Styles EN's secure card fields (provided by VGS) and stops the form from submitting when the card number, CVV or expiry date is empty or invalid. You can set your own error messages | Integration | Opt-in |

### Upsells and conversion

More ways to turn a one-time gift into a larger or recurring one, and to recover visitors who are about to leave.

| Capability | What it does | Type | Default |
| --- | --- | --- | --- |
| Upsell lightbox | On submit, a pop-up asks one-time donors to switch to a suggested monthly amount. An alternative to EN's own upsell when you need more control | Feature | Opt-in |
| Upsell checkbox | Adds a "make my gift monthly" checkbox with a calculated amount | Feature | Opt-in |
| Frequency upsell modal | On submit, a pop-up offers a different frequency (one-time to annual by default), with A/B test variants | Feature | Opt-in |
| Exit intent lightbox | Shows a pop-up when the visitor moves to leave the page, then not again for 30 days | Feature | Opt-in |
| Mobile call-to-action button | A floating button on phones that scrolls to the form and hides once the form is in view | Feature | Opt-in |
| Post-donation second-gift embed | Places a second donation form (a chained donation) on the thank-you page | Feature | Opt-in |
| Opt-in ladder | Asks opt-in questions one at a time on the thank-you page, skipping any already answered | Feature | Opt-in |
| Double the Donation widget styling | Restyles the matching-gift widget to match the page | Enhancement | On by default |

### Personalization and conditional content

Show each supporter the content that fits what they chose, where they came from and whether they've been here before.

| Capability | What it does | Type | Default |
| --- | --- | --- | --- |
| Country auto-detection | Pre-selects the visitor's country based on their IP address | Feature | On by default |
| Hide elements from the URL | Hides parts of the page that are named in the link | Feature | Opt-in |
| URL merge tags | Fills placeholders in page copy with values from the link | Feature | Opt-in |
| Live frequency merge tags | Inserts the selected frequency into page copy, in lowercase, capitalized or uppercase | Feature | Opt-in |
| Remember Me | Saves a supporter's details with their consent and fills them in on their next visit, with a link to clear them | Feature | Opt-in |
| Remember Me across domains | Shares saved details between your web domains | Feature | Opt-in |
| Remember Me encryption | Encrypts the saved details (AES-GCM) | Feature | Opt-in |
| Click-to-reveal content | Lets a link or button reveal or swap content on the page | Feature | Opt-in |
| Conditional content by radio or checkbox | Shows or hides content based on any selected option | Feature | Opt-in |
| Conditional content by amount | Shows or hides content by gift amount, with six kinds of comparison | Feature | Opt-in |
| Conditional content by question presence | Shows content depending on whether EN shows the supporter an opt-in question | Feature | Opt-in |
| Conditional content by frequency | Shows or hides content by selected frequency | Feature | Opt-in |
| Conditional content by payment type | Shows or hides content by payment method | Feature | Opt-in |
| Conditional content by premium | Shows content depending on whether a premium is selected | Feature | Opt-in |
| Conditional content on the thank-you page | Applies the form's show and hide choices again on the thank-you page | Feature | On by default |
| Sticky prepopulation | Remembers the details a campaign link filled in and fills them in on later visits. They are stored encrypted in the supporter's browser | Feature | Opt-in |
| Page variants from a link | Switches layout or content variants from the link, with no duplicate page to maintain | Feature | Opt-in |
| Welcome back | Greets returning supporters by name, with a summary of their details and a link to edit them | Feature | Opt-in |

### Forms and fields

Shorter, clearer forms that are faster to fill in and easier to lay out.

| Capability | What it does | Type | Default |
| --- | --- | --- | --- |
| Autosubmit from a link | Submits the form as soon as the page loads, for one-click links in email | Feature | Opt-in |
| Fast form fill | Collapses a form section when all its required fields are already filled | Feature | Opt-in |
| US-only form | Locks country to the United States and adds a notice | Feature | Opt-in |
| Multi-step progress bar | An animated bar shows the percentage complete across a multi-page form | Feature | Opt-in |
| Field widths and positions | Sets width, order and visibility for each field from Page Builder | Feature | Opt-in |
| Visually hidden labels | Hides labels visually while keeping them for screen readers | Feature | Opt-in |
| No flash of unfinished content | Keeps content hidden until the page is ready | Feature | Opt-in |
| Fancy inline errors | Shows each field's error right beside the field | Feature | Opt-in |
| Field layout helpers | Stacks options, puts the Other field in line with the other amounts, and styles the help tips on labels | Feature | Opt-in |
| Required-field asterisks | Adds a red asterisk to required fields | Feature | Opt-in |
| Browser autofill hints | Tells browsers and password managers which field is which, so autofill works on supporter and card fields | Enhancement | On by default |
| Per-page checkbox labels | Replaces a checkbox's label with formatted text you write in Page Builder | Enhancement | Opt-in |
| Country list trimming | Removes the countries you choose from every country list | Enhancement | Opt-in |
| Floating labels | Lets a label sit inside its field and move aside once the supporter types | Enhancement | On by default |
| Input placeholders | Adds translated placeholder text to about 45 common fields | Enhancement | Opt-in |
| Universal opt-in | One yes/no choice sets every opt-in in the block | Enhancement | Opt-in |
| Prefill fields from the URL | Fills matching fields with values from the link | Enhancement | Opt-in |
| Error styling | Consistent page-level and field-level error styles, including the secure card fields | Enhancement | On by default |
| Chrome autofill fix | Fixes the font size on fields the browser fills in | Enhancement | On by default |

### Advocacy, eCards and events

The same care applied to actions, eCards and event pages.

| Capability | What it does | Type | Default |
| --- | --- | --- | --- |
| eCard to target | Turns an eCard page into an action sent to a fixed recipient | Feature | Opt-in |
| Embedded eCard on donation pages | Adds a "send an eCard" checkbox that puts an eCard form on the page and sends the eCard after the gift | Feature | Opt-in |
| Sender name added to messages | Adds the supporter's name to the end of the message when the name merge tags are missing | Enhancement | On by default |
| Click a target row to select it | Clicking anywhere on a target's row ticks or unticks its checkbox | Enhancement | On by default |
| eCard details from the URL | Pre-fills the eCard send date and recipient from the link | Enhancement | Opt-in |
| eCard auto-add recipient | Adds the typed recipient on submit if the donor did not click Add | Enhancement | On by default |
| eCard styling | Restyles thumbnails, recipients and the preview pop-up | Enhancement | On by default |
| Event ticket price formatting | Formats ticket prices in the local currency format | Enhancement | On by default |
| Event ticket and occurrence layout | Restyles EN's ticket and occurrence blocks | Enhancement | On by default |
| Social share block styling | Rearranges EN's share buttons and adds a label | Enhancement | On by default |
| Click-to-call styling | Makes contact and survey blocks fit any screen size | Enhancement | On by default |
| Tweet-to-target styling | Restyles target cards and adds a default profile image | Enhancement | On by default |
| Letter-to-target styling | Aligns the contact block with the form fields | Enhancement | On by default |

### Accessibility

Applied to every page so supporters using a keyboard or screen reader can finish what they started.

| Capability | What it does | Type | Default |
| --- | --- | --- | --- |
| Screen-reader-only content | Hides content visually while keeping it available to screen readers | Feature | Opt-in |
| Required and invalid states for screen readers | Tells screen readers which fields are required and which have errors | Enhancement | On by default |
| Fallback field labels | Adds labels for screen readers to the Other amount field and to dropdowns that are split into parts | Enhancement | On by default |
| Radio groups announced as groups | Sets of options are announced as a group, with their label | Enhancement | On by default |
| Spoken error summary | Screen readers announce a summary of the form's errors | Enhancement | On by default |
| Errors placed after their field | Moves each error message so screen readers read it right after its field | Enhancement | On by default |
| Focus on first error | Moves focus to the first field with an error after a failed submit | Enhancement | On by default |
| eCard image alt text | Adds alt text to eCard images | Enhancement | On by default |
| Accessible eCard form and preview | Adds labels and headings, and makes the preview pop-up work with a keyboard | Enhancement | On by default |
| Skip to main content link | Adds a link that skips to the first heading | Enhancement | On by default |
| Keyboard focus outlines | A visible outline shows which link, button or field is selected when using a keyboard | Enhancement | On by default |
| Accessible premium gifts | Adds alt text to gift images and screen reader labels (ARIA) to the gift options | Enhancement | On by default |
| Accessible Supporter Hub overlays | Marks pop-up panels as dialogs for screen readers, adds alt text, and blocks the page behind a panel while it is open | Enhancement | On by default |
| Supporter Hub announcements | Announces login and hub responses to screen readers | Enhancement | On by default |

### Layout, media and display

Page layouts, backgrounds and media your content team controls from Page Builder.

| Capability | What it does | Type | Default |
| --- | --- | --- | --- |
| Six page layouts | Six page layouts, with one or two columns, chosen per page | Feature | Opt-in |
| 18-section page grid | Eighteen named page sections you place content into from Page Builder | Feature | Opt-in |
| Background video cropping | Controls which side of a background video is cropped | Feature | Opt-in |
| Rotating backgrounds | Cross-fades several background images, with controls, and respects a visitor's reduced motion setting | Feature | Opt-in |
| Media attribution | Adds a photo credit over the image, with an optional link and hover text | Feature | Opt-in |
| Click to expand | Collapsible content that works by click, touch or keyboard | Feature | Opt-in |
| Ticker | A scrolling ticker whose order is reshuffled each day | Feature | Opt-in |
| Flip | Mirrors an image or block | Feature | Opt-in |
| Grayscale | Shows images or video in grayscale | Feature | Opt-in |
| Text highlight | Highlights inline text | Feature | Opt-in |
| Animated ellipsis | An animated "..." for loading states | Feature | Opt-in |
| Empty sections collapse | Page sections with no content take up no space | Enhancement | On by default |
| Page context for styling | Lets your theme style pages by page type, language, currency, country, payment method and more | Enhancement | On by default |
| Page background image or video | Uses an image or video added in Page Builder as the full-page background | Enhancement | Opt-in |
| Banner image as background | Uses the body banner image as the page background | Enhancement | Opt-in |
| Lazy-loaded images | Loads images only as they are needed, so pages appear sooner | Enhancement | On by default |
| Background video autoplay | Background videos start by themselves, muted and looping, and play within the page on phones | Enhancement | On by default |
| Responsive EN base styles | Replaces EN's default page styles with ones that adapt to any screen size | Enhancement | On by default |
| Column fixes | Fixes EN columns that are too narrow, spill over or shift around | Enhancement | On by default |
| Responsive media | Images and video resize with the screen and keep their proportions | Enhancement | On by default |
| Fluid thermometer | Makes EN's thermometer widget resize with the screen | Enhancement | On by default |
| Supporter Hub layout fixes | Layout, focus and pagination fixes for the Supporter Hub | Enhancement | On by default |

### Data quality and validation

Cleaner supporter records at the point of entry.

| Capability | What it does | Type | Default |
| --- | --- | --- | --- |
| Auto-capitalization | Capitalizes name, address and city on submit | Enhancement | Opt-in |
| Live field validation | Checks fields against your custom EN validators as the supporter types | Enhancement | Opt-in |
| Full region name capture | Copies the full state or region name into a hidden field | Enhancement | Opt-in |
| US ZIP validation and formatting | Validates and formats ZIP and ZIP+4 for US addresses | Enhancement | Opt-in |
| Required only when visible | Makes fields required only while they are shown | Enhancement | Opt-in |
| FreshAddress email validation | Validates email with FreshAddress/AtData, records the result, and blocks invalid addresses | Integration | Opt-in |
| NeverBounce email validation | Validates email in real time, records the date and status, and lets the supporter continue if the check times out | Integration | Opt-in |
| TidyContact address standardization (paid service) | Standardizes US addresses on submit and records the result | Integration | Opt-in |
| TidyContact phone standardization (paid service) | Standardizes phone numbers with a country-flag picker | Integration | Opt-in |

### International

Forms that adapt to where the supporter is and how they pay.

| Capability | What it does | Type | Default |
| --- | --- | --- | --- |
| Country redirect | Sends the supporter to another page when they choose a country you have set up | Feature | Opt-in |
| Currency by country | Changes the currency list for each country, with a label you choose | Feature | Opt-in |
| Live currency merge tags | Inserts the current currency symbol or code into page copy | Feature | Opt-in |
| Address fields by country | Relabels address fields and swaps the state field for 10 countries | Enhancement | On by default |
| Custom field label translations | Overrides field labels per country or language | Enhancement | Opt-in |
| Translated interface text | ENgrid's own text comes in English and Spanish and can be extended | Enhancement | On by default |
| Number format options | Controls how live amounts are formatted | Enhancement | Opt-in |

### Embeds

Put EN forms inside your website, or inside other EN pages, without sizing or scrolling problems.

| Capability | What it does | Type | Default |
| --- | --- | --- | --- |
| Auto-resizing embedded forms | An embedded form tells the page it sits in how tall it is, so the frame resizes to fit | Feature | On by default |
| Embedded page status messages | Tells the page it sits in when an embedded form is submitted or completed | Feature | On by default |
| Embedded layout | A transparent layout with no surrounding page design, for embedded pages | Feature | Opt-in |
| Conditional content in iframes | Shows or hides content when the page is embedded in another page | Feature | Opt-in |
| Iframe queue | Submits several embedded forms one after another so records are not lost | Feature | Opt-in |
| Scroll to first error | Scrolls to the first error, including inside an embedded form | Enhancement | On by default |
| eCard preview from an embed | Opens an embedded eCard's preview in the page it is embedded in | Enhancement | On by default |

### Analytics and tracking

ENgrid sends these events to Google Tag Manager for you. Your Tag Manager container still needs tags and triggers set up to use them.

| Capability | What it does | Type | Default |
| --- | --- | --- | --- |
| Page data sent to Google Tag Manager | Sends page details to Google Tag Manager when the page loads | Integration | On by default |
| Campaign parameters sent to Google Tag Manager | Sends link parameters to Google Tag Manager for campaign tracking | Integration | On by default |
| Field interaction events | Sends an event when a field changes, excluding card and bank fields | Integration | On by default |
| Opt-in events on submit | Sends opt-in choices when the form is submitted | Integration | On by default |
| Hashed contact data | Sends email, phone and address in hashed form, never as plain text, for ad platform matching | Integration | On by default |
| End-of-gift event replay | Holds events and sends them once the gift is complete | Integration | On by default |
| Conversion component events | Sends upsell, exit intent, opt-in ladder and other-amount events to Google Tag Manager | Integration | On by default |
| Suppress purchase on chained eCards | Stops duplicate donation events on chained eCard pages | Integration | Opt-in |

### Branding and theming

One set of brand settings styles every page, with room for sub-brands.

| Capability | What it does | Type | Default |
| --- | --- | --- | --- |
| Theme and sub-theme scoping | Gives each brand or sub-brand its own styles within one theme | Feature | Opt-in |
| Starter theme | A base theme to build new themes from | Feature | Opt-in |
| Color settings | Palette, error and highlight colors set once for the whole theme | Enhancement | On by default |
| Typography settings | Fonts, headings, paragraphs and links set once for the whole theme | Enhancement | On by default |
| Field settings | Text fields, dropdowns, radio buttons, checkboxes and labels set once for the whole theme | Enhancement | On by default |
| Button system | Submit, amount and frequency buttons styled from one set of settings | Enhancement | On by default |
| Spacing and scale settings | Consistent spacing and sizing across every page | Enhancement | On by default |
| Section styling settings | Background, padding, corners and shadow for each page section | Enhancement | On by default |

### Page Builder tools

Small things that make editing pages faster.

| Capability | What it does | Type | Default |
| --- | --- | --- | --- |
| Quick edit shortcut | Jumps from a live page to its edit screen in Page Builder | Feature | Opt-in |
| Color-coded page builder | Marks hidden and conditional content in Page Builder and adds edit warnings | Feature | On by default |
