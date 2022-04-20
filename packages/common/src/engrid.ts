import { Options } from "./";

export abstract class ENGrid {
  constructor() {
    if (!ENGrid.enForm) {
      throw new Error("Engaging Networks Form Not Found!");
    }
  }

  static get enForm(): HTMLFormElement {
    return document.querySelector("form.en__component") as HTMLFormElement;
  }

  static get debug(): boolean {
    return !!this.getOption("Debug");
  }

  // Return any parameter from the URL
  static getUrlParameter(name: string) {
    const searchParams = new URLSearchParams(window.location.search);
    // Add support for array on the name ending with []
    if (name.endsWith("[]")) {
      let values: Object[] = [];
      searchParams.forEach((value, key) => {
        if (key.startsWith(name.replace("[]", ""))) {
          values.push(new Object({ [key]: value }));
        }
      });
      return values.length > 0 ? values : null;
    }
    if (searchParams.has(name)) {
      return searchParams.get(name) || true;
    }
    return null;
  }
  // Return the field value from its name. It works on any field type.
  // Multiple values (from checkboxes or multi-select) are returned as single string
  // Separated by ,
  static getFieldValue(name: string) {
    return new FormData(this.enForm).getAll(name).join(",");
  }

  // Set a value to any field. If it's a dropdown, radio or checkbox, it selects the proper option matching the value
  static setFieldValue(name: string, value: unknown) {
    (document.getElementsByName(name) as NodeListOf<HTMLFormElement>).forEach(
      (field) => {
        if ("type" in field) {
          switch (field.type) {
            case "select-one":
            case "select-multiple":
              for (const option of field.options) {
                if (option.value == value) {
                  option.selected = true;
                }
              }
              break;
            case "checkbox":
            case "radio":
              // @TODO: Try to trigger the onChange event
              if (field.value == value) {
                field.checked = true;
              }
              break;
            case "textarea":
            case "text":
            default:
              field.value = value;
          }
        }
      }
    );
    this.enParseDependencies();
    return;
  }

  // Create a hidden input field
  static createHiddenInput(name: string, value: string = "") {
    const input = document.createElement("input");
    input.type = "hidden";
    input.name = name;
    input.classList.add("en__field__input");
    input.classList.add("en__field__input--text");
    input.classList.add("engrid-added-input");
    input.value = value;
    ENGrid.enForm.appendChild(input);
    return input;
  }

  // Trigger EN Dependencies
  static enParseDependencies() {
    if (
      window.EngagingNetworks &&
      typeof window.EngagingNetworks?.require?._defined?.enDependencies
        ?.dependencies?.parseDependencies === "function"
    ) {
      window.EngagingNetworks.require._defined.enDependencies.dependencies.parseDependencies(
        window.EngagingNetworks.dependencies
      );
      if (ENGrid.getOption("Debug")) console.trace("EN Dependencies Triggered");
    }
  }

  // Return the status of the gift process (true if a donation has been made, otherwise false)
  static getGiftProcess() {
    if ("pageJson" in window) return window.pageJson.giftProcess;
    return null;
  }

  // Return the page count
  static getPageCount() {
    if ("pageJson" in window) return window.pageJson.pageCount;
    return null;
  }

  // Return the current page number
  static getPageNumber() {
    if ("pageJson" in window) return window.pageJson.pageNumber;
    return null;
  }

  // Return the current page ID
  static getPageID() {
    if ("pageJson" in window) return window.pageJson.campaignPageId;
    return 0;
  }

  // Return the current page type
  static getPageType() {
    if ("pageJson" in window && "pageType" in window.pageJson) {
      switch (window.pageJson.pageType) {
        case "donation":
        case "premiumgift":
          return "DONATION";
          break;
        case "e-card":
          return "ECARD";
          break;
        case "otherdatacapture":
        case "survey":
          return "SURVEY";
          break;
        case "emailtotarget":
          return "EMAILTOTARGET";
          break;
        case "advocacypetition":
          return "ADVOCACY";
          break;
        case "emailsubscribeform":
          return "SUBSCRIBEFORM";
          break;
        case "supporterhub":
          return "SUPPORTERHUB";
          break;
        case "unsubscribe":
          return "UNSUBSCRIBE";
          break;
        default:
          return "UNKNOWN";
      }
    } else {
      return "UNKNOWN";
    }
  }

  // Set body engrid data attributes
  static setBodyData(dataName: string, value: string | boolean) {
    const body = <HTMLBodyElement>document.querySelector("body");
    // If value is boolean
    if (typeof value === "boolean" && value === false) {
      body.removeAttribute(`data-engrid-${dataName}`);
      return;
    }
    body.setAttribute(`data-engrid-${dataName}`, value.toString());
  }

