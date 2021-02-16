import { DonationAmount, DonationFrequency, EnForm, ProcessingFees } from '@4site/engrid-events';
import { Options, OptionsDefaults, ImageAttribution, ApplePay, CapitalizeFields, ClickToExpand, engrid, getUrlParameter, IE, LiveVariables, Modal, sendIframeHeight, ShowHideRadioCheckboxes, SimpleCountrySelect } from './';

export class App {

    // Events
    private _form: EnForm = EnForm.getInstance();
    private _fees: ProcessingFees = ProcessingFees.getInstance();
    private _amount: DonationAmount = DonationAmount.getInstance(
        "transaction.donationAmt",
        "transaction.donationAmt.other"
    );
    private _frequency: DonationFrequency = DonationFrequency.getInstance("transaction.recurrpay");

    private options: Options;

    public enID = getUrlParameter('en_id');


    constructor(options: Options) {
        this.options = { ...OptionsDefaults, ...options };
        // Document Load
        if (document.readyState !== "loading") {
            this.run();
        } else {
            document.addEventListener("DOMContentLoaded", () => {
                this.run();
            });
        }
        // Window Load
        window.onload = () => {
            this.onLoad();
        }
        // Window Resize
        window.onresize = () => {
            this.onResize();
        }
    }

    private run() {
        // IE Warning
        new IE();

        // TODO: Abstract everything to the App class so we can remove custom-methods
        engrid.setBackgroundImage();
        engrid.inputPlaceholder();
        engrid.watchInmemField();
        engrid.watchGiveBySelectField();
        engrid.watchLegacyGiveBySelectField();
        engrid.SetEnFieldOtherAmountRadioStepValue();
        engrid.simpleUnsubscribe();

        engrid.contactDetailLabels();
        engrid.easyEdit();
        engrid.enInput.init();

        new ShowHideRadioCheckboxes("transaction.giveBySelect", "giveBySelect-");
        new ShowHideRadioCheckboxes("supporter.questions.180165", "giveBySelect-"); // @TODO this value "180165" shouldn't be hard coced
        new ShowHideRadioCheckboxes("transaction.inmem", "inmem-");
        new ShowHideRadioCheckboxes("transaction.recurrpay", "recurrpay-");

        // Controls if the Theme has a the "Debug Bar"
        // engrid.debugBar();

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

        // iFrame Logic
        this.loadIFrame();

        // Live Variables
        new LiveVariables(this.options);

        // Modal
        const modal = new Modal();
        modal.debug = this.options.ModalDebug; // Comment it out to disable debug

        // On the end of the script, after all subscribers defined, let's load the current value
        this._amount.load();
        this._frequency.load();

        // Simple Country Select
        new SimpleCountrySelect();
        // Add Image Attribution
        if (this.options.ImageAttribution) new ImageAttribution();
        // Apple Pay
        if (this.options.applePay) new ApplePay();
        // Capitalize Fields
        if (this.options.CapitalizeFields) new CapitalizeFields();
        // Click To Expand
        if (this.options.ClickToExpand) new ClickToExpand();


    }

    private onLoad() {
        if (this.options.onLoad) {
            this.options.onLoad();
        }
        if (this.inIframe()) {
            // Scroll to top of iFrame
            console.log("iFrame Event - window.onload");
            sendIframeHeight(this.enID);
            window.parent.postMessage(
                {
                    scroll: this.shouldScroll(),
                    enID: this.enID
                },
                "*"
            );

            // On click fire the resize event
            document.addEventListener("click", (e: Event) => {
                console.log("iFrame Event - click");
                setTimeout(() => {
                    sendIframeHeight(this.enID);
                }, 100);
            });
        }
    }

    private onResize() {
        if (this.options.onResize) {
            this.options.onResize();
        }
        if (this.inIframe()) {
            console.log("iFrame Event - window.onload");
            sendIframeHeight(this.enID);
        }
    }
    private inIframe() {
        try {
            return window.self !== window.top;
        } catch (e) {
            return true;
        }
    }
    private shouldScroll = () => {
        // If you find a error, scroll
        if (document.querySelector('.en__errorHeader')) {
            return true;
        }
        // Try to match the iframe referrer URL by testing valid EN Page URLs
        let referrer = document.referrer;
        let enURLPattern = new RegExp(/^(.*)\/(page)\/(\d+.*)/);

        // Scroll if the Regex matches, don't scroll otherwise
        return enURLPattern.test(referrer);
    }
    private loadIFrame() {
        if (this.inIframe()) {
            // Add the data-engrid-embedded attribute when inside an iFrame if it wasn't already added by a script in the Page Template
            document.body.setAttribute("data-engrid-embedded", "");
            // Fire the resize event
            console.log("iFrame Event - First Resize");
            sendIframeHeight(this.enID);
        }
    }
}