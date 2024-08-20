import { ENGrid, EngridLogger } from ".";
export class ThankYouPageConditionalContent {
    constructor() {
        this.logger = new EngridLogger("ThankYouPageConditionalContent");
        if (!this.shouldRun())
            return;
        this.applyShowHideRadioCheckboxesState();
    }
    getShowHideRadioCheckboxesState() {
        var _a;
        try {
            const plainState = (_a = window.sessionStorage.getItem(`engrid_ShowHideRadioCheckboxesState`)) !== null && _a !== void 0 ? _a : "";
            return JSON.parse(plainState);
        }
        catch (err) {
            return [];
        }
    }
    applyShowHideRadioCheckboxesState() {
        const state = this.getShowHideRadioCheckboxesState();
        if (state) {
            state.forEach((item) => {
                this.logger.log("Processing TY page conditional content item:", item);
                if (ENGrid.getPageID() === item.page) {
                    document
                        .querySelectorAll(`[class*="${item.class}"]`)
                        .forEach((el) => {
                        el.classList.add("hide");
                    });
                    document
                        .querySelectorAll(`.${item.class}${item.value}`)
                        .forEach((el) => {
                        el.classList.remove("hide");
                    });
                }
            });
        }
        this.deleteShowHideRadioCheckboxesState();
    }
    deleteShowHideRadioCheckboxesState() {
        window.sessionStorage.removeItem(`engrid_ShowHideRadioCheckboxesState`);
    }
    shouldRun() {
        return ENGrid.getGiftProcess();
    }
}
