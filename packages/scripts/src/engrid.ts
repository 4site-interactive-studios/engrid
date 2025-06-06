import { Options } from ".";

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

  static get demo(): boolean {
    return this.getUrlParameter("mode") === "DEMO";
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
  static getField(name: string) {
    // Get the field by name
    return document.querySelector(`[name="${name}"]`);
  }
  // Return the field value from its name. It works on any field type.
  // Multiple values (from checkboxes or multi-select) are returned as single string
  // Separated by ,
  static getFieldValue(name: string) {
    return new FormData(this.enForm).getAll(name).join(",");
  }

  // Set a value to any field. If it's a dropdown, radio or checkbox, it selects the proper option matching the value
  static setFieldValue(
    name: string,
    value: unknown,
    parseENDependencies: boolean = true,
    dispatchEvents: boolean = false
  ) {
    if (value === ENGrid.getFieldValue(name)) return;
    (document.getElementsByName(name) as NodeListOf<HTMLFormElement>).forEach(
      (field) => {
        if ("type" in field) {
          switch (field.type) {
            case "select-one":
            case "select-multiple":
              for (const option of field.options) {
                if (option.value == value) {
                  option.selected = true;
                  if (dispatchEvents) {
                    field.dispatchEvent(new Event("change", { bubbles: true }));
                  }
                }
              }
              break;
            case "checkbox":
            case "radio":
              if (field.value == value) {
                field.checked = true;
                if (dispatchEvents) {
                  field.dispatchEvent(new Event("change", { bubbles: true }));
                }
              }
              break;
            case "textarea":
            case "text":
            default:
              field.value = value;
              if (dispatchEvents) {
                field.dispatchEvent(new Event("change", { bubbles: true }));
                field.dispatchEvent(new Event("blur", { bubbles: true }));
              }
          }
          field.setAttribute("engrid-value-changed", "");
        }
      }
    );
    if (parseENDependencies) this.enParseDependencies();
    return;
  }

  // Create a hidden input field
  static createHiddenInput(name: string, value: string = "") {
    const formBlock = document.createElement("div");
    formBlock.classList.add(
      "en__component",
      "en__component--formblock",
      "hide"
    );

    const textField = document.createElement("div");
    textField.classList.add("en__field", "en__field--text");

    const textElement = document.createElement("div");
    textElement.classList.add("en__field__element", "en__field__element--text");

    const inputField = document.createElement("input");
    inputField.classList.add(
      "en__field__input",
      "en__field__input--text",
      "engrid-added-input"
    );
    inputField.setAttribute("name", name);
    inputField.setAttribute("type", "hidden");
    inputField.setAttribute("value", value);

    textElement.appendChild(inputField);
    textField.appendChild(textElement);
    formBlock.appendChild(textField);
    const submitElement = document.querySelector(
      ".en__submit"
    ) as HTMLDivElement;
    if (submitElement) {
      const lastFormComponent = submitElement.closest(".en__component");
      if (lastFormComponent) {
        // Insert the new field after the submit button
        lastFormComponent.parentNode?.insertBefore(
          formBlock,
          lastFormComponent.nextSibling
        );
      }
    } else {
      ENGrid.enForm.appendChild(formBlock);
    }
    return inputField;
  }

  // Trigger EN Dependencies
  static enParseDependencies() {
    if (
      window.EngagingNetworks &&
      typeof window.EngagingNetworks?.require?._defined?.enDependencies
        ?.dependencies?.parseDependencies === "function"
    ) {
      const customDependencies: object[] = [];
      if ("dependencies" in window.EngagingNetworks) {
        const amountContainer = document.querySelector(
          ".en__field--donationAmt"
        );
        if (amountContainer) {
          let amountID =
            [...amountContainer.classList.values()]
              .filter(
                (v) =>
                  v.startsWith("en__field--") && Number(v.substring(11)) > 0
              )
              .toString()
              .match(/\d/g)
              ?.join("") || "";
          if (amountID) {
            window.EngagingNetworks.dependencies.forEach(
              (dependency: {
                [key: string]: {
                  [key: string]: string;
                }[];
              }) => {
                if ("actions" in dependency && dependency.actions.length > 0) {
                  let amountIdFound = false;
                  dependency.actions.forEach((action) => {
                    if ("target" in action && action.target == amountID) {
                      amountIdFound = true;
                    }
                  });
                  if (!amountIdFound) {
                    customDependencies.push(dependency);
                  }
                }
              }
            );
            if (customDependencies.length > 0) {
              window.EngagingNetworks.require._defined.enDependencies.dependencies.parseDependencies(
                customDependencies
              );
              if (ENGrid.getOption("Debug"))
                console.log("EN Dependencies Triggered", customDependencies);
            }
          }
        }
      }
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

  static isThankYouPage() {
    return this.getPageNumber() === this.getPageCount();
  }

  // Return the current page ID
  static getPageID() {
    if ("pageJson" in window) return window.pageJson.campaignPageId;
    return 0;
  }

  // Return the client ID
  static getClientID() {
    if ("pageJson" in window) return window.pageJson.clientId;
    return 0;
  }

  //returns 'us or 'ca' based on the client ID
  static getDataCenter() {
    return ENGrid.getClientID() >= 10000 ? "us" : "ca";
  }

  // Return the current page type
  static getPageType() {
    if ("pageJson" in window && "pageType" in window.pageJson) {
      switch (window.pageJson.pageType) {
        case "p2pcheckout":
        case "p2pdonation":
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
        case "event":
          return "EVENT";
          break;
        case "supporterhub":
          return "SUPPORTERHUB";
          break;
        case "unsubscribe":
          return "UNSUBSCRIBE";
          break;
        case "tweetpage":
          return "TWEETPAGE";
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
  // Check if body has engrid data attributes
  static hasBodyData(dataName: string) {
    const body = <HTMLBodyElement>document.querySelector("body");
    return body.hasAttribute(`data-engrid-${dataName}`);
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
      document.head.appendChild(scriptTag);
      return;
    }
    document.body.appendChild(scriptTag);
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
  // Clean an Amount
  static cleanAmount(amount: string): number {
    // Split the number
    const valueArray = amount.replace(/[^0-9,\.]/g, "").split(/[,.]+/);
    const delimArray = amount.replace(/[^.,]/g, "").split("");
    // Handle values with no decimal places and non-numeric values
    if (valueArray.length === 1) {
      return parseInt(valueArray[0]) || 0;
    }
    // Ignore invalid numbers
    if (
      valueArray
        .map((x, index) => {
          return index > 0 && index + 1 !== valueArray.length && x.length !== 3
            ? true
            : false;
        })
        .includes(true)
    ) {
      return 0;
    }
    // Multiple commas is a bad thing? So edgy.
    if (delimArray.length > 1 && !delimArray.includes(".")) {
      return 0;
    }
    // Handle invalid decimal and comma formatting
    if ([...new Set(delimArray.slice(0, -1))].length > 1) {
      return 0;
    }
    // If there are cents
    if (valueArray[valueArray.length - 1].length <= 2) {
      const cents = valueArray.pop() || "00";
      return parseInt(cents) > 0
        ? parseFloat(
            Number(parseInt(valueArray.join("")) + "." + cents).toFixed(2)
          )
        : parseInt(valueArray.join(""));
    }
    return parseInt(valueArray.join(""));
  }
  static disableSubmit(label: string = "") {
    const submit = document.querySelector(
      ".en__submit button"
    ) as HTMLButtonElement;
    if (!submit) return false;
    let submitButtonProcessingHTML = `<span class='loader-wrapper'><span class='loader loader-quart'></span><span class='submit-button-text-wrapper'>${label}</span></span>`;
    if (submit.innerHTML.includes("loader-wrapper")) {
      // If we are already processing, don't override the originalText again
      return false;
    }
    submit.dataset.originalText = submit.innerHTML;
    submit.disabled = true;
    submit.innerHTML = submitButtonProcessingHTML;
    return true;
  }
  static enableSubmit() {
    const submit = document.querySelector(
      ".en__submit button"
    ) as HTMLButtonElement;
    if (!submit) return false;
    if (submit.dataset.originalText) {
      submit.disabled = false;
      submit.innerHTML = submit.dataset.originalText;
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

  // Deep merge two objects
  static deepMerge(target: any, source: any) {
    for (const key in source) {
      if (source[key] instanceof Object)
        Object.assign(source[key], ENGrid.deepMerge(target[key], source[key]));
    }
    Object.assign(target || {}, source);
    return target;
  }
  static setError(element: string | HTMLElement, errorMessage: string) {
    const errorElement =
      typeof element === "string" ? document.querySelector(element) : element;
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
  static removeError(element: string | HTMLElement) {
    const errorElement =
      typeof element === "string" ? document.querySelector(element) : element;
    if (errorElement) {
      errorElement.classList.remove("en__field--validationFailed");
      const errorMessageElement =
        errorElement.querySelector(".en__field__error");
      if (errorMessageElement) {
        errorElement.removeChild(errorMessageElement);
      }
    }
  }
  static isVisible(element: HTMLElement): boolean {
    if (!element) {
      return false;
    }
    return !!(
      element.offsetWidth ||
      element.offsetHeight ||
      element.getClientRects().length
    );
  }
  static getCurrencySymbol(): string {
    const currencyField = ENGrid.getField(
      "transaction.paycurrency"
    ) as HTMLSelectElement;
    if (currencyField) {
      // Check if the selected currency field option have a data-currency-symbol attribute
      const selectedOption =
        currencyField.tagName === "SELECT"
          ? currencyField.options[currencyField.selectedIndex]
          : currencyField;
      if (selectedOption.dataset.currencySymbol) {
        return selectedOption.dataset.currencySymbol;
      }
      const currencyArray = {
        USD: "$",
        EUR: "€",
        GBP: "£",
        AUD: "$",
        CAD: "$",
        JPY: "¥",
      };
      return (currencyArray as any)[currencyField.value] || "$";
    }
    return ENGrid.getOption("CurrencySymbol") || "$";
  }
  static getCurrencyCode(): string {
    const currencyField = ENGrid.getField(
      "transaction.paycurrency"
    ) as HTMLSelectElement;
    if (currencyField) {
      return currencyField.value || "USD";
    }
    return ENGrid.getOption("CurrencyCode") || "USD";
  }
  static addHtml(
    html: string | HTMLElement,
    target: string = "body",
    position: string = "before"
  ) {
    const targetElement = document.querySelector(target);
    if (typeof html === "object") {
      html = html.outerHTML;
    }
    if (targetElement) {
      const htmlElement = document.createRange().createContextualFragment(html);
      if (position === "before") {
        targetElement.parentNode?.insertBefore(htmlElement, targetElement);
      } else {
        targetElement.parentNode?.insertBefore(
          htmlElement,
          targetElement.nextSibling
        );
      }
    }
  }
  static removeHtml(target: string) {
    const targetElement = document.querySelector(target);
    if (targetElement) {
      targetElement.remove();
    }
  }
  static slugify(text: string) {
    return text
      .toString()
      .toLowerCase()
      .replace(/\s+/g, "-") // Replace spaces with -
      .replace(/[^\w\-]+/g, "") // Remove all non-word chars
      .replace(/\-\-+/g, "-") // Replace multiple - with single -
      .replace(/^-+/, "") // Trim - from start of text
      .replace(/-+$/, ""); // Trim - from end of text
  }
  // This function is used to run a callback function when an error is displayed on the page
  static watchForError(callback: Function) {
    const errorElement = document.querySelector(
      ".en__errorList"
    ) as HTMLUListElement;
    const capitalize = (word: string) =>
      word.charAt(0).toUpperCase() + word.slice(1);
    // Avoid duplicate callbacks
    let callbackType = callback.toString();
    if (callbackType.indexOf("function") === 0) {
      callbackType = callbackType.replace("function ", "");
    }
    if (callbackType.indexOf("(") > 0) {
      callbackType = callbackType.substring(0, callbackType.indexOf("("));
    }
    // Remove invalid characters
    callbackType = callbackType.replace(/[^a-zA-Z0-9]/g, "");
    // Limit to 20 characters and add prefix
    callbackType = callbackType.substring(0, 20);
    callbackType = "engrid" + capitalize(callbackType);
    if (errorElement && !errorElement.dataset[callbackType]) {
      errorElement.dataset[callbackType] = "true";

      const observer = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
          if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
            callback();
          }
        });
      });
      observer.observe(errorElement, { childList: true });
    }
  }
  // Get the Payment Type
  static getPaymentType(): string {
    return ENGrid.getFieldValue("transaction.paymenttype");
  }
  // Set the Payment Type
  static setPaymentType(paymentType: string) {
    const enFieldPaymentType = ENGrid.getField(
      "transaction.paymenttype"
    ) as HTMLSelectElement;
    if (enFieldPaymentType) {
      const paymentTypeOption = Array.from(enFieldPaymentType.options).find(
        (option) =>
          paymentType.toLowerCase() === "card"
            ? ["card", "visa", "vi"].includes(option.value.toLowerCase())
            : paymentType.toLowerCase() === option.value.toLowerCase()
      );
      if (paymentTypeOption) {
        paymentTypeOption.selected = true;
        enFieldPaymentType.value = paymentTypeOption.value;
      } else {
        enFieldPaymentType.value = paymentType;
      }
      const event = new Event("change", {
        bubbles: true,
        cancelable: true,
      });
      enFieldPaymentType.dispatchEvent(event);
    }
  }
  static isInViewport(element: HTMLElement) {
    const rect = element.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <=
        (window.innerHeight ||
          document.documentElement.clientHeight) /* or $(window).height() */ &&
      rect.right <=
        (window.innerWidth ||
          document.documentElement.clientWidth) /* or $(window).width() */
    );
  }
}
