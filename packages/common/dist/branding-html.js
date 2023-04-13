var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
/**
 * Inserts all of the branding HTML from https://github.com/4site-interactive-studios/engrid-scripts/tree/main/reference-materials/html/brand-guide-markup
 * into the body-main section of the page.
 */
export class BrandingHtml {
    constructor() {
        this.assetBaseUrl = "https://cdn.jsdelivr.net/gh/4site-interactive-studios/engrid-scripts@main/reference-materials/html/brand-guide-markup/";
        this.brandingHtmlFiles = [
            "html5-tags.html",
            "en-common-fields.html",
            "survey.html",
            // "en-common-fields-with-errors.html",
            // "en-common-fields-with-fancy-errors.html",
            "donation-page.html",
            "premium-donation.html",
            "ecards.html",
            "email-to-target.html",
            "tweet-to-target.html",
            // "click-to-call.html",
            "petition.html",
            "event.html",
            // "ecommerce.html",
            // "membership.html",
            "styles.html",
        ];
        this.bodyMain = document.querySelector(".body-main");
        this.htmlFetched = false;
    }
    fetchHtml() {
        return __awaiter(this, void 0, void 0, function* () {
            const htmlRequests = this.brandingHtmlFiles.map((file) => __awaiter(this, void 0, void 0, function* () {
                const res = yield fetch(this.assetBaseUrl + file);
                return res.text();
            }));
            const brandingHtmls = yield Promise.all(htmlRequests);
            return brandingHtmls;
        });
    }
    appendHtml() {
        this.fetchHtml().then((html) => html.forEach((h) => {
            var _a;
            const brandingSection = document.createElement("div");
            brandingSection.classList.add("brand-guide-section");
            brandingSection.innerHTML = h;
            (_a = this.bodyMain) === null || _a === void 0 ? void 0 : _a.insertAdjacentElement("beforeend", brandingSection);
        }));
        this.htmlFetched = true;
    }
    show() {
        if (!this.htmlFetched) {
            this.appendHtml();
            return;
        }
        const guides = document.querySelectorAll(".brand-guide-section");
        guides === null || guides === void 0 ? void 0 : guides.forEach((g) => (g.style.display = "block"));
    }
    hide() {
        const guides = document.querySelectorAll(".brand-guide-section");
        guides === null || guides === void 0 ? void 0 : guides.forEach((g) => (g.style.display = "none"));
    }
}
