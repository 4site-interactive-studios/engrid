import { ENGrid } from "./engrid";
import { EngridLogger } from "./logger";
import * as cookie from "./cookie";

export class StickyPrepopulation {
  private logger: EngridLogger = new EngridLogger(
    "StickyPrepopulation",
    "teal",
    "white",
    "📌"
  );
  private options: { fields: string[] } = { fields: [] };
  private cookieName: string = "engrid-sticky-prepop";

  constructor() {
    if (!this.shouldRun()) {
      return;
    }
    this.logger.log("StickyPrepopulation initialized");
    this.deleteCookieIfGiftProcessComplete();
    this.createCookie();
    this.applyPrepopulation();
  }

  /*
    * Determine if we should run the script
    * Do not run if RememberMe is active
    * Only run if StickyPrepopulation option is set with fields
   */
  private shouldRun(): boolean {
    if (ENGrid.getOption("RememberMe")) {
      return false;
    }
    const options = ENGrid.getOption("StickyPrepopulation");
    if (options && options?.fields.length > 0) {
      this.options = options;
      return true;
    } else {
      return false;
    }
  }

  /*
    * Delete the cookie if the gift process is complete
   */
  private deleteCookieIfGiftProcessComplete() {
    if (ENGrid.getGiftProcess()) {
      this.logger.log(
        "Gift process complete, removing sticky prepopulation cookie if it exists"
      );
      cookie.remove(this.cookieName);
    }
  }

  /*
   * Create the cookie if we're coming from a campaign link and supporterId is present
   */
  private async createCookie() {
    // If we're not coming from a campaign link, don't create the cookie
    if (! window.pageJson?.supporterId) {
      this.logger.log("No supporterId present, not creating sticky prepopulation cookie");
      return;
    }

    try {
      const encryptedSupporterDetails = await this.encryptSupporterDetails(
        this.getSupporterDetailsFromFields()
      );

      cookie.set(this.cookieName, window.btoa(JSON.stringify({
        encryptedData: encryptedSupporterDetails.encryptedData,
        iv: encryptedSupporterDetails.iv,
        pageId: ENGrid.getPageID()
      })), { path: "/", expires: 7 });
    } catch (e) {
      this.logger.log("Error creating sticky prepopulation cookie");
      return;
    }

    this.logger.log("Sticky prepopulation cookie created");
  }

  /*
   *  If the cookie is present and supporterId is not (it's not a campaign link prefilled by EN),
   *  then apply the prepopulation
   */
  private async applyPrepopulation() {
    const cookieData = cookie.get(this.cookieName);

    if (!cookieData) {
      this.logger.log("No sticky prepopulation cookie found, not prepopulating fields");
      return;
    }

    if (window.pageJson?.supporterId) {
      this.logger.log("SupporterId present, not applying sticky prepopulation");
      return;
    }

    const encryptedSupporterDetails = JSON.parse(
      window.atob(cookieData)
    );

    if (!encryptedSupporterDetails || encryptedSupporterDetails?.pageId !== ENGrid.getPageID()) {
      this.logger.log("No encrypted supporter details found in cookie, or page ID does not match");
      return;
    }

    let supporterDetails: { [key: string]: string } = {};

    try {
      supporterDetails = JSON.parse(
        await this.decryptSupporterDetails(
          this.base64ToArrayBuffer(encryptedSupporterDetails.encryptedData),
          new Uint8Array(this.base64ToArrayBuffer(encryptedSupporterDetails.iv))
        )
      );
    } catch (e) {
      this.logger.log("Error decrypting supporter details from cookie");
      return;
    }

    this.options.fields.forEach((fieldName) => {
      if (!supporterDetails[fieldName]) return;
      ENGrid.setFieldValue(
        fieldName,
        decodeURIComponent(supporterDetails[fieldName])
      );
      this.logger.log(`Setting "${fieldName}" to "${decodeURIComponent(supporterDetails[fieldName])}"`);
    });
  }

  /*
  * Get the supporter details from the form fields
  */
  private getSupporterDetailsFromFields(): { [key: string]: string } {
    const supporterDetails: { [key: string]: string } = {};

    this.options.fields.forEach((fieldName) => {
      let field = document.querySelector(
        `[name="${fieldName}"]`
      ) as HTMLInputElement;
      // If it is a radio or checkbox, get the checked value
      if (field) {
        if (field.type === "radio" || field.type === "checkbox") {
          field = document.querySelector(
            `[name="${fieldName}"]:checked`
          ) as HTMLInputElement;
        }
        supporterDetails[fieldName] = encodeURIComponent(field.value);
      }
    });

    return supporterDetails;
  }

  /*
   * Encrypt the supporter details
   */
    private async encryptSupporterDetails(supporterDetails: {
      [key: string]: string;
    }): Promise<{ encryptedData: string; iv: string }> {
      const encryptionKey = await this.createEncryptionKey(this.getSeed());
      const iv = window.crypto.getRandomValues(new Uint8Array(12));

      const supporterDetailsString = JSON.stringify(supporterDetails);
      const encryptedData = await window.crypto.subtle.encrypt(
        {
          name: "AES-GCM",
          iv: iv,
        },
        encryptionKey,
        new TextEncoder().encode(supporterDetailsString)
      );

      return {
        encryptedData: this.arrayBufferToBase64(encryptedData),
        iv: this.arrayBufferToBase64(iv),
      };
    }

  /*
   * Decrypt the supporter details
   */
  private async decryptSupporterDetails(
    encryptedSupporterDetails: ArrayBuffer,
    iv: ArrayBuffer
  ): Promise<string> {
    const encryptionKey = await this.createEncryptionKey(this.getSeed());

    const decryptedData = await window.crypto.subtle.decrypt(
      { name: "AES-GCM", iv: iv },
      encryptionKey,
      encryptedSupporterDetails
    );

    return new TextDecoder().decode(decryptedData);
  }

  /*
   * Create the encryption key
   */
  private async createEncryptionKey(seed: string): Promise<CryptoKey> {
    const encoder = new TextEncoder();
    const keyMaterial = await window.crypto.subtle.importKey(
      "raw",
      encoder.encode(seed),
      { name: "PBKDF2" },
      false,
      ["deriveKey"]
    );
    return await window.crypto.subtle.deriveKey(
      {
        name: "PBKDF2",
        salt: encoder.encode(seed),
        iterations: 100000,
        hash: "SHA-256",
      },
      keyMaterial,
      { name: "AES-GCM", length: 256 },
      false,
      ["encrypt", "decrypt"]
    );
  }

  /*
   * Convert an ArrayBuffer to a base64 string
   */
  private arrayBufferToBase64(buffer: ArrayBuffer): string {
    let binary = "";
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  }

  /*
   * Create an Array Buffer from a base64 string
   */
  private base64ToArrayBuffer(base64: string): ArrayBuffer {
    const binary_string = window.atob(base64);
    const len = binary_string.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes.buffer;
  }

  /*
   * Derive a seed from the page URL
   */
  private getSeed() {
    const url = new URL(window.location.href);
    return url.origin + url.pathname + (url.searchParams.get("ea.tracking.id") ? `?ea.tracking.id=${url.searchParams.get("ea.tracking.id")}` : '');
  }
}