  // Get body engrid data attributes
  static getBodyData(dataName: string) {
    const body = <HTMLBodyElement>document.querySelector("body");
    return body.getAttribute(`data-engrid-${dataName}`);
  }
  // Return the option value
  static getOption<K extends keyof Options>(key: K): Options[K] | null {
    return window.EngridOptions[key] || null;
  }
  // Load an external script
  static loadJS(
    url: string,
    onload: (() => void) | null = null,
    head: boolean = true
  ) {
    const scriptTag = document.createElement("script");
    scriptTag.src = url;
    scriptTag.onload = onload;
    if (head) {
      document.getElementsByTagName("head")[0].appendChild(scriptTag);
      return;
    }
    document.getElementsByTagName("body")[0].appendChild(scriptTag);
    return;
  }
  // Format a number
  static formatNumber(
    number: string | number,
    decimals: number = 2,
    dec_point: string = ".",
    thousands_sep: string = ","
  ) {
    // Strip all characters but numerical ones.
    number = (number + "").replace(/[^0-9+\-Ee.]/g, "");
    const n = !isFinite(+number) ? 0 : +number;
    const prec = !isFinite(+decimals) ? 0 : Math.abs(decimals);
    const sep = typeof thousands_sep === "undefined" ? "," : thousands_sep;
    const dec = typeof dec_point === "undefined" ? "." : dec_point;
    let s = [];
    const toFixedFix = function (n: number, prec: number) {
      const k = Math.pow(10, prec);
      return "" + Math.round(n * k) / k;
    };
    // Fix for IE parseFloat(0.55).toFixed(0) = 0;
    s = (prec ? toFixedFix(n, prec) : "" + Math.round(n)).split(".");
    if (s[0].length > 3) {
      s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
    }
    if ((s[1] || "").length < prec) {
      s[1] = s[1] || "";
      s[1] += new Array(prec - s[1].length + 1).join("0");
    }
    return s.join(dec);
  }
  static disableSubmit(label: string = "") {
    const submit = document.querySelector(
      ".en__submit button"
    ) as HTMLButtonElement;
    submit.dataset.originalText = submit.innerText;
    let submitButtonProcessingHTML =
      "<span class='loader-wrapper'><span class='loader loader-quart'></span><span class='submit-button-text-wrapper'>" +
      label +
      "</span></span>";
    if (submit) {
      submit.disabled = true;
      submit.innerHTML = submitButtonProcessingHTML;
      return true;
    }
    return false;
  }
  static enableSubmit() {
    const submit = document.querySelector(
      ".en__submit button"
    ) as HTMLButtonElement;
    if (submit.dataset.originalText) {
      submit.disabled = false;
      submit.innerText = submit.dataset.originalText;
      delete submit.dataset.originalText;
      return true;
    }
    return false;
  }
  static formatDate(date: Date, format: string = "MM/DD/YYYY") {
    const dateAray = date
      .toLocaleDateString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      })
      .split("/");
    const dateString = format
      .replace(/YYYY/g, dateAray[2])
      .replace(/MM/g, dateAray[0])
      .replace(/DD/g, dateAray[1])
      .replace(/YY/g, dateAray[2].substr(2, 2));
    return dateString;
  }
  /**
   * Check if the provided object has ALL the provided properties
   * Example: checkNested(EngagingNetworks, 'require', '_defined', 'enjs', 'checkSubmissionFailed')
   * will return true if EngagingNetworks.require._defined.enjs.checkSubmissionFailed is defined
   */
  static checkNested(obj: any, ...args: string[]) {
    for (let i = 0; i < args.length; i++) {
      if (!obj || !obj.hasOwnProperty(args[i])) {
        return false;
      }
      obj = obj[args[i]];
    }
    return true;
  }
  static setError(querySelector: string, errorMessage: string) {
    const errorElement = document.querySelector(querySelector);
    if (errorElement) {
      errorElement.classList.add("en__field--validationFailed");
      let errorMessageElement = errorElement.querySelector(".en__field__error");
      if (!errorMessageElement) {
        errorMessageElement = document.createElement("div");
        errorMessageElement.classList.add("en__field__error");
        errorMessageElement.innerHTML = errorMessage;
        errorElement.insertBefore(errorMessageElement, errorElement.firstChild);
      } else {
        errorMessageElement.innerHTML = errorMessage;
      }
    }
  }
  static removeError(querySelector: string) {
    const errorElement = document.querySelector(querySelector);
    if (errorElement) {
      errorElement.classList.remove("en__field--validationFailed");
      const errorMessageElement =
        errorElement.querySelector(".en__field__error");
      if (errorMessageElement) {
        errorElement.removeChild(errorMessageElement);
      }
    }
  }
}
