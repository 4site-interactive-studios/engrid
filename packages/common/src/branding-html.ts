/**
 * Inserts all of the branding HTML from https://github.com/4site-interactive-studios/engrid-scripts/tree/main/reference-materials/html/brand-guide-markup
 * into the body-main section of the page.
 */
export class BrandingHtml {
  private assetBaseUrl: string =
    "https://cdn.jsdelivr.net/gh/4site-interactive-studios/engrid-scripts@main/reference-materials/html/brand-guide-markup/";

  private brandingHtmlFiles: string[] = [
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

  private bodyMain: HTMLElement | null = document.querySelector(".body-main");

  private htmlFetched: boolean = false;

  private async fetchHtml() {
    const htmlRequests = this.brandingHtmlFiles.map(async (file) => {
      const res = await fetch(this.assetBaseUrl + file);
      return res.text();
    });

    const brandingHtmls: string[] = await Promise.all(htmlRequests);

    return brandingHtmls;
  }

  private appendHtml() {
    this.fetchHtml().then((html) =>
      html.forEach((h) => {
        const brandingSection = document.createElement("div");
        brandingSection.classList.add("brand-guide-section");
        brandingSection.innerHTML = h;
        this.bodyMain?.insertAdjacentElement("beforeend", brandingSection);
      })
    );

    this.htmlFetched = true;
  }

  public show() {
    if (!this.htmlFetched) {
      this.appendHtml();
      return;
    }

    const guides = document.querySelectorAll(
      ".brand-guide-section"
    ) as NodeListOf<HTMLElement>;

    guides?.forEach((g) => (g.style.display = "block"));
  }

  public hide() {
    const guides = document.querySelectorAll(
      ".brand-guide-section"
    ) as NodeListOf<HTMLElement>;

    guides?.forEach((g) => (g.style.display = "none"));
  }
}
