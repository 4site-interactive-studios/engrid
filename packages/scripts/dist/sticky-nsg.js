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
    /*
     * Determine if NSG provided by EN is active on the page
     */
    nsgActiveOnPage() {
        return (window.EngagingNetworks &&
            window.EngagingNetworks.suggestedGift &&
            typeof window.EngagingNetworks.suggestedGift === "object" &&
            Object.keys(window.EngagingNetworks.suggestedGift).length > 0);
    }
    /*
     * Delete the cookie if the gift process is complete
     */
    deleteCookieIfGiftProcessComplete() {
        if (ENGrid.getGiftProcess()) {
            this.logger.log("Gift process complete, removing sticky NSG cookie if it exists");
            cookie.remove(this.cookieName);
        }
    }
    /*
     * Create the sticky NSG cookie if NSG is active on the page
     */
    createStickyNSGCookie() {
        var _a, _b, _c, _d, _e, _f;
        if (!this.nsgActiveOnPage()) {
            this.logger.log("No NSG active on page, not creating sticky NSG cookie");
            return;
        }
        const url = new URL(window.location.href);
        if (url.searchParams.get("skipstickynsg") === "true") {
            this.logger.log("'skipstickynsg' param present, not creating sticky NSG cookie");
            return;
        }
        // We do some reformating to match the EngridAmounts format
        // We also add "Other" to the amounts list
        const nsg = window.EngagingNetworks.suggestedGift;
        this.logger.log("Creating sticky NSG cookie", nsg);
        const oneTimeNsg = (_a = nsg.single) === null || _a === void 0 ? void 0 : _a.reduce((acc, curr) => {
            acc[curr.value] = curr.value;
            return acc;
        }, {});
        const oneTimeDefault = (_c = (_b = nsg.single) === null || _b === void 0 ? void 0 : _b.find((gift) => gift.nextSuggestedGift)) === null || _c === void 0 ? void 0 : _c.value;
        const recurringNsg = (_d = nsg.recurring) === null || _d === void 0 ? void 0 : _d.reduce((acc, curr) => {
            acc[curr.value] = curr.value;
            return acc;
        }, {});
        const recurringDefault = (_f = (_e = nsg.recurring) === null || _e === void 0 ? void 0 : _e.find((gift) => gift.nextSuggestedGift)) === null || _f === void 0 ? void 0 : _f.value;
        const nsgCookieData = {};
        if (oneTimeNsg && oneTimeDefault) {
            nsgCookieData.onetime = {
                amounts: oneTimeNsg,
                default: oneTimeDefault,
                stickyDefault: false,
            };
        }
        if (recurringNsg && recurringDefault) {
            nsgCookieData.monthly = {
                amounts: recurringNsg,
                default: recurringDefault,
                stickyDefault: false,
            };
        }
        if (Object.keys(nsgCookieData).length === 0) {
            this.logger.log("No valid NSG data found to create sticky NSG cookie");
            return;
        }
        const cookieValue = JSON.stringify(nsgCookieData);
        cookie.set(this.cookieName, cookieValue, { path: "/", expires: 30 });
        this.logger.log("Sticky NSG cookie created", cookieValue);
    }
    /*
     * Apply the sticky NSG cookie values to window.EngridAmounts if NSG is not active on the page
     */
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
