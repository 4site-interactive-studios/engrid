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
                    const inputValue = item.value.replace(/\W/g, "");
                    const classPrefix = CSS.escape(item.class);
                    const selectedClass = CSS.escape(`${item.class}${inputValue}`);
                    document
                        .querySelectorAll(`[class*="${classPrefix}"]`)
                        .forEach((el) => {
                        el.classList.add("hide");
                    });
                    document
                        .querySelectorAll(`.${selectedClass}`)
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
