import * as cookie from "./cookie";
import { EnForm, RememberMeEvents, DonationFrequency } from "./events";
const tippy = require("tippy.js").default;

interface DataObj {
  [key: string]: string;
}

// localStorage key used to cache the per-device AES-GCM encryption key.
// A random secret generated once per device and held in localStorage.
const RM_ENCRYPTION_KEY_STORAGE_NAME = "engrid-remember-me-key";

export class RememberMe {
  public _form: EnForm = EnForm.getInstance();
  public _events: RememberMeEvents = RememberMeEvents.getInstance();
  private _frequency: DonationFrequency = DonationFrequency.getInstance();

  private remoteUrl: string | null;
  private cookieName: string;
  private fieldNames: string[];
  private fieldData: DataObj;
  private cookieExpirationDays: number;
  private iframe: HTMLIFrameElement | null;
  private rememberMeOptIn: boolean;
  private encryptData: boolean;
  private hide: boolean;

  private fieldDonationAmountRadioName: string;
  private fieldDonationAmountOtherName: string;
  private fieldDonationRecurrPayRadioName: string;
  private fieldDonationRecurrFreqRadioName: string;
  private fieldDonationAmountOtherCheckboxID: string;

  private fieldOptInSelectorTarget: string;
  private fieldOptInSelectorTargetLocation: string;
  private fieldClearSelectorTarget: string;
  private fieldClearSelectorTargetLocation: string;
  private fieldClearLabel: string;

