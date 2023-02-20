import { ENGrid, EngridLogger } from "./";
export class Ticker {
    constructor() {
        this.shuffleSeed = require("shuffle-seed");
        this.items = [];
        this.tickerElement = document.querySelector(".engrid-ticker");
        this.logger = new EngridLogger("Ticker", "black", "beige", "🔁");
        if (!this.shouldRun()) {
            this.logger.log("Not running");
            // If we don't find a ticker, get out
            return;
        }
        const tickerList = document.querySelectorAll(".engrid-ticker li");
        if (tickerList.length > 0) {
            for (let i = 0; i < tickerList.length; i++) {
                this.items.push(tickerList[i].innerText);
            }
        }
        this.render();
        return;
    }
    // Should we run the script?
    shouldRun() {
        return this.tickerElement !== null;
    }
    getSeed() {
        return new Date().getDate() + ENGrid.getPageID();
    }
    // Get Items
    getItems() {
        const total = this.tickerElement.getAttribute("data-total") || "50";
        this.logger.log("Getting " + total + " items");
        const seed = this.getSeed();
        const items = this.shuffleSeed.shuffle(this.items, seed);
        const now = new Date();
        const hour = now.getHours();
        const minute = now.getMinutes();
        let pointer = Math.round((hour * 60 + minute) / 5);
        if (pointer >= items.length) {
            pointer = 0;
        }
        const ret = items.slice(pointer, pointer + total).reverse();
        return ret;
    }
    // Render
    render() {
        var _a, _b, _c;
        this.logger.log("Rendering");
        const items = this.getItems();
        let ticker = document.createElement("div");
        ticker.classList.add("en__component");
        ticker.classList.add("en__component--ticker");
        let str = `<div class="ticker">`;
        for (let i = 0; i < items.length; i++) {
            str += '<div class="ticker__item">' + items[i] + "</div>";
        }
        str = '<div id="engrid-ticker">' + str + "</div></div>";
        ticker.innerHTML = str;
        (_b = (_a = this.tickerElement) === null || _a === void 0 ? void 0 : _a.parentElement) === null || _b === void 0 ? void 0 : _b.insertBefore(ticker, this.tickerElement);
        (_c = this.tickerElement) === null || _c === void 0 ? void 0 : _c.remove();
        const tickerWidth = document.querySelector(".ticker").offsetWidth.toString();
        ticker.style.setProperty("--ticker-size", tickerWidth);
        this.logger.log("Ticker Size: " + ticker.style.getPropertyValue("--ticker-size"));
        this.logger.log("Ticker Width: " + tickerWidth);
    }
}
