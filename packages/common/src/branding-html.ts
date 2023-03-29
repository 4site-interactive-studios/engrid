/**
 * Inserts all of the branding HTML from https://github.com/4site-interactive-studios/engrid-scripts/tree/main/reference-materials/html/brand-guide-markup
 * into the body-main section of the page.
 */
export class BrandingHtml {
  private assetBaseUrl: string =
    "https://cdn.jsdelivr.net/gh/4site-interactive-studios/engrid-scripts@main/reference-materials/html/brand-guide-markup/";

  private brandingHtmlFiles: string[] = [
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

  private bodyMain: HTMLElement | null = document.querySelector(".body-main");

  constructor() {
    this.fetchHtml().then((html) =>
      html.forEach((h) => this.bodyMain?.insertAdjacentHTML("beforeend", h))
    );
  }

  private async fetchHtml() {
    const htmlRequests = this.brandingHtmlFiles.map(async (file) => {
      const res = await fetch(this.assetBaseUrl + file);
      return res.text();
    });

    const brandingHtmls: string[] = await Promise.all(htmlRequests);

    return brandingHtmls;
  }
}
