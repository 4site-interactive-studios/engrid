import { EngridLogger } from "./logger";
import { ENGrid } from "./engrid";
import * as cookie from "./cookie";
export class StickyNSG {
    constructor() {
        this.logger = new EngridLogger("StickyNSG", "teal", "white", "📌");
        this.cookieName = "engrid-sticky-nsg";
        if (!this.shouldRun())
            return;
        this.logger.log("Sticky NSG is enabled");
        this.deleteCookieIfGiftProcessComplete();
        this.createStickyNSGCookie();
        this.applyStickyNSGCookie();
    }
    shouldRun() {
        return ENGrid.getOption("StickyNSG") === true;
    }
    nsgActiveOnPage() {
        return (window.EngagingNetworks &&
            window.EngagingNetworks.suggestedGift &&
            typeof window.EngagingNetworks.suggestedGift === "object" &&
            Object.keys(window.EngagingNetworks.suggestedGift).length > 0);
    }
    deleteCookieIfGiftProcessComplete() {
        if (ENGrid.getGiftProcess()) {
            this.logger.log("Gift process complete, removing sticky NSG cookie if it exists");
            cookie.remove(this.cookieName);
        }
    }
    createStickyNSGCookie() {
        var _a, _b, _c, _d;
        if (!this.nsgActiveOnPage()) {
            this.logger.log("No NSG active on page, not creating sticky NSG cookie");
            return;
        }
        const url = new URL(window.location.href);
        if (url.searchParams.get("skipstickynsg") === "true") {
            this.logger.log("'skipstickynsg' param present, not creating sticky NSG cookie");
            return;
        }
        const nsg = window.EngagingNetworks.suggestedGift;
        this.logger.log("Creating sticky NSG cookie", nsg);
        const cookieValue = JSON.stringify({
            onetime: {
                amounts: (_a = nsg.single) === null || _a === void 0 ? void 0 : _a.reduce((acc, curr) => {
                    acc[curr.value] = curr.value;
                    return acc;
                }, { "Other": "other" }),
                default: (_b = nsg.single) === null || _b === void 0 ? void 0 : _b.find((gift) => gift.nextSuggestedGift).value,
                stickyDefault: false,
            },
            monthly: {
                amounts: (_c = nsg.recurring) === null || _c === void 0 ? void 0 : _c.reduce((acc, curr) => {
                    acc[curr.value] = curr.value;
                    return acc;
                }, { "Other": "other" }),
                default: (_d = nsg.recurring) === null || _d === void 0 ? void 0 : _d.find((gift) => gift.nextSuggestedGift).value,
                stickyDefault: false,
            },
        });
        cookie.set(this.cookieName, cookieValue, { path: "/", expires: 30 });
        this.logger.log("Sticky NSG cookie created", cookieValue);
    }
    applyStickyNSGCookie() {
        if (this.nsgActiveOnPage()) {
            this.logger.log("NSG active on page, not applying sticky NSG cookie, leaving the EN NSG values.");
            return;
        }
        const cookieValue = cookie.get(this.cookieName);
        if (!cookieValue) {
            this.logger.log("No sticky NSG cookie found, nothing to apply");
            return;
        }
        try {
            const nsg = JSON.parse(cookieValue);
            this.logger.log("Applying sticky NSG cookie values", nsg);
            window.EngridAmounts = nsg;
        }
        catch (e) {
            this.logger.error("Error parsing sticky NSG cookie, not applying", e);
        }
    }
}
