import { DonationAmount, DonationFrequency, EnForm, ProcessingFees } from './events';
import { UpsellLightbox, ENGrid, OptionsDefaults, setRecurrFreq, PageBackground, MediaAttribution, ApplePay, CapitalizeFields, ClickToExpand, legacy, IE, LiveVariables, sendIframeHeight, ShowHideRadioCheckboxes, SimpleCountrySelect, SkipToMainContentLink, SrcDefer, NeverBounce } from './';
export class App extends ENGrid {
    constructor(options) {
        super();
        // Events
        this._form = EnForm.getInstance();
        this._fees = ProcessingFees.getInstance();
        this._amount = DonationAmount.getInstance("transaction.donationAmt", "transaction.donationAmt.other");
        this._frequency = DonationFrequency.getInstance();
        this.shouldScroll = () => {
            // If you find a error, scroll
            if (document.querySelector('.en__errorHeader')) {
                return true;
            }
            // Try to match the iframe referrer URL by testing valid EN Page URLs
            let referrer = document.referrer;
            let enURLPattern = new RegExp(/^(.*)\/(page)\/(\d+.*)/);
            // Scroll if the Regex matches, don't scroll otherwise
            return enURLPattern.test(referrer);
        };
        this.options = Object.assign(Object.assign({}, OptionsDefaults), options);
        // Add Options to window
        window.EngridOptions = this.options;
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
        window.onload = () => {
            this.onLoad();
        };
        // Window Resize
        window.onresize = () => {
            this.onResize();
        };
    }
    run() {
        // Enable debug if available is the first thing
        if (this.options.Debug || App.getUrlParameter('debug') == 'true')
            App.setBodyData('debug', '');
        // IE Warning
        new IE();
        // Page Background
        new PageBackground();
        // TODO: Abstract everything to the App class so we can remove custom-methods
        legacy.inputPlaceholder();
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
        // Controls if the Theme has a the "Debug Bar"
        // legacy.debugBar();
        // Client onSubmit and onError functions
        this._form.onSubmit.subscribe(() => this.onSubmit());
        this._form.onError.subscribe(() => this.onError());
        this._form.onValidate.subscribe(() => this.onValidate());
        // Event Listener Examples
        this._amount.onAmountChange.subscribe((s) => console.log(`Live Amount: ${s}`));
        this._frequency.onFrequencyChange.subscribe((s) => console.log(`Live Frequency: ${s}`));
        this._form.onSubmit.subscribe((s) => console.log('Submit: ', s));
        this._form.onError.subscribe((s) => console.log('Error:', s));
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
        // On the end of the script, after all subscribers defined, let's load the current value
        this._amount.load();
        this._frequency.load();
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
        // Click To Expand
        if (this.options.ClickToExpand)
            new ClickToExpand();
        if (this.options.SkipToMainContentLink)
            new SkipToMainContentLink();
        if (this.options.SrcDefer)
            new SrcDefer();
        if (this.options.NeverBounceAPI)
            new NeverBounce(this.options.NeverBounceAPI, this.options.NeverBounceDateField, this.options.NeverBounceStatusField);
        this.setDataAttributes();
    }
    onLoad() {
        if (this.options.onLoad) {
            this.options.onLoad();
        }
        if (this.inIframe()) {
            // Scroll to top of iFrame
            if (App.debug)
                console.log("iFrame Event - window.onload");
            sendIframeHeight();
            window.parent.postMessage({
                scroll: this.shouldScroll()
            }, "*");
            // On click fire the resize event
            document.addEventListener("click", (e) => {
                if (App.debug)
                    console.log("iFrame Event - click");
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
            if (App.debug)
                console.log("iFrame Event - window.onload");
            sendIframeHeight();
        }
    }
    onValidate() {
        if (this.options.onValidate) {
            if (App.debug)
                console.log("Client onValidate Triggered");
            this.options.onValidate();
        }
    }
    onSubmit() {
        if (this.options.onSubmit) {
            if (App.debug)
                console.log("Client onSubmit Triggered");
            this.options.onSubmit();
        }
    }
    onError() {
        if (this.options.onError) {
            if (App.debug)
                console.log("Client onError Triggered");
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
            if (App.debug)
                console.log("iFrame Event - First Resize");
            sendIframeHeight();
        }
    }
    // Use this function to add any Data Attributes to the Body tag
    setDataAttributes() {
        // Add a body banner data attribute if it's empty
        if (!document.querySelector('.body-banner img')) {
            App.setBodyData('body-banner', 'empty');
        }
    }
}
