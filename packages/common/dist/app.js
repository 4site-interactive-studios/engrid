import { DonationAmount, DonationFrequency, EnForm, ProcessingFees, Country, } from "./events";
import { AmountLabel, Loader, ProgressBar, UpsellLightbox, ENGrid, OptionsDefaults, setRecurrFreq, PageBackground, MediaAttribution, ApplePay, A11y, CapitalizeFields, CreditCard, Ecard, ClickToExpand, Advocacy, DataAttributes, LiveVariables, iFrame, InputPlaceholders, InputHasValueAndFocus, ShowHideRadioCheckboxes, AutoCountrySelect, SkipToMainContentLink, SrcDefer, NeverBounce, AutoYear, Autocomplete, RememberMe, TranslateFields, ShowIfAmount, EngridLogger, OtherAmount, MinMaxAmount, Ticker, DataReplace, DataHide, AddNameToMessage, ExpandRegionName, AppVersion, UrlToForm, RequiredIfVisible, TidyContact, DataLayer, LiveCurrency, Autosubmit, EventTickets, SwapAmounts, DebugPanel, DebugHiddenFields, FreshAddress, BrandingHtml, CountryDisable, PremiumGift, DigitalWallets, MobileCTA, LiveFrequency, UniversalOptIn, Plaid, GiveBySelect, UrlParamsToBodyAttrs, ExitIntentLightbox, SupporterHub, FastFormFill, SetAttr, ShowIfPresent, ENValidators, CustomCurrency, VGS, PostalCodeValidator, CountryRedirect, WelcomeBack, EcardToTarget, } from "./";
export class App extends ENGrid {
    constructor(options) {
        super();
        // Events
        this._form = EnForm.getInstance();
        this._fees = ProcessingFees.getInstance();
        this._amount = DonationAmount.getInstance("transaction.donationAmt", "transaction.donationAmt.other");
        this._frequency = DonationFrequency.getInstance();
        this._country = Country.getInstance();
        this.logger = new EngridLogger("App", "black", "white", "🍏");
        const loader = new Loader();
        this.options = Object.assign(Object.assign({}, OptionsDefaults), options);
        // Add Options to window
        window.EngridOptions = this.options;
        this._dataLayer = DataLayer.getInstance();
        if (loader.reload())
            return;
        // Turn Debug ON if you use local assets
        if (ENGrid.getBodyData("assets") === "local" &&
            ENGrid.getUrlParameter("debug") !== "false" &&
            ENGrid.getUrlParameter("debug") !== "log") {
            window.EngridOptions.Debug = true;
        }
        // Document Load
        if (document.readyState !== "loading") {
            this.run();
        }
        else {
            document.addEventListener("DOMContentLoaded", () => {
                this.run();
            });
        }
        // Window Resize
        window.onresize = () => {
            this.onResize();
        };
    }
    run() {
        if (!ENGrid.checkNested(window.EngagingNetworks, "require", "_defined", "enjs")) {
            this.logger.danger("Engaging Networks JS Framework NOT FOUND");
            setTimeout(() => {
                this.run();
            }, 100);
            return;
        }
        // If there's an option object on the page, override the defaults
        if (window.hasOwnProperty("EngridPageOptions")) {
            this.options = Object.assign(Object.assign({}, this.options), window.EngridPageOptions);
            // Add Options to window
            window.EngridOptions = this.options;
        }
        if (this.options.Debug || App.getUrlParameter("debug") == "true")
            // Enable debug if available is the first thing
            App.setBodyData("debug", "");
        new Advocacy();
        new InputPlaceholders();
        new InputHasValueAndFocus();
        new ShowHideRadioCheckboxes("transaction.giveBySelect", "giveBySelect-");
        new ShowHideRadioCheckboxes("transaction.inmem", "inmem-");
        new ShowHideRadioCheckboxes("transaction.recurrpay", "recurrpay-");
        // Automatically show/hide all radios
        let radioFields = [];
        const allRadios = document.querySelectorAll("input[type=radio]");
        allRadios.forEach((radio) => {
            if ("name" in radio && radioFields.includes(radio.name) === false) {
                radioFields.push(radio.name);
            }
        });
        radioFields.forEach((field) => {
            new ShowHideRadioCheckboxes(field, "engrid__" + field.replace(/\./g, "") + "-");
        });
        // Automatically show/hide all checkboxes
        const allCheckboxes = document.querySelectorAll("input[type=checkbox]");
        allCheckboxes.forEach((checkbox) => {
            if ("name" in checkbox) {
                new ShowHideRadioCheckboxes(checkbox.name, "engrid__" + checkbox.name.replace(/\./g, "") + "-");
            }
        });
        // Client onSubmit and onError functions
        this._form.onSubmit.subscribe(() => this.onSubmit());
        this._form.onError.subscribe(() => this.onError());
        this._form.onValidate.subscribe(() => this.onValidate());
        // Event Listener Examples
        this._amount.onAmountChange.subscribe((s) => this.logger.success(`Live Amount: ${s}`));
        this._frequency.onFrequencyChange.subscribe((s) => {
            this.logger.success(`Live Frequency: ${s}`);
            setTimeout(() => {
                this._amount.load();
            }, 150);
        });
        this._form.onSubmit.subscribe((s) => this.logger.success("Submit: " + JSON.stringify(s)));
        this._form.onError.subscribe((s) => this.logger.danger("Error: " + JSON.stringify(s)));
        this._country.onCountryChange.subscribe((s) => this.logger.success(`Country: ${s}`));
        window.enOnSubmit = () => {
            this._form.submit = true;
            this._form.submitPromise = false;
            this._form.dispatchSubmit();
            ENGrid.watchForError(ENGrid.enableSubmit);
            if (!this._form.submit)
                return false;
            if (this._form.submitPromise)
                return this._form.submitPromise;
            this.logger.success("enOnSubmit Success");
            // If all validation passes, we'll watch for Digital Wallets Errors, which
            // will not reload the page (thanks EN), so we will enable the submit button if
            // an error is programmatically thrown by the Digital Wallets
            return true;
        };
        window.enOnError = () => {
            this._form.dispatchError();
        };
        window.enOnValidate = () => {
            this._form.validate = true;
            this._form.validatePromise = false;
            this._form.dispatchValidate();
            if (!this._form.validate)
                return false;
            if (this._form.validatePromise)
                return this._form.validatePromise;
            this.logger.success("Validation Passed");
            return true;
        };
        // Country Redirect
        new CountryRedirect();
        // iFrame Logic
        new iFrame();
        // Live Variables
        new LiveVariables(this.options);
        // Dynamically set Recurrency Frequency
        new setRecurrFreq();
        // Upsell Lightbox
        new UpsellLightbox();
        // Amount Labels
        new AmountLabel();
        // Engrid Data Replacement
        new DataReplace();
        // ENgrid Hide Script
        new DataHide();
        // Autosubmit script
        new Autosubmit();
        // Adjust display of event tickets.
        new EventTickets();
        // Swap Amounts
        new SwapAmounts();
        // On the end of the script, after all subscribers defined, let's load the current frequency
        // The amount will be loaded by the frequency change event
        // This timeout is needed because when you have alternative amounts, EN is slower than Engrid
        // about 20% of the time and we get a race condition if the client is also using the SwapAmounts feature
        window.setTimeout(() => {
            this._frequency.load();
        }, 150);
        // Fast Form Fill
        new FastFormFill();
        // Currency Related Components
        new LiveCurrency();
        new CustomCurrency();
        // Auto Country Select
        new AutoCountrySelect();
        // Add Image Attribution
        if (this.options.MediaAttribution)
            new MediaAttribution();
        // Apple Pay
        if (this.options.applePay)
            new ApplePay();
        // Capitalize Fields
        if (this.options.CapitalizeFields)
            new CapitalizeFields();
        // Auto Year Class
        if (this.options.AutoYear)
            new AutoYear();
        // Credit Card Utility
        new CreditCard();
        // Autocomplete Class
        new Autocomplete();
        // Ecard Class
        new Ecard();
        // Click To Expand
        if (this.options.ClickToExpand)
            new ClickToExpand();
        if (this.options.SkipToMainContentLink)
            new SkipToMainContentLink();
        if (this.options.SrcDefer)
            new SrcDefer();
        // Progress Bar
        if (this.options.ProgressBar)
            new ProgressBar();
        // RememberMe
        try {
            // Accessing window.localStorage will throw an exception if it isn't permitted due to security reasons
            // For example, this happens in Firefox when cookies are disabled.  If it isn't available, we shouldn't
            //  bother with enabling RememberMe
            if (this.options.RememberMe &&
                typeof this.options.RememberMe === "object" &&
                window.localStorage) {
                new RememberMe(this.options.RememberMe);
            }
        }
        catch (e) { }
        if (this.options.NeverBounceAPI)
            new NeverBounce(this.options.NeverBounceAPI, this.options.NeverBounceDateField, this.options.NeverBounceStatusField, this.options.NeverBounceDateFormat);
        // FreshAddress
        if (this.options.FreshAddress)
            new FreshAddress();
        new ShowIfAmount();
        new OtherAmount();
        new MinMaxAmount();
        new Ticker();
        new A11y();
        new AddNameToMessage();
        new ExpandRegionName();
        // Page Background
        new PageBackground();
        // Url Params to Form Fields
        new UrlToForm();
        // Required if Visible Fields
        new RequiredIfVisible();
        // EN Custom Validators (behind a feature flag, off by default)
        new ENValidators();
        //Debug hidden fields
        if (this.options.Debug)
            new DebugHiddenFields();
        // TidyContact
        if (this.options.TidyContact)
            new TidyContact();
        // Translate Fields
        if (this.options.TranslateFields)
            new TranslateFields();
        // Country Disable
        new CountryDisable();
        // Premium Gift Features
        new PremiumGift();
        // Supporter Hub Features
        new SupporterHub();
        // Digital Wallets Features
        if (ENGrid.getPageType() === "DONATION") {
            new DigitalWallets();
        }
        // Mobile CTA
        new MobileCTA();
        // Live Frequency
        new LiveFrequency();
        // Universal Opt In
        new UniversalOptIn();
        // Plaid
        if (this.options.Plaid)
            new Plaid();
        // Give By Select
        new GiveBySelect();
        new DataAttributes();
        //Exit Intent Lightbox
        new ExitIntentLightbox();
        new UrlParamsToBodyAttrs();
        new SetAttr();
        new ShowIfPresent();
        new PostalCodeValidator();
        // Very Good Security
        new VGS();
        new WelcomeBack();
        new EcardToTarget();
        //Debug panel
        let showDebugPanel = this.options.Debug;
        try {
            // accessing storage can throw an exception if it isn't available in Firefox
            if (!showDebugPanel &&
                window.sessionStorage.hasOwnProperty(DebugPanel.debugSessionStorageKey)) {
                showDebugPanel = true;
            }
        }
        catch (e) { }
        if (showDebugPanel) {
            new DebugPanel(this.options.PageLayouts);
        }
        if (ENGrid.getUrlParameter("development") === "branding") {
            new BrandingHtml().show();
        }
        ENGrid.setBodyData("data-engrid-scripts-js-loading", "finished");
        window.EngridVersion = AppVersion;
        this.logger.success(`VERSION: ${AppVersion}`);
        // Window Load
        let onLoad = typeof window.onload === "function" ? window.onload : null;
        if (document.readyState !== "loading") {
            this.onLoad();
        }
        else {
            window.onload = (e) => {
                this.onLoad();
                if (onLoad) {
                    onLoad.bind(window, e);
                }
            };
        }
    }
    onLoad() {
        if (this.options.onLoad) {
            this.options.onLoad();
        }
    }
    onResize() {
        if (this.options.onResize) {
            this.options.onResize();
        }
    }
    onValidate() {
        if (this.options.onValidate) {
            this.logger.log("Client onValidate Triggered");
            this.options.onValidate();
        }
    }
    onSubmit() {
        if (this.options.onSubmit) {
            this.logger.log("Client onSubmit Triggered");
            this.options.onSubmit();
        }
    }
    onError() {
        if (this.options.onError) {
            this.logger.danger("Client onError Triggered");
            this.options.onError();
        }
    }
    static log(message) {
        const logger = new EngridLogger("Client", "brown", "aliceblue", "🍪");
        logger.log(message);
    }
}
