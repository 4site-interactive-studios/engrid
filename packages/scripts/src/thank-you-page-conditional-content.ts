import { ENGrid, EngridLogger } from ".";

interface ShowHideRadioCheckboxesStateItem {
  page: number;
  class: string;
  value: string;
}

export class ThankYouPageConditionalContent {
  private logger: EngridLogger = new EngridLogger(
    "ThankYouPageConditionalContent"
  );

  constructor() {
    if (!this.shouldRun()) return;

    this.applyShowHideRadioCheckboxesState();
  }

  getShowHideRadioCheckboxesState() {
    try {
      const plainState =
        window.sessionStorage.getItem(`engrid_ShowHideRadioCheckboxesState`) ??
        "";
      return JSON.parse(plainState);
    } catch (err) {
      return [];
    }
  }

  applyShowHideRadioCheckboxesState() {
    const state = this.getShowHideRadioCheckboxesState();

    if (state) {
      state.forEach((item: ShowHideRadioCheckboxesStateItem) => {
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

  private shouldRun() {
    return ENGrid.getGiftProcess();
  }
}
