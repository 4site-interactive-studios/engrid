// DataLayer: singleton helper for pushing structured analytics events/vars to window.dataLayer.
// On load it emits one aggregated event `pageJsonVariablesReady` with:
//   EN_PAGEJSON_* (normalized pageJson), EN_URLPARAM_*, EN_RECURRING_FREQUENCIES (donation pages),
//   and EN_SUBMISSION_SUCCESS_{PAGETYPE} when on the final page.
// User actions emit: EN_FORM_VALUE_UPDATED (field changes) and submission opt‑in/out events.
// Queued end‑of‑gift events/variables (via addEndOfGiftProcessEvent / addEndOfGiftProcessVariable)
// are replayed after a successful gift process load.
// Sensitive payment/bank fields are excluded; selected PII fields are Base64 “hashed” (btoa — not cryptographic).
// Replace with a real hash (e.g., SHA‑256) if required.

import { EngridLogger, ENGrid, EnForm, RememberMeEvents } from ".";

export class DataLayer {
  private logger: EngridLogger = new EngridLogger(
    "DataLayer",
    "#f1e5bc",
    "#009cdc",
    "📊"
  );
  private dataLayer = (window as any).dataLayer || [];
  private _form: EnForm = EnForm.getInstance();
  private static instance: DataLayer;
  private encoder = new TextEncoder();
  private endOfGiftProcessStorageKey = "ENGRID_END_OF_GIFT_PROCESS_EVENTS";

  private excludedFields = [
    // Credit Card
    "transaction.ccnumber",
    "transaction.ccexpire.delimiter",
    "transaction.ccexpire",
    "transaction.ccvv",
    "supporter.creditCardHolderName",

    // Bank Account
    "supporter.bankAccountNumber",
    "supporter.bankAccountType",
    "transaction.bankname",
    "supporter.bankRoutingNumber",
  ];

  private hashedFields = [
    // Supporter Address, Phone Numbers, and Address
    "supporter.emailAddress",
    "supporter.phoneNumber",
    "supporter.phoneNumber2",
    "supporter.address1",
    "supporter.address2",
    "supporter.address3",

    // In Honor/Memory Inform Email and Address
    "transaction.infemail",
    "transaction.infadd1",
    "transaction.infadd2",
    "transaction.infadd3",

    // Billing Address
    "supporter.billingAddress1",
    "supporter.billingAddress2",
    "supporter.billingAddress3",
  ];

  private retainedFields = [
    // Supporter Address, Phone Numbers, and Address
    "supporter.emailAddress",
    "supporter.phoneNumber2",
    "supporter.address1",
    "supporter.address2",
    "supporter.address3",
  ];

  constructor() {
    if (ENGrid.getOption("RememberMe")) {
      RememberMeEvents.getInstance().onLoad.subscribe((hasData) => {
        this.logger.log("Remember me - onLoad", hasData);
        this.onLoad();
      });
    } else {
      this.onLoad();
    }
    this._form.onSubmit.subscribe(() => this.onSubmit());
  }

  public static getInstance(): DataLayer {
    if (!DataLayer.instance) {
      DataLayer.instance = new DataLayer();
      (window as any)._dataLayer = DataLayer.instance;
    }

    return DataLayer.instance;
  }

  private transformJSON(value: any) {
    if (typeof value === "string") {
      return value
        .toUpperCase()
        .trim()
        .replace(/\s+/g, "-")
        .replace(/:-/g, "-");
    }
    if (typeof value === "boolean") {
      return value ? "TRUE" : "FALSE";
    }
    if (typeof value === "number") {
      return value; // Preserve numeric type for analytics platforms that infer number vs string
    }
    return "";
  }

  private onLoad() {
    // Collect all data layer variables to push at once
    const dataLayerData: { [key: string]: any } = {};

    if (ENGrid.getGiftProcess()) {
      this.logger.log("EN_SUCCESSFUL_DONATION");
      this.addEndOfGiftProcessEventsToDataLayer();
    }

    if (window.pageJson) {
      const pageJson = window.pageJson as Record<string, any>;
      for (const property in pageJson) {
        const key = `EN_PAGEJSON_${property.toUpperCase()}`;
        const value = pageJson[property];
        dataLayerData[key] = this.transformJSON(value);
      }
      if (ENGrid.getPageCount() === ENGrid.getPageNumber()) {
        dataLayerData[
          `EN_SUBMISSION_SUCCESS_${pageJson.pageType.toUpperCase()}`
        ] = "TRUE";
      }
    }

    const urlParams = new URLSearchParams(window.location.search);
    urlParams.forEach((value, key) => {
      dataLayerData[`EN_URLPARAM_${key.toUpperCase()}`] =
        this.transformJSON(value);
    });

    this.retainedFields.forEach((fieldName) => {
      const storedValue = localStorage.getItem(
        `EN_RETAINED_FIELD_${fieldName.toUpperCase()}`
      );
      if (storedValue) {
        dataLayerData[`EN_RETAINED_FIELD_${fieldName.toUpperCase()}`] =
          storedValue;
      }
    });

    if (ENGrid.getPageType() === "DONATION") {
      const recurrFreqEls = document.querySelectorAll(
        '[name="transaction.recurrfreq"]'
      ) as NodeListOf<HTMLInputElement>;

      const recurrValues = [...recurrFreqEls].map((el) => el.value);

      dataLayerData[`EN_RECURRING_FREQUENCIES`] = recurrValues;
    }

    // Push all collected variables at once
    if (Object.keys(dataLayerData).length > 0) {
      dataLayerData.event = "pageJsonVariablesReady";
      this.dataLayer.push(dataLayerData);
    }

    this.attachEventListeners();
  }

