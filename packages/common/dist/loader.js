// Ref: https://app.getguru.com/card/iMgx968T/ENgrid-Loader
import { ENGrid, EngridLogger } from ".";
export class Loader {
    constructor() {
        this.logger = new EngridLogger("Logger", "gold", "black", "🔁");
        this.cssElement = document.querySelector('link[href*="engrid."][rel="stylesheet"]');
        this.jsElement = document.querySelector('script[src*="engrid."]');
    }
    // Returns true if ENgrid should reload (that means the current ENgrid is not the right one)
    // Returns false if ENgrid should not reload (that means the current ENgrid is the right one)
    reload() {
        var _a, _b, _c;
        const isLoaded = ENGrid.getBodyData("loaded");
        let assets = this.getOption("assets");
        if (isLoaded || !assets) {
            this.logger.success("ENgrid Loader: LOADED");
            return false;
        }
        // Load the right ENgrid
        this.logger.log("ENgrid Loader: RELOADING");
        ENGrid.setBodyData("loaded", "true"); // Set the loaded flag, so the next time we don't reload
        // Fetch the desired repo, assets location, and override JS/CSS
        const engrid_repo = this.getOption("repo-name");
        const engrid_repo_owner = this.getOption("repo-owner");
        let engrid_js_url = "";
        let engrid_css_url = "";
        switch (assets) {
            case "local":
                this.logger.log("ENgrid Loader: LOADING LOCAL");
                // Find a way to guess local URL if there's no engrid_repo
                if (!engrid_repo) {
                    const theme = ENGrid.getBodyData("theme");
                    engrid_js_url = `https://engrid-${theme}.test/dist/engrid.js`;
                    engrid_css_url = `https://engrid-${theme}.test/dist/engrid.css`;
                }
                else {
                    engrid_js_url = `https://engrid-${engrid_repo}.test/dist/engrid.js`;
                    engrid_css_url = `https://engrid-${engrid_repo}.test/dist/engrid.css`;
                }
                break;
            case "flush":
                this.logger.log("ENgrid Loader: FLUSHING CACHE");
                const timestamp = Date.now();
                const jsCurrentURL = new URL(((_a = this.jsElement) === null || _a === void 0 ? void 0 : _a.getAttribute("src")) || "");
                jsCurrentURL.searchParams.set("v", timestamp.toString());
                engrid_js_url = jsCurrentURL.toString();
                const cssCurrentURL = new URL(((_b = this.cssElement) === null || _b === void 0 ? void 0 : _b.getAttribute("href")) || "");
                cssCurrentURL.searchParams.set("v", timestamp.toString());
                engrid_css_url = cssCurrentURL.toString();
                break;
            default:
                this.logger.log("ENgrid Loader: LOADING EXTERNAL");
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
        (_c = this.jsElement) === null || _c === void 0 ? void 0 : _c.remove();
        return true;
    }
    getOption(key) {
        const urlParam = ENGrid.getUrlParameter(key);
        // Only "assets" can be set in URL
        if (urlParam && key === "assets") {
            return urlParam;
        }
        else if (window.EngridLoader && window.EngridLoader.hasOwnProperty(key)) {
            return window.EngridLoader[key];
        }
        else if (this.jsElement && this.jsElement.hasAttribute("data-" + key)) {
            return this.jsElement.getAttribute("data-" + key);
        }
        return null;
    }
    setCssFile(url) {
        if (this.cssElement) {
            this.cssElement.setAttribute("href", url);
        }
        else {
            const link = document.createElement("link");
            link.setAttribute("rel", "stylesheet");
            link.setAttribute("type", "text/css");
            link.setAttribute("media", "all");
            link.setAttribute("href", url);
            document.head.appendChild(link);
        }
    }
    setJsFile(url) {
        const script = document.createElement("script");
        script.setAttribute("src", url);
        document.head.appendChild(script);
    }
}
