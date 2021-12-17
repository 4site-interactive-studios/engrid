import { DonationAmount, DonationFrequency, EnForm, ProcessingFees, } from "./events";
import { AmountLabel, Loader, ProgressBar, UpsellLightbox, ENGrid, OptionsDefaults, setRecurrFreq, PageBackground, MediaAttribution, ApplePay, CapitalizeFields, CreditCardNumbers, Ecard, ClickToExpand, legacy, LiveVariables, sendIframeHeight, sendIframeFormStatus, ShowHideRadioCheckboxes, SimpleCountrySelect, SkipToMainContentLink, SrcDefer, NeverBounce, AutoYear, Autocomplete, RememberMe, TranslateFields, ShowIfAmount, EngridLogger, } from "./";
export class App extends ENGrid {
    constructor(options) {
        super();
        // Events
        this._form = EnForm.getInstance();
        this._fees = ProcessingFees.getInstance();
        this._amount = DonationAmount.getInstance("transaction.donationAmt", "transaction.donationAmt.other");
        this._frequency = DonationFrequency.getInstance();
        this.logger = new EngridLogger("App", "black", "white", "🍏");
        this.shouldScroll = () => {
            // If you find a error, scroll
            if (document.querySelector(".en__errorHeader")) {
                return true;
            }
            // Try to match the iframe referrer URL by testing valid EN Page URLs
            let referrer = document.referrer;
            let enURLPattern = new RegExp(/^(.*)\/(page)\/(\d+.*)/);
            // Scroll if the Regex matches, don't scroll otherwise
            return enURLPattern.test(referrer);
        };
        const loader = new Loader();
        this.options = Object.assign(Object.assign({}, OptionsDefaults), options);
        // Add Options to window
        window.EngridOptions = this.options;
        if (loader.reload())
            return;
        // Document Load
        if (document.readyState !== "loading") {
            this.run();
        }
        else {
            document.addEventListener("DOMContentLoaded", () => {
                this.run();
            });
        }
        // Window Load
        let onLoad = typeof window.onload === "function" ? window.onload : null;
        window.onload = (e) => {
            this.onLoad();
            if (onLoad) {
                onLoad.bind(window, e);
            }
        };
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
            }, 10);
            return;
        }
        if (this.options.Debug || App.getUrlParameter("debug") == "true")
            // Enable debug if available is the first thing
            App.setBodyData("debug", "");
        // Page Background
        new PageBackground();
        // TODO: Abstract everything to the App class so we can remove custom-methods
        legacy.inputPlaceholder();
        legacy.preventAutocomplete();
        legacy.watchInmemField();
        legacy.watchGiveBySelectField();
        legacy.SetEnFieldOtherAmountRadioStepValue();
        legacy.simpleUnsubscribe();
        legacy.contactDetailLabels();
        legacy.easyEdit();
        legacy.enInput.init();
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
        // Controls if the Theme has a the "Debug Bar"
        // legacy.debugBar();
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
        this._form.onSubmit.subscribe((s) => this.logger.success("Submit: " + s));
        this._form.onError.subscribe((s) => this.logger.danger("Error: " + s));
        window.enOnSubmit = () => {
            this._form.dispatchSubmit();
            return this._form.submit;
        };
        window.enOnError = () => {
            this._form.dispatchError();
        };
        window.enOnValidate = () => {
            this._form.dispatchValidate();
            return this._form.validate;
        };
        // iFrame Logic
        this.loadIFrame();
        // Live Variables
        new LiveVariables(this.options);
        // Dynamically set Recurrency Frequency
        new setRecurrFreq();
        // Upsell Lightbox
        new UpsellLightbox();
        // Amount Labels
        new AmountLabel();
        // On the end of the script, after all subscribers defined, let's load the current value
        this._amount.load();
        this._frequency.load();
        // Translate Fields
        if (this.options.TranslateFields)
            new TranslateFields();
        // Simple Country Select
        new SimpleCountrySelect();
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
        // Credit Card Numbers Only
        new CreditCardNumbers();
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
        if (this.options.RememberMe && typeof this.options.RememberMe === "object")
            new RememberMe(this.options.RememberMe);
        if (this.options.NeverBounceAPI)
            new NeverBounce(this.options.NeverBounceAPI, this.options.NeverBounceDateField, this.options.NeverBounceStatusField, this.options.NeverBounceDateFormat);
        new ShowIfAmount();
        this.setDataAttributes();
    }
    onLoad() {
        if (this.options.onLoad) {
            this.options.onLoad();
        }
        if (this.inIframe()) {
            // Scroll to top of iFrame
            this.logger.log("iFrame Event - window.onload");
            sendIframeHeight();
            window.parent.postMessage({
                scroll: this.shouldScroll(),
            }, "*");
            // On click fire the resize event
            document.addEventListener("click", (e) => {
                this.logger.log("iFrame Event - click");
                setTimeout(() => {
                    sendIframeHeight();
                }, 100);
            });
        }
    }
    onResize() {
        if (this.options.onResize) {
            this.options.onResize();
        }
        if (this.inIframe()) {
            this.logger.log("iFrame Event - window.onload");
            sendIframeHeight();
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
        if (this.inIframe()) {
            sendIframeFormStatus("submit");
        }
    }
    onError() {
        if (this.options.onError) {
            this.logger.danger("Client onError Triggered");
            this.options.onError();
        }
    }
    inIframe() {
        try {
            return window.self !== window.top;
        }
        catch (e) {
            return true;
        }
    }
    loadIFrame() {
        if (this.inIframe()) {
            // Add the data-engrid-embedded attribute when inside an iFrame if it wasn't already added by a script in the Page Template
            App.setBodyData("embedded", "");
            // Fire the resize event
            this.logger.log("iFrame Event - First Resize");
            sendIframeHeight();
        }
    }
    // Use this function to add any Data Attributes to the Body tag
    setDataAttributes() {
        // Add a body banner data attribute if the banner contains no image
        // @TODO Should this account for video?
        // @TODO Should we merge this with the script that checks the background image?
        if (!document.querySelector(".body-banner img")) {
            App.setBodyData("body-banner", "empty");
        }
        // Add a page-alert data attribute if it is empty
        if (!document.querySelector(".page-alert *")) {
            App.setBodyData("no-page-alert", "");
        }
        // Add a content-header data attribute if it is empty
        if (!document.querySelector(".content-header *")) {
            App.setBodyData("no-content-header", "");
        }
        // Add a body-headerOutside data attribute if it is empty
        if (!document.querySelector(".body-headerOutside *")) {
            App.setBodyData("no-body-headerOutside", "");
        }
        // Add a body-header data attribute if it is empty
        if (!document.querySelector(".body-header *")) {
            App.setBodyData("no-body-header", "");
        }
        // Add a body-title data attribute if it is empty
        if (!document.querySelector(".body-title *")) {
            App.setBodyData("no-body-title", "");
        }
        // Add a body-banner data attribute if it is empty
        if (!document.querySelector(".body-banner *")) {
            App.setBodyData("no-body-banner", "");
        }
        // Add a body-bannerOverlay data attribute if it is empty
        if (!document.querySelector(".body-bannerOverlay *")) {
            App.setBodyData("no-body-bannerOverlay", "");
        }
        // Add a body-top data attribute if it is empty
        if (!document.querySelector(".body-top *")) {
            App.setBodyData("no-body-top", "");
        }
        // Add a body-main data attribute if it is empty
        if (!document.querySelector(".body-main *")) {
            App.setBodyData("no-body-main", "");
        }
        // Add a body-bottom data attribute if it is empty
        if (!document.querySelector(".body-bottom *")) {
            App.setBodyData("no-body-bottom", "");
        }
        // Add a body-footer data attribute if it is empty
        if (!document.querySelector(".body-footer *")) {
            App.setBodyData("no-body-footer", "");
        }
        // Add a body-footerOutside data attribute if it is empty
        if (!document.querySelector(".body-footerOutside *")) {
            App.setBodyData("no-body-footerOutside", "");
        }
        // Add a content-footerSpacer data attribute if it is empty
        if (!document.querySelector(".content-footerSpacer *")) {
            App.setBodyData("no-content-footerSpacer", "");
        }
        // Add a content-preFooter data attribute if it is empty
        if (!document.querySelector(".content-preFooter *")) {
            App.setBodyData("no-content-preFooter", "");
        }
        // Add a content-footer data attribute if it is empty
        if (!document.querySelector(".content-footer *")) {
            App.setBodyData("no-content-footer", "");
        }
        // Add a page-backgroundImage data attribute if it is empty
        if (!document.querySelector(".page-backgroundImage *")) {
            App.setBodyData("no-page-backgroundImage", "");
        }
        // Add a page-backgroundImageOverlay data attribute if it is empty
        if (!document.querySelector(".page-backgroundImageOverlay *")) {
            App.setBodyData("no-page-backgroundImageOverlay", "");
        }
        // Add a page-customCode data attribute if it is empty
        if (!document.querySelector(".page-customCode *")) {
            App.setBodyData("no-page-customCode", "");
        }
        // Add a country data attribute
        const countrySelect = document.querySelector("#en__field_supporter_country");
        if (countrySelect) {
            App.setBodyData("country", countrySelect.value);
            countrySelect.addEventListener("change", () => {
                App.setBodyData("country", countrySelect.value);
            });
        }
    }
}
