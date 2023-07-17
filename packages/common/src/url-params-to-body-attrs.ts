//This component adds any url parameters that begin with "data-engrid-" to the body as attributes.
import { ENGrid, EngridLogger } from "./";

export class UrlParamsToBodyAttrs {
  private logger: EngridLogger = new EngridLogger(
    "UrlParamsToBodyAttrs",
    "white",
    "magenta",
    "📌"
  );

  private urlParams: URLSearchParams;

  constructor() {
    this.urlParams = new URLSearchParams(document.location.search);

    this.urlParams.forEach((value, key) => {
      if (key.startsWith("data-engrid-")) {
        ENGrid.setBodyData(key.split("data-engrid-")[1], value);
        this.logger.log(`Set "${key}" on body to "${value}" from URL params`);
      }
    });
  }
}
