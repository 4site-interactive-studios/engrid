/*+
  The class is used to set body attributes via click handlers.
  The format is "setattr--{attribute}--{value}".
  e.g. setattr--data-engrid-hide-fast-address-details--true
 */

import { ENGrid, EngridLogger } from "./";

export class SetAttr {
  private logger: EngridLogger = new EngridLogger(
    "SetAttr",
    "black",
    "yellow",
    "📌"
  );

  constructor() {
    const enGrid = document.getElementById("engrid");

    if (enGrid) {
      enGrid.addEventListener("click", (e) => {
        const clickedEl = e.target as HTMLElement | SVGElement;
        if (typeof clickedEl.className !== "string") {
          return;
        }
        const clickedElClassNames = clickedEl.className.split(" ");

        if (
          clickedElClassNames.some((className) =>
            className.startsWith("setattr--")
          )
        ) {
          clickedEl.classList.forEach((className) => {
            //Check element has class with format "setattr--attribute--value"
            const match = className.match(/^setattr--(.+)--(.+)$/i);
            if (match && match[1] && match[2]) {
              this.logger.log(
                `Clicked element with class "${className}". Setting body attribute "${match[1]}" to "${match[2]}"`
              );
              ENGrid.setBodyData(
                match[1].replace("data-engrid-", ""),
                match[2]
              );
            }
          });
        }
      });
    }
  }
}
