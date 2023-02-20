import { ENGrid, EngridLogger } from "./";
export class DataHide {
    constructor() {
        this.logger = new EngridLogger("DataHide", "#333333", "#f0f0f0", "🙈");
        this.enElements = new Array();
        this.logger.log("Constructor");
        this.enElements = ENGrid.getUrlParameter("engrid_hide[]");
        if (!this.enElements || this.enElements.length === 0) {
            this.logger.log("No Elements Found");
            return;
        }
        this.logger.log("Elements Found:", this.enElements);
        this.hideAll();
    }
    hideAll() {
        this.enElements.forEach((element) => {
            const item = Object.keys(element)[0];
            const type = Object.values(element)[0];
            this.hideItem(item, type);
        });
        return;
    }
    hideItem(item, type) {
        const regEx = /engrid_hide\[([\w-]+)\]/g;
        const itemData = [...item.matchAll(regEx)].map((match) => match[1])[0];
        switch (type) {
            case "id":
                const element = document.getElementById(itemData);
                if (element) {
                    this.logger.log("Hiding By ID", itemData, element);
                    element.setAttribute("hidden-via-url-argument", "");
                }
                else {
                    this.logger.error("Element Not Found By ID", itemData);
                }
                break;
            case "class":
            default:
                const elements = document.getElementsByClassName(itemData);
                if (elements.length > 0) {
                    for (let i = 0; i < elements.length; i++) {
                        this.logger.log("Hiding By Class", itemData, elements[i]);
                        elements[i].setAttribute("hidden-via-url-argument", "");
                    }
                }
                else {
                    this.logger.log("No Elements Found By Class", itemData);
                }
                break;
        }
    }
}
