import { ENGrid, EngridLogger } from "./";

export class DataReplace {
  private logger: EngridLogger = new EngridLogger(
    "DataReplace",
    "#333333",
    "#00f3ff",
    "⤵️"
  );
  private enElements: Array<HTMLElement> = new Array<HTMLElement>();
  constructor() {
    this.logger.log("Constructor");
    this.searchElements();
    if (!this.shouldRun()) {
      this.logger.error("No Elements Found");
      return;
    }
    this.replaceAll();
  }
  searchElements() {
    const enElements = document.querySelectorAll(
      ".en__component--copyblock, .en__field"
    );
    if (enElements.length > 0) {
      enElements.forEach((item) => {
        if (
          item instanceof HTMLElement &&
          item.innerHTML.includes("{engrid_data~")
        ) {
          this.enElements.push(item);
        }
      });
    }
  }
  shouldRun() {
    this.logger.log("Elements Found:", this.enElements);
    return this.enElements.length > 0;
  }
  replaceAll() {
    const regEx = /{engrid_data~\[([\w-]+)\]~?\[?(.+?)?\]?}/g;
    this.enElements.forEach((item) => {
      const array = item.innerHTML.matchAll(regEx);
      for (const match of array) {
        this.replaceItem(item, match);
      }
    });
  }
  replaceItem(where: HTMLElement, [item, key, defaultValue]: RegExpMatchArray) {
    let value = ENGrid.getUrlParameter(`engrid_data[${key}]`) ?? defaultValue;
    if (typeof value === "string") {
      value = value.replace(/\r?\\n|\n|\r/g, "<br>");
    } else {
      value = "";
    }
    this.logger.log("Replacing", key, value);
    where.innerHTML = where.innerHTML.replace(item, value);
  }
}
