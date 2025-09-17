import { EngridLogger } from "./logger";
import { ENGrid } from "./engrid";
import * as cookie from "./cookie";

export class StickyNSG {
  private logger: EngridLogger = new EngridLogger(
    "StickyNSG",
    "teal",
    "white",
    "📌"
  );
  private cookieName: string = "engrid-sticky-nsg";

  constructor() {
    if (!this.shouldRun()) return;
    this.logger.log("Sticky NSG is enabled");
    this.deleteCookieIfGiftProcessComplete();
    this.createStickyNSGCookie();
    this.applyStickyNSGCookie();
  }

  private shouldRun(): boolean {
    return ENGrid.getOption("StickyNSG") === true;
  }

  private nsgActiveOnPage(): boolean {
    return (
      window.EngagingNetworks &&
      window.EngagingNetworks.suggestedGift &&
      typeof window.EngagingNetworks.suggestedGift === "object" &&
      Object.keys(window.EngagingNetworks.suggestedGift).length > 0
    );
  }

  private deleteCookieIfGiftProcessComplete() {
    if (ENGrid.getGiftProcess()) {
      this.logger.log(
        "Gift process complete, removing sticky NSG cookie if it exists"
      );
      cookie.remove(this.cookieName);
    }
  }

  private createStickyNSGCookie() {
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
        amounts: nsg.single?.reduce((acc: any, curr: any) => {
          acc[curr.value] = curr.value;
          return acc;
        }, {"Other": "other"}),
        default: nsg.single?.find((gift: any) => gift.nextSuggestedGift).value,
        stickyDefault: false,
      },
      monthly: {
        amounts: nsg.recurring?.reduce((acc: any, curr: any) => {
          acc[curr.value] = curr.value;
          return acc;
        }, {"Other": "other"}),
        default: nsg.recurring?.find((gift: any) => gift.nextSuggestedGift).value,
        stickyDefault: false,
      },
    });
    cookie.set(this.cookieName, cookieValue, { path: "/", expires: 30 });
    this.logger.log("Sticky NSG cookie created", cookieValue);
  }

  private applyStickyNSGCookie() {
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
    } catch (e) {
      this.logger.error("Error parsing sticky NSG cookie, not applying", e);
    }
  }
}