  private onSubmit() {
    const optIn = document.querySelector(
      ".en__field__item:not(.en__field--question) input[name^='supporter.questions'][type='checkbox']:checked"
    );
    if (optIn) {
      this.logger.log("EN_SUBMISSION_WITH_EMAIL_OPTIN");
      this.dataLayer.push({
        event: "EN_SUBMISSION_WITH_EMAIL_OPTIN",
      });
    } else {
      this.logger.log("EN_SUBMISSION_WITHOUT_EMAIL_OPTIN");
      this.dataLayer.push({
        event: "EN_SUBMISSION_WITHOUT_EMAIL_OPTIN",
      });
    }
  }

  private attachEventListeners() {
    const textInputs = document.querySelectorAll(
      ".en__component--advrow input:not([type=checkbox]):not([type=radio]):not([type=submit]):not([type=button]):not([type=hidden]):not([unhidden]), .en__component--advrow textarea"
    ) as NodeListOf<HTMLInputElement>;

    textInputs.forEach((el) => {
      el.addEventListener("blur", (e) => {
        this.handleFieldValueChange(e.target as HTMLInputElement);
      });
    });

    const radioAndCheckboxInputs = document.querySelectorAll(
      ".en__component--advrow input[type=checkbox], .en__component--advrow input[type=radio]"
    ) as NodeListOf<HTMLInputElement>;

    radioAndCheckboxInputs.forEach((el) => {
      el.addEventListener("change", (e) => {
        this.handleFieldValueChange(e.target as HTMLInputElement);
      });
    });

    const selectInputs = document.querySelectorAll(
      ".en__component--advrow select"
    ) as NodeListOf<HTMLInputElement>;

    selectInputs.forEach((el) => {
      el.addEventListener("change", (e) => {
        this.handleFieldValueChange(e.target as HTMLInputElement);
      });
    });
  }

  private async handleFieldValueChange(el: HTMLInputElement | HTMLSelectElement) {
    if (el.value === "" || this.excludedFields.includes(el.name)) return;

    const value = this.hashedFields.includes(el.name)
      ? this.hash(el.value)
      : el.value;

    if (["checkbox", "radio"].includes(el.type)) {
      if ((el as HTMLInputElement).checked) {
        if (el.name === "en__pg") {
          //Premium gift handling
          this.dataLayer.push({
            event: "EN_FORM_VALUE_UPDATED",
            enFieldName: el.name,
            enFieldLabel: "Premium Gift",
            enFieldValue: el
              .closest(".en__pg__body")
              ?.querySelector(".en__pg__name")?.textContent,
            enProductId: (
              document.querySelector(
                '[name="transaction.selprodvariantid"]'
              ) as HTMLInputElement
            )?.value,
          });
        } else {
          this.dataLayer.push({
            event: "EN_FORM_VALUE_UPDATED",
            enFieldName: el.name,
            enFieldLabel: this.getFieldLabel(el),
            enFieldValue: value,
          });
        }
      }
      return;
    }

    if (this.retainedFields.includes(el.name)) {
      const sha256value = await this.shaHash(el.value);
      localStorage.setItem(
        `EN_RETAINED_FIELD_${el.name.toUpperCase()}`,
        sha256value
      );
    }

    this.dataLayer.push({
      event: "EN_FORM_VALUE_UPDATED",
      enFieldName: el.name,
      enFieldLabel: this.getFieldLabel(el),
      enFieldValue: value,
    });
  }

  private hash(value: string): string {
    return btoa(value);
  }

  // TODO: Replace the hash function with this secure SHA-256 implementation later
  private async shaHash(value: string): Promise<string> {
    const data = this.encoder.encode(value);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(hashBuffer))
      .map((byte) => {
        const hex = byte.toString(16);
        return hex.length === 1 ? "0" + hex : hex;
      })
      .join("");
  }

  private getFieldLabel(
    el: HTMLInputElement | HTMLSelectElement
  ): string | null {
    return el.closest(".en__field")?.querySelector("label")?.textContent || "";
  }

  public addEndOfGiftProcessEvent(
    eventName: string,
    eventProperties: object = {}
  ) {
    this.storeEndOfGiftProcessData({
      event: eventName,
      ...eventProperties,
    });
  }

  public addEndOfGiftProcessVariable(
    variableName: string,
    variableValue: any = ""
  ) {
    this.storeEndOfGiftProcessData({
      [variableName.toUpperCase()]: variableValue,
    });
  }

  private storeEndOfGiftProcessData(data: object) {
    const events = this.getEndOfGiftProcessData();
    events.push(data);
    window.sessionStorage.setItem(
      this.endOfGiftProcessStorageKey,
      JSON.stringify(events)
    );
  }

  private addEndOfGiftProcessEventsToDataLayer() {
    this.getEndOfGiftProcessData().forEach((event: object) => {
      this.dataLayer.push(event);
    });
    window.sessionStorage.removeItem(this.endOfGiftProcessStorageKey);
  }

  private getEndOfGiftProcessData(): Array<any> {
    let eventsData = window.sessionStorage.getItem(
      this.endOfGiftProcessStorageKey
    );
    return !eventsData ? [] : JSON.parse(eventsData);
  }
}
