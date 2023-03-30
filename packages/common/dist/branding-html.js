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
            "click-to-call.html",
            "donation-page.html",
            "ecards.html",
            "ecommerce.html",
            "email-to-target.html",
            "en-common-fields-with-errors.html",
            "en-common-fields-with-fancy-errors.html",
            "en-common-fields.html",
            "event.html",
            "html5-tags.html",
            "membership.html",
            "petition.html",
            "premium-donation.html",
            "styles.html",
            "survey.html",
            "tweet-to-target.html",
        ];
        this.bodyMain = document.querySelector(".body-main");
        this.fetchHtml().then((html) => html.forEach((h) => { var _a; return (_a = this.bodyMain) === null || _a === void 0 ? void 0 : _a.insertAdjacentHTML("beforeend", h); }));
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
}
