import { ENGrid, EngridLogger } from "./";
import { EnForm } from "./events";
export class iFrame {
    constructor() {
        this._form = EnForm.getInstance();
        this.logger = new EngridLogger("iFrame", "brown", "gray", "📡");
        if (this.inIframe()) {
            // Add the data-engrid-embedded attribute when inside an iFrame if it wasn't already added by a script in the Page Template
            ENGrid.setBodyData("embedded", "");
            // Fire the resize event
            this.logger.log("iFrame Event - Begin Resizing");
            window.addEventListener("load", (event) => {
                // Scroll to top of iFrame
                this.logger.log("iFrame Event - window.onload");
                this.sendIframeHeight();
                window.parent.postMessage({
                    scroll: this.shouldScroll(),
                }, "*");
                // On click fire the resize event
                document.addEventListener("click", (e) => {
                    this.logger.log("iFrame Event - click");
                    setTimeout(() => {
                        this.sendIframeHeight();
                    }, 100);
                });
            });
            window.setTimeout(() => {
                this.sendIframeHeight();
            }, 300);
            window.addEventListener("resize", this.debounceWithImmediate(() => {
                this.logger.log("iFrame Event - window resized");
                this.sendIframeHeight();
            }));
            // Listen for the form submit event
            this._form.onSubmit.subscribe((e) => {
                this.logger.log("iFrame Event - onSubmit");
                this.sendIframeFormStatus("submit");
            });
            // If the iFrame is Chained, check if the form has data
            if (this.isChained() && this.hasPayment()) {
                this.logger.log("iFrame Event - Chained iFrame");
                this.sendIframeFormStatus("chained");
                this.hideFormComponents();
                this.addChainedBanner();
            }
            // Remove the skip link markup when inside an iFrame
            const skipLink = document.querySelector(".skip-link");
            if (skipLink) {
                skipLink.remove();
            }
            this._form.onError.subscribe(() => {
                // Get the first .en__field--validationFailed element
                const firstError = document.querySelector(".en__field--validationFailed");
                // Send scrollTo message
                // Parent pages listens for this message and scrolls to the correct position
                const scrollTo = firstError
                    ? firstError.getBoundingClientRect().top
                    : 0;
                this.logger.log(`iFrame Event 'scrollTo' - Position of top of first error ${scrollTo} px`); // check the message is being sent correctly
                window.parent.postMessage({ scrollTo }, "*");
            });
        }
        else {
            // When not in iframe, default behaviour, smooth scroll to first error
            this._form.onError.subscribe(() => {
                // Smooth Scroll to the first .en__field--validationFailed element
                const firstError = document.querySelector(".en__field--validationFailed");
                if (firstError) {
                    firstError.scrollIntoView({ behavior: "smooth" });
                }
            });
            // Parent Page Logic (when an ENgrid form is embedded in an ENgrid page)
            window.addEventListener("message", (event) => {
                const iframe = this.getIFrameByEvent(event);
                if (iframe) {
                    if (event.data.hasOwnProperty("frameHeight")) {
                        iframe.style.height = event.data.frameHeight + "px";
                    }
                    // Old scroll event logic "scroll", scrolls to correct iframe?
                    else if (event.data.hasOwnProperty("scroll") &&
                        event.data.scroll > 0) {
                        const elDistanceToTop = window.pageYOffset + iframe.getBoundingClientRect().top;
                        let scrollTo = elDistanceToTop + event.data.scroll;
                        window.scrollTo({
                            top: scrollTo,
                            left: 0,
                            behavior: "smooth",
                        });
                        this.logger.log("iFrame Event - Scrolling Window to " + scrollTo);
                    }
                    // New scroll event logic "scrollTo", scrolls to the first error
                    else if (event.data.hasOwnProperty("scrollTo")) {
                        const scrollToPosition = event.data.scrollTo +
                            window.scrollY +
                            iframe.getBoundingClientRect().top;
                        window.scrollTo({
                            top: scrollToPosition,
                            left: 0,
                            behavior: "smooth",
                        });
                        this.logger.log("iFrame Event - Scrolling Window to " + scrollToPosition);
                    }
                }
            });
        }
    }
    sendIframeHeight() {
        let height = document.body.offsetHeight;
        this.logger.log("iFrame Event - Sending iFrame height of: " + height + "px"); // check the message is being sent correctly
        window.parent.postMessage({
            frameHeight: height,
            pageNumber: ENGrid.getPageNumber(),
            pageCount: ENGrid.getPageCount(),
            giftProcess: ENGrid.getGiftProcess(),
        }, "*");
    }
    sendIframeFormStatus(status) {
        window.parent.postMessage({
            status: status,
            pageNumber: ENGrid.getPageNumber(),
            pageCount: ENGrid.getPageCount(),
            giftProcess: ENGrid.getGiftProcess(),
        }, "*");
    }
    getIFrameByEvent(event) {
        return [].slice
            .call(document.getElementsByTagName("iframe"))
            .filter((iframe) => {
            return iframe.contentWindow === event.source;
        })[0];
    }
    shouldScroll() {
        // If you find a error, scroll
        if (document.querySelector(".en__errorHeader")) {
            return true;
        }
        // If it's a chained iFrame, don't scroll
        if (this.isChained()) {
            return false;
        }
        // Try to match the iframe referrer URL by testing valid EN Page URLs
        let referrer = document.referrer;
        let enURLPattern = new RegExp(/^(.*)\/(page)\/(\d+.*)/);
        // Scroll if the Regex matches, don't scroll otherwise
        return enURLPattern.test(referrer);
    }
    inIframe() {
        try {
            return window.self !== window.top;
        }
        catch (e) {
            return true;
        }
    }
    isChained() {
        return !!ENGrid.getUrlParameter("chain");
    }
    hasPayment() {
        const payment = ENGrid.getFieldValue("transaction.paymenttype");
        const ccnumber = ENGrid.getFieldValue("transaction.ccnumber");
        return payment || ccnumber;
    }
    hideFormComponents() {
        this.logger.log("iFrame Event - Hiding Form Components");
        const en__component = document.querySelectorAll(".body-main > div");
        en__component.forEach((component, index) => {
            if (component.classList.contains("hide") === false &&
                component.classList.contains("hide-iframe") === false &&
                component.classList.contains("radio-to-buttons_donationAmt") ===
                    false &&
                index < en__component.length - 1) {
                component.classList.add("hide-iframe");
                component.classList.add("hide-chained");
            }
        });
        this.sendIframeHeight();
    }
    showFormComponents() {
        this.logger.log("iFrame Event - Showing Form Components");
        const en__component = document.querySelectorAll(".body-main > div.hide-chained");
        en__component.forEach((component) => {
            component.classList.remove("hide-iframe");
            component.classList.remove("hide-chained");
        });
        this.sendIframeHeight();
    }
    addChainedBanner() {
        var _a, _b;
        this.logger.log("iFrame Event - Adding Chained Banner");
        const banner = document.createElement("div");
        const lastComponent = document.querySelector(".body-main > div:last-of-type");
        banner.classList.add("en__component");
        banner.classList.add("en__component--banner");
        banner.classList.add("en__component--banner--chained");
        banner.innerHTML = `<div class="en__component__content"><div class="en__component__content__inner"><div class="en__component__content__text"><p>
      Giving as <strong>${ENGrid.getFieldValue("supporter.firstName")} ${ENGrid.getFieldValue("supporter.lastName")}</strong> 
      with <strong>${ENGrid.getFieldValue("transaction.paymenttype").toUpperCase()}</strong>
      (<a href="#" class="en__component__content__link">change</a>)</p></div></div></div>`;
        (_a = lastComponent === null || lastComponent === void 0 ? void 0 : lastComponent.parentNode) === null || _a === void 0 ? void 0 : _a.insertBefore(banner, lastComponent);
        (_b = banner
            .querySelector(".en__component__content__link")) === null || _b === void 0 ? void 0 : _b.addEventListener("click", (e) => {
            e.preventDefault();
            this.showFormComponents();
            banner.remove();
        });
    }
    debounceWithImmediate(func, timeout = 1000) {
        let timer;
        let firstEvent = true;
        return (...args) => {
            clearTimeout(timer);
            if (firstEvent) {
                func.apply(this, args);
                firstEvent = false;
            }
            timer = setTimeout(() => {
                func.apply(this, args);
                firstEvent = true;
            }, timeout);
        };
    }
}
