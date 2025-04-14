// This component only works on Thank You pages and the current page IS NOT embedded as an iframe.
// It searches for a post-donation tag (engrid-post-donation)
// and if it exists, it will replace it with an iframe of the current donation page, replacing the
// "/donate/2" with "/donate/1" and adding a ?chain.
// It has 2 parameters:
// 1. params: the URL parameters to pass to the iframe
// 2. amounts: comma separated list of amounts to pass to the iframe
import { ENGrid, EngridLogger } from ".";

export class PostDonationEmbed {
  private logger: EngridLogger = new EngridLogger(
    "PostDonationEmbed",
    "red",
    "white",
    "🖼️"
  );
  constructor() {
    if (!this.shouldRun()) return;
    this.logger.log("Post Donation Tag found");
    const postDonationTag = document.querySelector(
      "engrid-post-donation"
    ) as HTMLElement;
    // Get current page URL
    let currentUrl = new URL(window.location.href);
    // Modify the path: replace "/donate/2" with "/donate/1"
    currentUrl.pathname = currentUrl.pathname.replace("/donate/2", "/donate/1");
    // Extract parameters from the <engrid-post-donation> tag
    let params = postDonationTag.getAttribute("params") || "";
    let amounts = postDonationTag.getAttribute("amounts");
    // Format parameters correctly
    let searchParams = new URLSearchParams(params.replace(/&/g, "&"));
    let paramString = searchParams
      .toString()
      .replace(/%5B/g, "[")
      .replace(/%5D/g, "]");

    // Construct new URL with "chain" parameter
    let newUrl = `${currentUrl.origin}${currentUrl.pathname}?chain&${paramString}`;
    if (amounts) {
      newUrl += `&engrid-amounts=${amounts}`;
    }

    // Create the iframe element
    let iframe = document.createElement("iframe");
    iframe.setAttribute("loading", "lazy");
    iframe.setAttribute("width", "100%");
    iframe.setAttribute("scrolling", "no");
    iframe.setAttribute("class", "engrid-iframe thank-you-page-donation");
    iframe.setAttribute("src", newUrl);
    iframe.setAttribute("frameborder", "0");
    iframe.setAttribute("allowfullscreen", "");
    iframe.setAttribute("allowpaymentrequest", "true");
    iframe.setAttribute("allow", "payment");
    iframe.setAttribute("title", "Post Donation iframe");

    // Replace <engrid-post-donation> with the iframe
    postDonationTag.replaceWith(iframe);
  }
  shouldRun() {
    return (
      ENGrid.isThankYouPage() &&
      this.hasPostDonationTag() &&
      ENGrid.getBodyData("embedded") === null
    );
  }
  hasPostDonationTag() {
    return !!document.querySelector("engrid-post-donation");
  }
}
