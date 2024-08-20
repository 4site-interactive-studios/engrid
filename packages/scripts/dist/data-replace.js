// This script is used to replace merge tags in the EN Blocks of the page.
// It searches for HTML elements containing the data to be replaced and replaces it.
// The data to be replaced is passed as URL parameters, example: ?engrid_data[key]=value.
// The merge tag, if found, is replaced with the value from the URL parameter.
// If no value is found, the default value is used.
// The default value is the value inside the merge tag, example: {engrid_data~key~default}.
// If no default value is set, an empty string is used.
import { ENGrid, EngridLogger } from "./";
export class DataReplace {
    constructor() {
        this.logger = new EngridLogger("DataReplace", "#333333", "#00f3ff", "⤵️");
        this.enElements = new Array();
        this.searchElements();
        if (!this.shouldRun())
            return;
        this.logger.log("Elements Found:", this.enElements);
        this.replaceAll();
    }
    /**
     * Searches for HTML elements containing the data to be replaced.
     */
    searchElements() {
        const enElements = document.querySelectorAll(`
      .en__component--copyblock,
      .en__component--codeblock,
      .en__field
      `);
        if (enElements.length > 0) {
            enElements.forEach((item) => {
                if (item instanceof HTMLElement &&
                    item.innerHTML.includes("{engrid_data~")) {
                    this.enElements.push(item);
                }
            });
        }
    }
    /**
     * Checks if there are elements to be replaced.
     * @returns True if there are elements to be replaced, false otherwise.
     */
    shouldRun() {
        return this.enElements.length > 0;
    }
    /**
     * Replaces all occurrences of data in the HTML elements.
     */
    replaceAll() {
        const regEx = /{engrid_data~\[([\w-]+)\]~?\[?(.+?)?\]?}/g;
        this.enElements.forEach((item) => {
            const array = item.innerHTML.matchAll(regEx);
            for (const match of array) {
                this.replaceItem(item, match);
            }
        });
        ENGrid.setBodyData("merge-tags-processed", "");
    }
    /**
     * Replaces a specific data item in the given HTML element.
     * @param where The HTML element where the replacement should occur.
     * @param item The matched data item.
     * @param key The key of the data item.
     * @param defaultValue The default value to use if the data item is not found.
     */
    replaceItem(where, [item, key, defaultValue]) {
        var _a;
        let value = (_a = ENGrid.getUrlParameter(`engrid_data[${key}]`)) !== null && _a !== void 0 ? _a : defaultValue;
        if (typeof value === "string") {
            value = value.replace(/\r?\\n|\n|\r/g, "<br>");
        }
        else {
            value = "";
        }
        this.logger.log("Replacing", key, value);
        where.innerHTML = where.innerHTML.replace(item, value);
    }
}
