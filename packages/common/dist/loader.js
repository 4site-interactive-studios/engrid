// Ref: https://app.getguru.com/card/iMgx968T/ENgrid-Loader
import { ENGrid, EngridLogger } from ".";
export class Loader {
    constructor() {
        this.logger = new EngridLogger("Loader", "gold", "black", "🔁");
        this.cssElement = document.querySelector('link[href*="engrid."][rel="stylesheet"]');
        this.jsElement = document.querySelector('script[src*="engrid."]');
    }
    // Returns true if ENgrid should reload (that means the current ENgrid is not the right one)
    // Returns false if ENgrid should not reload (that means the current ENgrid is the right one)
    reload() {
        var _a, _b, _c;
        const assets = this.getOption("assets");
        const isLoaded = ENGrid.getBodyData("loaded");
        let shouldSkipCss = this.getOption("engridcss") === "false";
        let shouldSkipJs = this.getOption("engridjs") === "false";
        if (isLoaded || !assets) {
            if (shouldSkipCss && this.cssElement) {
                this.logger.log("engridcss=false | Removing original stylesheet:", this.cssElement);
                this.cssElement.remove();
            }
            if (shouldSkipJs && this.jsElement) {
                this.logger.log("engridjs=false | Removing original script:", this.jsElement);
                this.jsElement.remove();
            }
            if (shouldSkipCss) {
                this.logger.log("engridcss=false | adding top banner CSS");
                this.addENgridCSSUnloadedCSS();
            }
            if (shouldSkipJs) {
                this.logger.log("engridjs=false | Skipping JS load.");
                this.logger.success("LOADED");
                return true;
            }
            this.logger.success("LOADED");
            return false;
        }
        // Load the right ENgrid
        this.logger.log("RELOADING");
        ENGrid.setBodyData("loaded", "true"); // Set the loaded flag, so the next time we don't reload
        // Fetch the desired repo, assets location, and override JS/CSS
        const theme = ENGrid.getBodyData("theme");
        const engrid_repo = (_a = this.getOption("repo-name")) !== null && _a !== void 0 ? _a : `engrid-${theme}`;
        let engrid_js_url = "";
        let engrid_css_url = "";
        switch (assets) {
            case "local":
                this.logger.log("LOADING LOCAL");
                ENGrid.setBodyData("assets", "local");
                engrid_js_url = `https://${engrid_repo}.test/dist/engrid.js`;
                engrid_css_url = `https://${engrid_repo}.test/dist/engrid.css`;
                break;
            case "flush":
                this.logger.log("FLUSHING CACHE");
                const timestamp = Date.now();
                const jsCurrentURL = new URL(((_b = this.jsElement) === null || _b === void 0 ? void 0 : _b.getAttribute("src")) || "");
                jsCurrentURL.searchParams.set("v", timestamp.toString());
                engrid_js_url = jsCurrentURL.toString();
                const cssCurrentURL = new URL(((_c = this.cssElement) === null || _c === void 0 ? void 0 : _c.getAttribute("href")) || "");
                cssCurrentURL.searchParams.set("v", timestamp.toString());
                engrid_css_url = cssCurrentURL.toString();
                break;
            default:
                this.logger.log("LOADING EXTERNAL");
                engrid_js_url = `https://s3.amazonaws.com/engrid-dev.4sitestudios.com/${engrid_repo}/${assets}/engrid.js`;
                engrid_css_url = `https://s3.amazonaws.com/engrid-dev.4sitestudios.com/${engrid_repo}/${assets}/engrid.css`;
        }
        if (shouldSkipCss && this.cssElement) {
            this.logger.log("engridcss=false | Removing original stylesheet:", this.cssElement);
            this.cssElement.remove();
        }
        if (shouldSkipCss && engrid_css_url && engrid_css_url !== "") {
            this.logger.log("engridcss=false | Skipping injection of stylesheet:", engrid_css_url);
        }
        if (shouldSkipCss) {
            this.logger.log("engridcss=false | adding top banner CSS");
            this.addENgridCSSUnloadedCSS();
        }
        else {
            this.setCssFile(engrid_css_url);
        }
        if (shouldSkipJs && this.jsElement) {
            this.logger.log("engridjs=false | Removing original script:", this.jsElement);
            this.jsElement.remove();
        }
        if (shouldSkipJs && engrid_js_url && engrid_js_url !== "") {
            this.logger.log("engridjs=false | Skipping injection of script:", engrid_js_url);
        }
        if (!shouldSkipJs) {
            this.setJsFile(engrid_js_url);
        }
        // If custom assets aren't defined, we don't need to reload.
        if (!assets) {
            return false;
        }
        return true;
    }
    getOption(key) {
        const urlParam = ENGrid.getUrlParameter(key);
        if (urlParam && ["assets", "engridcss", "engridjs"].includes(key)) {
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
        if (url === "") {
            return;
        }
        if (this.cssElement) {
            this.logger.log("Replacing stylesheet:", url);
            this.cssElement.setAttribute("href", url);
        }
        else {
            this.logger.log("Injecting stylesheet:", url);
            const link = document.createElement("link");
            link.setAttribute("rel", "stylesheet");
            link.setAttribute("type", "text/css");
            link.setAttribute("media", "all");
            link.setAttribute("href", url);
            document.head.appendChild(link);
        }
    }
    setJsFile(url) {
        if (url === "") {
            return;
        }
        this.logger.log("Injecting script:", url);
        const script = document.createElement("script");
        script.setAttribute("src", url);
        document.head.appendChild(script);
    }
    addENgridCSSUnloadedCSS() {
        document.body.insertAdjacentHTML("beforeend", `<style>
        html,
        body {
            background-color: #ffffff;
        }

        body {
            opacity: 1;
            margin: 0;
        }

        body:before {
            content: "ENGRID CSS UNLOADED";
            display: flex;
            justify-content: center;
            align-items: center;
            width: 100%;
            background-color: #ffff00;
            padding: 1rem;
            margin-bottom: 1rem;
            font-family: sans-serif;
            font-weight: 600;
        }

        .en__component--advrow {
            flex-direction: column;
            max-width: 600px;
            margin: 0 auto;
        }

        .en__component--advrow * {
            max-width: 100%;
            height: auto;
        }
      </style>`);
    }
}
