var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { ENGrid } from "./engrid";
import { EngridLogger } from "./logger";
import * as cookie from "./cookie";
export class StickyPrepopulation {
    constructor() {
        this.logger = new EngridLogger("StickyPrepopulation", "teal", "white", "📌");
        this.options = { fields: [] };
        this.cookieName = "engrid-sticky-prepop";
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
    shouldRun() {
        if (ENGrid.getOption("RememberMe")) {
            return false;
        }
        const options = ENGrid.getOption("StickyPrepopulation");
        if (options && (options === null || options === void 0 ? void 0 : options.fields.length) > 0) {
            this.options = options;
            return true;
        }
        else {
            return false;
        }
    }
    /*
      * Delete the cookie if the gift process is complete
     */
    deleteCookieIfGiftProcessComplete() {
        if (ENGrid.getGiftProcess()) {
            this.logger.log("Gift process complete, removing sticky prepopulation cookie if it exists");
            cookie.remove(this.cookieName);
        }
    }
    /*
     * Create the cookie if we're coming from a campaign link and supporterId is present
     */
    createCookie() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            // If we're not coming from a campaign link, don't create the cookie
            if (!((_a = window.pageJson) === null || _a === void 0 ? void 0 : _a.supporterId)) {
                this.logger.log("No supporterId present, not creating sticky prepopulation cookie");
                return;
            }
            try {
                const encryptedSupporterDetails = yield this.encryptSupporterDetails(this.getSupporterDetailsFromFields());
                cookie.set(this.cookieName, window.btoa(JSON.stringify({
                    encryptedData: encryptedSupporterDetails.encryptedData,
                    iv: encryptedSupporterDetails.iv,
                    pageId: ENGrid.getPageID()
                })), { path: "/", expires: 7 });
            }
            catch (e) {
                this.logger.log("Error creating sticky prepopulation cookie");
                return;
            }
            this.logger.log("Sticky prepopulation cookie created");
        });
    }
    /*
     *  If the cookie is present and supporterId is not (it's not a campaign link prefilled by EN),
     *  then apply the prepopulation
     */
    applyPrepopulation() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const cookieData = cookie.get(this.cookieName);
            if (!cookieData) {
                this.logger.log("No sticky prepopulation cookie found, not prepopulating fields");
                return;
            }
            if ((_a = window.pageJson) === null || _a === void 0 ? void 0 : _a.supporterId) {
                this.logger.log("SupporterId present, not applying sticky prepopulation");
                return;
            }
            const encryptedSupporterDetails = JSON.parse(window.atob(cookieData));
            if (!encryptedSupporterDetails || (encryptedSupporterDetails === null || encryptedSupporterDetails === void 0 ? void 0 : encryptedSupporterDetails.pageId) !== ENGrid.getPageID()) {
                this.logger.log("No encrypted supporter details found in cookie, or page ID does not match");
                return;
            }
            let supporterDetails = {};
            try {
                supporterDetails = JSON.parse(yield this.decryptSupporterDetails(this.base64ToArrayBuffer(encryptedSupporterDetails.encryptedData), new Uint8Array(this.base64ToArrayBuffer(encryptedSupporterDetails.iv))));
            }
            catch (e) {
                this.logger.log("Error decrypting supporter details from cookie");
                return;
            }
            this.options.fields.forEach((fieldName) => {
                if (!supporterDetails[fieldName])
                    return;
                ENGrid.setFieldValue(fieldName, decodeURIComponent(supporterDetails[fieldName]));
                this.logger.log(`Setting "${fieldName}" to "${decodeURIComponent(supporterDetails[fieldName])}"`);
            });
        });
    }
    /*
    * Get the supporter details from the form fields
    */
    getSupporterDetailsFromFields() {
        const supporterDetails = {};
        this.options.fields.forEach((fieldName) => {
            let field = document.querySelector(`[name="${fieldName}"]`);
            // If it is a radio or checkbox, get the checked value
            if (field) {
                if (field.type === "radio" || field.type === "checkbox") {
                    field = document.querySelector(`[name="${fieldName}"]:checked`);
                }
                supporterDetails[fieldName] = encodeURIComponent(field.value);
            }
        });
        return supporterDetails;
    }
    /*
     * Encrypt the supporter details
     */
    encryptSupporterDetails(supporterDetails) {
        return __awaiter(this, void 0, void 0, function* () {
            const encryptionKey = yield this.createEncryptionKey(this.getSeed());
            const iv = window.crypto.getRandomValues(new Uint8Array(12));
            const supporterDetailsString = JSON.stringify(supporterDetails);
            const encryptedData = yield window.crypto.subtle.encrypt({
                name: "AES-GCM",
                iv: iv,
            }, encryptionKey, new TextEncoder().encode(supporterDetailsString));
            return {
                encryptedData: this.arrayBufferToBase64(encryptedData),
                iv: this.arrayBufferToBase64(iv),
            };
        });
    }
    /*
     * Decrypt the supporter details
     */
    decryptSupporterDetails(encryptedSupporterDetails, iv) {
        return __awaiter(this, void 0, void 0, function* () {
            const encryptionKey = yield this.createEncryptionKey(this.getSeed());
            const decryptedData = yield window.crypto.subtle.decrypt({ name: "AES-GCM", iv: iv }, encryptionKey, encryptedSupporterDetails);
            return new TextDecoder().decode(decryptedData);
        });
    }
    /*
     * Create the encryption key
     */
    createEncryptionKey(seed) {
        return __awaiter(this, void 0, void 0, function* () {
            const encoder = new TextEncoder();
            const keyMaterial = yield window.crypto.subtle.importKey("raw", encoder.encode(seed), { name: "PBKDF2" }, false, ["deriveKey"]);
            return yield window.crypto.subtle.deriveKey({
                name: "PBKDF2",
                salt: encoder.encode(seed),
                iterations: 100000,
                hash: "SHA-256",
            }, keyMaterial, { name: "AES-GCM", length: 256 }, false, ["encrypt", "decrypt"]);
        });
    }
    /*
     * Convert an ArrayBuffer to a base64 string
     */
    arrayBufferToBase64(buffer) {
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
    base64ToArrayBuffer(base64) {
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
    getSeed() {
        const url = new URL(window.location.href);
        return url.origin + url.pathname + (url.searchParams.get("ea.tracking.id") ? `?ea.tracking.id=${url.searchParams.get("ea.tracking.id")}` : '');
    }
}