  constructor(options: {
    remoteUrl?: string;
    cookieName?: string;
    cookieExpirationDays?: number;
    fieldNames?: string[];
    fieldDonationAmountRadioName?: string;
    fieldDonationAmountOtherName?: string;
    fieldDonationRecurrPayRadioName?: string;
    fieldDonationRecurrFreqRadioName?: string;
    fieldDonationAmountOtherCheckboxID?: string;
    fieldOptInSelectorTarget?: string;
    fieldOptInSelectorTargetLocation?: string;
    fieldClearSelectorTarget?: string;
    fieldClearSelectorTargetLocation?: string;
    fieldClearLabel?: string;
    checked?: boolean;
    encryptData?: boolean;
    hide?: boolean;
  }) {
    this.iframe = null;
    this.encryptData = options.encryptData ? options.encryptData : false;
    this.hide = options.hide ? options.hide : false;

    this.remoteUrl = options.remoteUrl ? options.remoteUrl : null;
    this.cookieName = options.cookieName
      ? options.cookieName
      : "engrid-autofill";
    this.cookieExpirationDays = options.cookieExpirationDays
      ? options.cookieExpirationDays
      : 365;
    this.rememberMeOptIn = options.checked ? options.checked : false;

    this.fieldNames = options.fieldNames ? options.fieldNames : [];
    this.fieldDonationAmountRadioName = options.fieldDonationAmountRadioName
      ? options.fieldDonationAmountRadioName
      : "transaction.donationAmt";
    this.fieldDonationAmountOtherName = options.fieldDonationAmountOtherName
      ? options.fieldDonationAmountOtherName
      : "transaction.donationAmt.other";
    this.fieldDonationRecurrPayRadioName =
      options.fieldDonationRecurrPayRadioName
        ? options.fieldDonationRecurrPayRadioName
        : "transaction.recurrpay";
    this.fieldDonationRecurrFreqRadioName =
      options.fieldDonationRecurrFreqRadioName
        ? options.fieldDonationRecurrFreqRadioName
        : "transaction.recurrfreq";
    this.fieldDonationAmountOtherCheckboxID =
      options.fieldDonationAmountOtherCheckboxID
        ? options.fieldDonationAmountOtherCheckboxID
        : "#en__field_transaction_donationAmt4";

    this.fieldOptInSelectorTarget = options.fieldOptInSelectorTarget
      ? options.fieldOptInSelectorTarget
      : ".en__field--emailAddress.en__field";
    this.fieldOptInSelectorTargetLocation =
      options.fieldOptInSelectorTargetLocation
        ? options.fieldOptInSelectorTargetLocation
        : "after";

    this.fieldClearSelectorTarget = options.fieldClearSelectorTarget
      ? options.fieldClearSelectorTarget
      : 'label[for="en__field_supporter_firstName"]';
    this.fieldClearSelectorTargetLocation =
      options.fieldClearSelectorTargetLocation
        ? options.fieldClearSelectorTargetLocation
        : "before";

    this.fieldClearLabel = options.fieldClearLabel
      ? options.fieldClearLabel
      : "(clear autofill)";

    this.fieldData = {};
    if (this.useRemote()) {
      this.createIframe(
        () => {
          if (this.iframe && this.iframe.contentWindow) {
            this.iframe.contentWindow.postMessage(
              JSON.stringify({
                key: this.cookieName,
                operation: "read",
                encryptData: this.encryptData,
              }),
              "*"
            );
            this._form.onSubmit.subscribe(() => {
              if (this.rememberMeOptIn) {
                this.readFields();
                this.saveCookieToRemote();
              }
            });
          }
        },
        (event) => {
          let data: DataObj | undefined;
          if (
            event.data &&
            typeof event.data === "string" &&
            this.isJson(event.data)
          ) {
            data = JSON.parse(event.data);
          }
          if (
            data &&
            data.key &&
            data.value !== undefined &&
            data.key === this.cookieName
          ) {
            this.updateFieldData(data.value);
            this.writeFields();
            let hasFieldData = Object.keys(this.fieldData).length > 0;
            if (!hasFieldData) {
              this.insertRememberMeOptin();
            } else {
              this.insertClearRememberMeLink();
              this.reapplyDonationAmtAfterSwap();
            }
          }
        }
      );
    } else if (this.encryptData) {
      // Same flow as the unencrypted branch below, but the cookie payload is
      // AES-GCM encrypted/decrypted (browser-native Web Crypto), so reading
      // the cookie is asynchronous. A failed decrypt (foreign device or
      // cleared localStorage) leaves fieldData empty and silently falls back
      // to the standard, no-autofill experience.
      this.readCookieEncrypted().then(() => {
        let hasFieldData = Object.keys(this.fieldData).length > 0;
        if (!hasFieldData) {
          this.insertRememberMeOptin();
        } else {
          this.insertClearRememberMeLink();
        }
        this.writeFields();
        if (hasFieldData) {
          this.reapplyDonationAmtAfterSwap();
        }
        this._form.onSubmit.subscribe(() => {
          if (this.rememberMeOptIn) {
            this.readFields();
            this.saveCookieEncrypted();
          }
        });
      });
    } else {
      this.readCookie();
      let hasFieldData = Object.keys(this.fieldData).length > 0;
      if (!hasFieldData) {
        this.insertRememberMeOptin();
      } else {
        this.insertClearRememberMeLink();
      }
      this.writeFields();
      if (hasFieldData) {
        this.reapplyDonationAmtAfterSwap();
      }
      this._form.onSubmit.subscribe(() => {
        if (this.rememberMeOptIn) {
          this.readFields();
          this.saveCookie();
        }
      });
    }
  }
  private updateFieldData(jsonData: string) {
    if (jsonData) {
      let data = JSON.parse(jsonData);
      for (let i = 0; i < this.fieldNames.length; i++) {
        if (data[this.fieldNames[i]] !== undefined) {
          this.fieldData[this.fieldNames[i]] = decodeURIComponent(
            data[this.fieldNames[i]]
          );
        }
      }
    }
  }
  private insertClearRememberMeLink() {
    let clearRememberMeField = document.getElementById("clear-autofill-data");
    if (!clearRememberMeField) {
      clearRememberMeField = document.createElement("a");
      clearRememberMeField.setAttribute("id", "clear-autofill-data");
      clearRememberMeField.classList.add("label-tooltip");
      clearRememberMeField.setAttribute("style", "cursor: pointer;");
      clearRememberMeField.innerHTML = this.fieldClearLabel;

      const targetField = this.getElementByFirstSelector(
        this.fieldClearSelectorTarget
      );
      if (targetField) {
        if (this.fieldClearSelectorTargetLocation === "after") {
          targetField.appendChild(clearRememberMeField);
        } else {
          targetField.prepend(clearRememberMeField);
        }
      }
    }
    clearRememberMeField.addEventListener("click", (e) => {
      e.preventDefault();
      this.clearFields(["supporter.country" /*, 'supporter.emailAddress'*/]);
      if (this.useRemote()) {
        this.clearCookieOnRemote();
      } else if (this.encryptData) {
        this.clearCookieEncrypted();
      } else {
        this.clearCookie();
      }
      let clearAutofillLink = document.getElementById("clear-autofill-data");
      if (clearAutofillLink) {
        clearAutofillLink.style.display = "none";
      }
      this.rememberMeOptIn = false;
      this._events.dispatchClear();
      window.dispatchEvent(new CustomEvent("RememberMe_Cleared"));
    });
    this._events.dispatchLoad(true);
    window.dispatchEvent(
      new CustomEvent("RememberMe_Loaded", { detail: { withData: true } })
    );
  }
  private getElementByFirstSelector(selectorsString: string) {
    // iterate through the selectors until we find one that exists
    let targetField = null;
    const selectorTargets = selectorsString.split(",");
    for (let i = 0; i < selectorTargets.length; i++) {
      targetField = document.querySelector(
        selectorTargets[i]
      ) as HTMLInputElement;
      if (targetField) {
        break;
      }
    }
    return targetField;
  }
  private insertRememberMeOptin() {
    let rememberMeOptInField = document.getElementById(
      "remember-me-opt-in"
    ) as HTMLInputElement;
    if (!rememberMeOptInField) {
      const rememberMeLabel = "Remember Me";
      const rememberMeInfo = `
				Check “Remember me” to complete forms on this device faster. 
				While your financial information won’t be stored, you should only check this box from a personal device. 
				Click “Clear autofill” to remove the information from your device at any time.
			`;

      const rememberMeOptInFieldChecked = this.rememberMeOptIn ? "checked" : "";
      const rememberMeOptInField = document.createElement("div");
      rememberMeOptInField.classList.add(
        "en__field",
        "en__field--checkbox",
        "en__field--question",
        "rememberme-wrapper"
      );
      rememberMeOptInField.setAttribute("id", "remember-me-opt-in");
      rememberMeOptInField.setAttribute("style", "overflow-x: hidden;");
      rememberMeOptInField.innerHTML = `
        <div class="en__field__element en__field__element--checkbox">
          <div class="en__field__item">
            <input id="remember-me-checkbox" type="checkbox" class="en__field__input en__field__input--checkbox" ${rememberMeOptInFieldChecked} />
            <label for="remember-me-checkbox" class="en__field__label en__field__label--item" style="white-space: nowrap;">
              <div class="rememberme-content" style="display: inline-flex; align-items: center;">
                ${rememberMeLabel}
                <a id="rememberme-learn-more-toggle" style="display: inline-block; display: inline-flex; align-items: center; cursor: pointer; margin-left: 10px; margin-top: var(--rememberme-learn-more-toggle_margin-top)">
                  <svg style="height: 14px; width: auto; z-index: 1;" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M11 7H9V5H11V7ZM11 9H9V15H11V9ZM10 2C5.59 2 2 5.59 2 10C2 14.41 5.59 18 10 18C14.41 18 18 14.41 18 10C18 5.59 14.41 2 10 2ZM10 0C15.523 0 20 4.477 20 10C20 15.523 15.523 20 10 20C4.477 20 0 15.523 0 10C0 4.477 4.477 0 10 0Z" fill="currentColor"/></svg>
                </a>
              </div>
            </label>
          </div>
        </div>
			`;

      const targetField = this.getElementByFirstSelector(
        this.fieldOptInSelectorTarget
      );
      if (targetField && targetField.parentNode) {
        targetField.parentNode.insertBefore(
          rememberMeOptInField,
          this.fieldOptInSelectorTargetLocation == "before"
            ? targetField
            : targetField.nextSibling
        );

        const rememberMeCheckbox = document.getElementById(
          "remember-me-checkbox"
        ) as HTMLInputElement;
        if (rememberMeCheckbox) {
          rememberMeCheckbox.addEventListener("change", () => {
            if (rememberMeCheckbox.checked) {
              this.rememberMeOptIn = true;
            } else {
              this.rememberMeOptIn = false;
            }
          });
        }

        if (this.hide) {
          rememberMeOptInField.classList.add("hide");
        }

        tippy("#rememberme-learn-more-toggle", { content: rememberMeInfo });
      }
    } else if (this.rememberMeOptIn) {
      rememberMeOptInField.checked = true;
    }
    this._events.dispatchLoad(false);
    window.dispatchEvent(
      new CustomEvent("RememberMe_Loaded", { detail: { withData: false } })
    );
  }
  private useRemote() {
    return (
      !!this.remoteUrl &&
      typeof window.postMessage === "function" &&
      window.JSON &&
      window.localStorage
    );
  }
  private createIframe(
    iframeLoaded: () => void,
    messageReceived: (event: {
      data?: { key?: string; value?: string };
    }) => void
  ) {
    if (this.remoteUrl) {
      let iframe = document.createElement("iframe");
      iframe.style.cssText =
        "position:absolute;width:1px;height:1px;left:-9999px;";
      iframe.src = this.remoteUrl;
      iframe.setAttribute("sandbox", "allow-same-origin allow-scripts");
      iframe.setAttribute("title", "Remember Me iframe");
      this.iframe = iframe;
      document.body.appendChild(this.iframe);
      this.iframe.addEventListener("load", () => iframeLoaded(), false);
      window.addEventListener(
        "message",
        (event) => {
          if (this.iframe?.contentWindow === event.source) {
            messageReceived(event);
          }
        },
        false
      );
    }
  }
  private clearCookie() {
    this.fieldData = {};
    this.saveCookie();
  }
  private clearCookieOnRemote() {
    this.fieldData = {};
    this.saveCookieToRemote();
  }
  private saveCookieToRemote() {
    if (this.iframe && this.iframe.contentWindow) {
      this.iframe.contentWindow.postMessage(
        JSON.stringify({
          key: this.cookieName,
          value: this.fieldData,
          operation: "write",
          expires: this.cookieExpirationDays,
          encryptData: this.encryptData,
        }),
        "*"
      );
    }
  }
  private readCookie() {
    this.updateFieldData(cookie.get(this.cookieName) || "");
  }
  private saveCookie() {
    cookie.set(this.cookieName, JSON.stringify(this.fieldData), {
      expires: this.cookieExpirationDays,
    });
  }
  /**
   * Reads and decrypts the local (non-remote) Remember Me cookie using
   * browser-native AES-GCM (Web Crypto), with the key held in localStorage
   * on this device. If the key is absent (different device or cleared
   * storage) or decryption otherwise fails, the field data is left empty
   * and the component falls back to the normal, no-autofill experience.
   */
  private async readCookieEncrypted(): Promise<void> {
    const raw = cookie.get(this.cookieName);
    if (!raw) {
      return;
    }
    const decrypted = await this.decryptPayload(raw);
    if (decrypted) {
      this.updateFieldData(decrypted);
    }
  }
  /**
   * Encrypts the current fieldData with AES-GCM (Web Crypto) and stores the
   * base64-encoded result in the local cookie. If encryption isn't possible
   * (e.g. Web Crypto unavailable), nothing is written.
   */
  private async saveCookieEncrypted(): Promise<void> {
    const encrypted = await this.encryptPayload(JSON.stringify(this.fieldData));
    if (encrypted) {
      cookie.set(this.cookieName, encrypted, {
        expires: this.cookieExpirationDays,
      });
    }
  }
  private clearCookieEncrypted() {
    this.fieldData = {};
    this.saveCookieEncrypted();
  }
  /**
   * Retrieves the per-device AES-GCM encryption key. A random secret
   * generated once per device and held in localStorage — never written
   * to the cookie, so it never travels with the transported value.
   */
  private async getEncryptionKey(): Promise<CryptoKey | null> {
    if (!window.crypto || !window.crypto.subtle) {
      return null;
    }
    const storedKey = window.localStorage.getItem(
      RM_ENCRYPTION_KEY_STORAGE_NAME
    );
    if (storedKey) {
      try {
        return await window.crypto.subtle.importKey(
          "raw",
          this.base64ToArrayBuffer(storedKey),
          { name: "AES-GCM", length: 256 },
          false,
          ["encrypt", "decrypt"]
        );
      } catch (e) {
        return null;
      }
    }
    try {
      const key = await window.crypto.subtle.generateKey(
        { name: "AES-GCM", length: 256 },
        true,
        ["encrypt", "decrypt"]
      );
      const exported = await window.crypto.subtle.exportKey("raw", key);
      window.localStorage.setItem(
        RM_ENCRYPTION_KEY_STORAGE_NAME,
        this.arrayBufferToBase64(exported)
      );
      return key;
    } catch (e) {
      return null;
    }
  }
  /**
   * Encrypts a plaintext string with AES-GCM and returns the base64-encoded
   * IV + ciphertext, ready for storage. Returns null if a key isn't
   * available (e.g. Web Crypto unsupported).
   */
  private async encryptPayload(plaintext: string): Promise<string | null> {
    const key = await this.getEncryptionKey();
    if (!key) {
      return null;
    }
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    const ciphertext = await window.crypto.subtle.encrypt(
      { name: "AES-GCM", iv },
      key,
      new TextEncoder().encode(plaintext)
    );
    const combined = new Uint8Array(iv.length + ciphertext.byteLength);
    combined.set(iv);
    combined.set(new Uint8Array(ciphertext), iv.length);
    return this.arrayBufferToBase64(combined);
  }
  /**
   * Decrypts a base64-encoded IV + ciphertext payload previously produced by
   * encryptPayload. Returns null (rather than throwing) if the key is
   * missing or decryption otherwise fails, so callers can gracefully fall
   * back to the standard, no-autofill experience.
   */
  private async decryptPayload(
    encryptedBase64: string
  ): Promise<string | null> {
    const key = await this.getEncryptionKey();
    if (!key) {
      return null;
    }
    let combined: Uint8Array;
    try {
      combined = new Uint8Array(this.base64ToArrayBuffer(encryptedBase64));
    } catch (e) {
      return null;
    }
    if (combined.length < 13) {
      return null;
    }
    const iv = combined.slice(0, 12);
    const ciphertext = combined.slice(12);
    try {
      const decrypted = await window.crypto.subtle.decrypt(
        { name: "AES-GCM", iv },
        key,
        ciphertext
      );
      return new TextDecoder().decode(decrypted);
    } catch (e) {
      return null;
    }
  }
  private arrayBufferToBase64(buffer: ArrayBuffer | Uint8Array): string {
    let binary = "";
    const bytes =
      buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  }
  private base64ToArrayBuffer(base64: string): ArrayBuffer {
    const binary = window.atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes.buffer;
  }
  private readFields() {
    for (let i = 0; i < this.fieldNames.length; i++) {
      let fieldSelector = "[name='" + this.fieldNames[i] + "']";
      let field = document.querySelector(fieldSelector) as HTMLInputElement;
      if (field) {
        if (field.tagName === "INPUT") {
          let type = field.getAttribute("type");
          if (type === "radio" || type === "checkbox") {
            field = document.querySelector(
              fieldSelector + ":checked"
            ) as HTMLInputElement;
          }
          // When the donation amount radio is set to "Other", save the actual
          // custom value from the .other text input instead of "Other".
          if (
            this.fieldNames[i] === this.fieldDonationAmountRadioName &&
            field &&
            field.value.toLowerCase() === "other"
          ) {
            const otherField = document.querySelector(
              "input[name='" + this.fieldDonationAmountOtherName + "']"
            ) as HTMLInputElement;
            if (otherField && otherField.value) {
              this.fieldData[this.fieldNames[i]] = encodeURIComponent(
                otherField.value
              );
              continue;
            }
          }
          this.fieldData[this.fieldNames[i]] = encodeURIComponent(field.value);
        } else if (field.tagName === "SELECT") {
          this.fieldData[this.fieldNames[i]] = encodeURIComponent(field.value);
        }
      }
    }
  }
  private setFieldValue(
    field: HTMLInputElement | HTMLSelectElement,
    value: string | undefined,
    overwrite: boolean = false
  ) {
    value = decodeURIComponent(value || "");
    if (field && value !== undefined) {
      if ("type" in field) {
        switch (field.type) {
          case "select-one":
          case "select-multiple": {
            const selectField = field as HTMLSelectElement;
            for (const option of Array.from(selectField.options)) {
              if (option.value === value) {
                if ((selectField.value && overwrite) || !selectField.value) {
                  option.selected = true;
                  selectField.dispatchEvent(
                    new Event("change", { bubbles: true })
                  );
                }
                break;
              }
            }
            break;
          }
          case "checkbox":
          case "radio": {
            const inputField = field as HTMLInputElement;
            if (inputField.value === value) {
              inputField.checked = true;
              inputField.dispatchEvent(new Event("change", { bubbles: true }));
            }
            break;
          }
          case "textarea":
          case "text":
          default:
            if ((field.value && overwrite) || !field.value) {
              field.value = value;
              field.dispatchEvent(new Event("change", { bubbles: true }));
              field.dispatchEvent(new Event("blur", { bubbles: true }));
            }
        }
      }
    }
  }
  private clearFields(skipFields: string[]) {
    for (let key in this.fieldData) {
      if (skipFields.includes(key)) {
        delete this.fieldData[key];
      } else if (this.fieldData[key] === "") {
        delete this.fieldData[key];
      } else {
        this.fieldData[key] = "";
      }
    }
    this.writeFields(true);
  }
  /**
   * Writes the values from the fieldData object to the corresponding HTML input fields.
   *
   * This function iterates over the fieldNames array and for each field name, it selects the corresponding HTML input field.
   * If the field is found and its tag name is "INPUT", it checks if the field name matches certain conditions (like being a donation recurring payment radio button or a donation amount radio button).
   * Depending on these conditions, it either clicks the field or sets its value using the setFieldValue function.
   * If the field tag name is "SELECT", it sets its value using the setFieldValue function.
   *
   * @param overwrite - A boolean indicating whether to overwrite the existing value of the fields. Defaults to false.
   */
  private writeFields(overwrite: boolean = false) {
    for (let i = 0; i < this.fieldNames.length; i++) {
      let fieldSelector = "[name='" + this.fieldNames[i] + "']";
      let field = document.querySelector(fieldSelector) as HTMLInputElement;
      if (field) {
        if (field.tagName === "INPUT") {
          if (this.fieldNames[i] === this.fieldDonationRecurrPayRadioName) {
            if (this.fieldData[this.fieldNames[i]] === "Y") {
              field.click();
            }
          } else if (this.fieldNames[i] === this.fieldDonationRecurrFreqRadioName) {
            // recurrfreq is a radio group — find the specific radio with the saved value and click it
            const savedValue = this.fieldData[this.fieldNames[i]];
            if (savedValue) {
              const freqRadio = document.querySelector(
                fieldSelector + "[value='" + savedValue + "']"
              ) as HTMLInputElement;
              if (freqRadio) {
                freqRadio.click();
              }
            }
          } else if (this.fieldDonationAmountRadioName === this.fieldNames[i]) {
            const savedAmt = this.fieldData[this.fieldNames[i]];
            field = document.querySelector(
              fieldSelector + "[value='" + savedAmt + "']"
            ) as HTMLInputElement;
            if (field) {
              // Saved value matches a predefined radio option — just click it
              field.click();
            } else {
              // No matching radio: the value is a custom amount.
              // Click the "Other" radio first so the text input becomes active,
              // then fill in the numeric value.
              const otherRadio = document.querySelector(
                fieldSelector + "[value='Other'], " +
                fieldSelector + "[value='other'], " +
                fieldSelector + "[value='OTHER']"
              ) as HTMLInputElement;
              if (otherRadio) {
                otherRadio.click();
              }
              const otherField = document.querySelector(
                "input[name='" + this.fieldDonationAmountOtherName + "']"
              ) as HTMLInputElement;
              this.setFieldValue(otherField, savedAmt, true);
            }
          } else {
            this.setFieldValue(
              field,
              this.fieldData[this.fieldNames[i]],
              overwrite
            );
          }
        } else if (field.tagName === "SELECT") {
          this.setFieldValue(field, this.fieldData[this.fieldNames[i]], true);
        }
      }
    }
  }
  /**
   * SwapAmounts replaces the donationAmt radio DOM nodes ~1 second after page
   * load (triggered by DonationFrequency.load() setTimeout). When that happens
   * the selection the RememberMe just wrote gets wiped out.
   *
   * This method subscribes to the first onFrequencyChange event and, after a
   * short delay to let SwapAmounts finish its DOM update, re-applies only the
   * donation amount. It unsubscribes immediately so it only fires once.
   *
   * To avoid overwriting a manual donor interaction (if the donor changes
   * frequency before the automated SwapAmounts fires), the handler checks
   * whether the current amount selection still matches what writeFields set.
   * If the donor already picked a different amount, we skip re-application.
   */
  private reapplyDonationAmtAfterSwap() {
    const savedAmt = this.fieldData[this.fieldDonationAmountRadioName];
    if (!savedAmt) return;

    // Capture the amount that writeFields just set so we can detect manual changes
    const amountAtRegistration = this.getCurrentSelectedAmount();

    const handler = () => {
      // SwapAmounts calls _amount.load() after swapList — give it a tick to settle
      window.setTimeout(() => {
        // If the donor manually changed the amount since registration,
        // do not overwrite their choice.
        const currentAmt = this.getCurrentSelectedAmount();
        if (
          currentAmt !== null &&
          currentAmt !== "" &&
          currentAmt !== amountAtRegistration
        ) {
          return;
        }

        const fieldSelector =
          "[name='" + this.fieldDonationAmountRadioName + "']";
        let radio = document.querySelector(
          fieldSelector + "[value='" + savedAmt + "']"
        ) as HTMLInputElement;
        if (radio) {
          radio.click();
        } else {
          // Custom amount: click "Other" radio then fill the text input
          const otherRadio = document.querySelector(
            fieldSelector + "[value='Other'], " +
            fieldSelector + "[value='other'], " +
            fieldSelector + "[value='OTHER']"
          ) as HTMLInputElement;
          if (otherRadio) otherRadio.click();
          const otherField = document.querySelector(
            "input[name='" + this.fieldDonationAmountOtherName + "']"
          ) as HTMLInputElement;
          this.setFieldValue(otherField, savedAmt, true);
        }
      }, 200);
    };

    // Subscribe once: fires on the first frequency change then auto-unsubscribes
    this._frequency.onFrequencyChange.one(handler);
  }

  /**
   * Returns the currently selected donation amount value, or null if nothing
   * is selected. Checks both predefined radio buttons and the "Other" text input.
   */
  private getCurrentSelectedAmount(): string | null {
    const fieldSelector =
      "[name='" + this.fieldDonationAmountRadioName + "']";
    const checkedRadio = document.querySelector(
      fieldSelector + ":checked"
    ) as HTMLInputElement;
    if (!checkedRadio) return null;
    if (
      checkedRadio.value.toLowerCase() === "other"
    ) {
      const otherField = document.querySelector(
        "input[name='" + this.fieldDonationAmountOtherName + "']"
      ) as HTMLInputElement;
      return otherField ? otherField.value : null;
    }
    return checkedRadio.value;
  }
  private isJson(str: string) {
    try {
      JSON.parse(str);
    } catch (e) {
      return false;
    }
    return true;
  }
}
