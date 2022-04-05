// Ref: https://app.getguru.com/card/iMgx968T/ENgrid-Loader
import { ENGrid, EngridLogger } from ".";
export class Loader {
  private logger: EngridLogger = new EngridLogger(
    "Loader",
    "gold",
    "black",
    "🔁"
  );
  private cssElement = document.querySelector(
    'link[href*="engrid."][rel="stylesheet"]'
  );
  private jsElement = document.querySelector('script[src*="engrid."]');
  // Returns true if ENgrid should reload (that means the current ENgrid is not the right one)
  // Returns false if ENgrid should not reload (that means the current ENgrid is the right one)
  public reload() {
    const isLoaded = ENGrid.getBodyData("loaded");
    let assets = this.getOption("assets");

    if (isLoaded || !assets) {
      this.logger.success("LOADED");
      return false;
    }

    // Load the right ENgrid
    this.logger.log("RELOADING");
    ENGrid.setBodyData("loaded", "true"); // Set the loaded flag, so the next time we don't reload
    // Fetch the desired repo, assets location, and override JS/CSS
    const engrid_repo = this.getOption("repo-name");
    const engrid_repo_owner =
      this.getOption("repo-owner") ?? "4site-interactive-studios";
    let engrid_js_url = "";
    let engrid_css_url = "";
    switch (assets) {
      case "local":
        this.logger.log("LOADING LOCAL");
        // Find a way to guess local URL if there's no engrid_repo
        if (!engrid_repo) {
          const theme = ENGrid.getBodyData("theme");
          engrid_js_url = `https://engrid-${theme}.test/dist/engrid.js`;
          engrid_css_url = `https://engrid-${theme}.test/dist/engrid.css`;
        } else {
          engrid_js_url = `https://${engrid_repo}.test/dist/engrid.js`;
          engrid_css_url = `https://${engrid_repo}.test/dist/engrid.css`;
        }
        break;
      case "flush":
        this.logger.log("FLUSHING CACHE");
        const timestamp = Date.now();
        const jsCurrentURL = new URL(this.jsElement?.getAttribute("src") || "");
        jsCurrentURL.searchParams.set("v", timestamp.toString());
        engrid_js_url = jsCurrentURL.toString();
        const cssCurrentURL = new URL(
          this.cssElement?.getAttribute("href") || ""
        );
        cssCurrentURL.searchParams.set("v", timestamp.toString());
        engrid_css_url = cssCurrentURL.toString();
        break;
      default:
        this.logger.log("LOADING EXTERNAL");
        engrid_js_url =
          "https://cdn.jsdelivr.net/gh/" +
          engrid_repo_owner +
          "/" +
          engrid_repo +
          "@" +
          assets +
          "/dist/engrid.js";
        engrid_css_url =
          "https://cdn.jsdelivr.net/gh/" +
          engrid_repo_owner +
          "/" +
          engrid_repo +
          "@" +
          assets +
          "/dist/engrid.css";
    }
    this.setCssFile(engrid_css_url);
    this.setJsFile(engrid_js_url);
    this.jsElement?.remove();
    return true;
  }
  private getOption(key: keyof Window["EngridLoader"]) {
    const urlParam = ENGrid.getUrlParameter(key);
    // Only "assets" can be set in URL
    if (urlParam && key === "assets") {
      return urlParam;
    } else if (window.EngridLoader && window.EngridLoader.hasOwnProperty(key)) {
      return window.EngridLoader[key];
    } else if (this.jsElement && this.jsElement.hasAttribute("data-" + key)) {
      return this.jsElement.getAttribute("data-" + key);
    }
    return null;
  }
  private setCssFile(url: string) {
    if (this.cssElement) {
      this.cssElement.setAttribute("href", url);
    } else {
      const link = document.createElement("link");
      link.setAttribute("rel", "stylesheet");
      link.setAttribute("type", "text/css");
      link.setAttribute("media", "all");
      link.setAttribute("href", url);
      document.head.appendChild(link);
    }
  }
  private setJsFile(url: string) {
    const script = document.createElement("script");
    script.setAttribute("src", url);
    document.head.appendChild(script);
  }
}
