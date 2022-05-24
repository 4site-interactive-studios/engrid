var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { EnForm, ENGrid, EngridLogger } from "./";
export class TidyContact {
    constructor() {
        var _a, _b;
        this.logger = new EngridLogger("TidyContact", "#FFFFFF", "#4d9068", "📧");
        this.endpoint = "https://api.tidycontact.io";
        this.wasCalled = false; // True if the API endpoint was called
        this.httpStatus = 0;
        this.timeout = 5; // Seconds to API Timeout
        this.isDirty = false; // True if the address was changed by the user
        this._form = EnForm.getInstance();
        this.options = ENGrid.getOption("TidyContact");
        if (this.options === false)
            return;
        this.loadOptions();
        this.createFields();
        this.addEventListeners();
        if (ENGrid.checkNested(window.EngagingNetworks, "require", "_defined", "enjs", "checkSubmissionFailed") &&
            !window.EngagingNetworks.require._defined.enjs.checkSubmissionFailed() &&
            ENGrid.getFieldValue((_b = (_a = this.options) === null || _a === void 0 ? void 0 : _a.address_fields) === null || _b === void 0 ? void 0 : _b.address1) !=
                "") {
            this.logger.log("Address Field is not empty");
            this.isDirty = true;
        }
    }
    loadOptions() {
        if (this.options && !this.options.address_fields) {
            this.options.address_fields = {
                address1: "supporter.address1",
                address2: "supporter.address2",
                address3: "supporter.address3",
                city: "supporter.city",
                region: "supporter.region",
                postalCode: "supporter.postcode",
                country: "supporter.country", // Country field
            };
        }
    }
    createFields() {
        var _a, _b, _c, _d, _e, _f;
        if (!this.options)
            return;
        if (this.options.record_field) {
            const recordField = ENGrid.getField(this.options.record_field);
            if (!recordField) {
                ENGrid.createHiddenInput(this.options.record_field, "");
                this.logger.log("Creating Hidden Field: " + this.options.record_field);
            }
        }
        if (this.options.date_field) {
            const dateField = ENGrid.getField(this.options.date_field);
            if (!dateField) {
                ENGrid.createHiddenInput(this.options.date_field, "");
                this.logger.log("Creating Hidden Field: " + this.options.date_field);
            }
        }
        if (this.options.status_field) {
            const statusField = ENGrid.getField(this.options.status_field);
            if (!statusField) {
                ENGrid.createHiddenInput(this.options.status_field, "");
                this.logger.log("Creating Hidden Field: " + this.options.status_field);
            }
        }
        // If there's no Address 2 or Address 3 field, create them
        if (!ENGrid.getField((_a = this.options.address_fields) === null || _a === void 0 ? void 0 : _a.address2)) {
            ENGrid.createHiddenInput((_b = this.options.address_fields) === null || _b === void 0 ? void 0 : _b.address2, "");
            this.logger.log("Creating Hidden Field: " + ((_c = this.options.address_fields) === null || _c === void 0 ? void 0 : _c.address2));
        }
        if (!ENGrid.getField((_d = this.options.address_fields) === null || _d === void 0 ? void 0 : _d.address3)) {
            ENGrid.createHiddenInput((_e = this.options.address_fields) === null || _e === void 0 ? void 0 : _e.address3, "");
            this.logger.log("Creating Hidden Field: " + ((_f = this.options.address_fields) === null || _f === void 0 ? void 0 : _f.address3));
        }
    }
    addEventListeners() {
        if (!this.options)
            return;
        // Add event listeners to fields
        if (this.options.address_fields) {
            for (const [key, value] of Object.entries(this.options.address_fields)) {
                const field = ENGrid.getField(value);
                if (!field)
                    continue;
                field.addEventListener("change", () => {
                    this.logger.log("Changed " + field.name, true);
                    this.isDirty = true;
                });
            }
        }
        // Add event listener to submit
        this._form.onSubmit.subscribe(this.callAPI.bind(this));
    }
    checkSum(str) {
        return __awaiter(this, void 0, void 0, function* () {
            // encode as UTF-8
            const msgBuffer = new TextEncoder().encode(str);
            // hash the message
            const hashBuffer = yield crypto.subtle.digest("SHA-256", msgBuffer);
            // convert ArrayBuffer to Array
            const hashArray = Array.from(new Uint8Array(hashBuffer));
            // convert bytes to hex string
            const hashHex = hashArray
                .map((b) => ("00" + b.toString(16)).slice(-2))
                .join("");
            return hashHex;
        });
    }
    todaysDate() {
        return new Date()
            .toLocaleString("en-ZA", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
        })
            .replace(/\/+/g, ""); // Format date as YYYYMMDD
    }
    countryAllowed(country) {
        var _a;
        if (!this.options)
            return false;
        return !!((_a = this.options.countries) === null || _a === void 0 ? void 0 : _a.includes(country.toLowerCase()));
    }
    fetchTimeOut(url, params) {
        const abort = new AbortController();
        const signal = abort.signal;
        params = Object.assign(Object.assign({}, params), { signal });
        const promise = fetch(url, params);
        if (signal)
            signal.addEventListener("abort", () => abort.abort());
        const timeout = setTimeout(() => abort.abort(), this.timeout * 1000);
        return promise.finally(() => clearTimeout(timeout));
    }
    writeError(error) {
        if (!this.options)
            return;
        const recordField = ENGrid.getField(this.options.record_field);
        const dateField = ENGrid.getField(this.options.date_field);
        const statusField = ENGrid.getField(this.options.status_field);
        if (recordField) {
            let errorType = "";
            switch (this.httpStatus) {
                case 400:
                    errorType = "Bad Request";
                    break;
                case 401:
                    errorType = "Unauthorized";
                    break;
                case 403:
                    errorType = "Forbidden";
                    break;
                case 404:
                    errorType = "Not Found";
                    break;
                case 408:
                    errorType = "API Request Timeout";
                    break;
                case 500:
                    errorType = "Internal Server Error";
                    break;
                case 503:
                    errorType = "Service Unavailable";
                    break;
                default:
                    errorType = "Unknown Error";
                    break;
            }
            const errorData = {
                status: this.httpStatus,
                error: typeof error === "string" ? error : errorType,
            };
            recordField.value = JSON.stringify(errorData);
        }
        if (dateField) {
            dateField.value = this.todaysDate();
        }
        if (statusField) {
            statusField.value = "API Error";
        }
    }
    setFields(data) {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        if (!this.options)
            return {};
        let response = {};
        const countryValue = ENGrid.getFieldValue((_a = this.options.address_fields) === null || _a === void 0 ? void 0 : _a.country);
        const postalCodeValue = ENGrid.getFieldValue((_b = this.options.address_fields) === null || _b === void 0 ? void 0 : _b.postalCode);
        // Check if there's no address2 field
        const address2Field = ENGrid.getField((_c = this.options.address_fields) === null || _c === void 0 ? void 0 : _c.address2);
        if ("address2" in data && !address2Field) {
            const address = ENGrid.getFieldValue((_d = this.options.address_fields) === null || _d === void 0 ? void 0 : _d.address1);
            if (address == data.address1 + " " + data.address2) {
                delete data.address1;
                delete data.address2;
            }
            else {
                data.address1 = data.address1 + " " + data.address2;
                delete data.address2;
            }
        }
        if ("postalCode" in data &&
            ((_e = postalCodeValue.match(/\d+/g)) === null || _e === void 0 ? void 0 : _e.join("")) ===
                ((_f = data.postalCode.match(/\d+/g)) === null || _f === void 0 ? void 0 : _f.join(""))) {
            // Postal code is the same
            delete data.postalCode;
        }
        // Set the fields
        for (const key in data) {
            const fieldKey = this.options.address_fields &&
                Object.keys(this.options.address_fields).includes(key)
                ? this.options.address_fields[key]
                : key;
            const field = ENGrid.getField(fieldKey);
            if (field) {
                let value = data[key];
                if (key === "postalCode" &&
                    ["US", "USA", "United States"].includes(countryValue)) {
                    value = (_h = (_g = value.match(/\d+/g)) === null || _g === void 0 ? void 0 : _g.join("")) !== null && _h !== void 0 ? _h : ""; // Remove all non-numeric characters
                }
                response[key] = { from: field.value, to: value };
                this.logger.log(`Set ${field.name} to ${value} (${field.value})`);
                ENGrid.setFieldValue(fieldKey, value);
            }
            else {
                this.logger.log(`Field ${key} not found`);
            }
        }
        return response;
    }
    callAPI() {
        var _a, _b, _c, _d, _e, _f;
        if (!this.options)
            return;
        if (!this.isDirty || this.wasCalled)
            return;
        if (!this._form.submit) {
            this.logger.log("Form Submission Interrupted by Other Component");
            return;
        }
        const recordField = ENGrid.getField(this.options.record_field);
        const dateField = ENGrid.getField(this.options.date_field);
        const statusField = ENGrid.getField(this.options.status_field);
        // Call the API
        const address1 = ENGrid.getFieldValue((_a = this.options.address_fields) === null || _a === void 0 ? void 0 : _a.address1);
        const address2 = ENGrid.getFieldValue((_b = this.options.address_fields) === null || _b === void 0 ? void 0 : _b.address2);
        const city = ENGrid.getFieldValue((_c = this.options.address_fields) === null || _c === void 0 ? void 0 : _c.city);
        const region = ENGrid.getFieldValue((_d = this.options.address_fields) === null || _d === void 0 ? void 0 : _d.region);
        const postalCode = ENGrid.getFieldValue((_e = this.options.address_fields) === null || _e === void 0 ? void 0 : _e.postalCode);
        const country = ENGrid.getFieldValue((_f = this.options.address_fields) === null || _f === void 0 ? void 0 : _f.country);
        if (!this.countryAllowed(country)) {
            this.logger.log("Country not allowed: " + country);
            if (recordField) {
                recordField.value = "DISALLOWED";
            }
            if (dateField) {
                dateField.value = this.todaysDate();
            }
            if (statusField) {
                statusField.value = "DISALLOWED";
            }
            return true;
        }
        const formData = {
            address1,
            address2,
            city,
            region,
            postalCode,
            country,
            url: window.location.href,
            cid: this.options.cid,
        };
        this.wasCalled = true;
        this.logger.log("FormData", JSON.parse(JSON.stringify(formData)));
        const ret = this.fetchTimeOut(this.endpoint, {
            headers: { "Content-Type": "application/json; charset=utf-8" },
            method: "POST",
            body: JSON.stringify(formData),
        })
            .then((response) => {
            this.httpStatus = response.status;
            return response.json();
        })
            .then((data) => __awaiter(this, void 0, void 0, function* () {
            this.logger.log("callAPI response", JSON.parse(JSON.stringify(data)));
            if ("changed" in data && data.valid === true) {
                let record = this.setFields(data.changed);
                record["formData"] = formData;
                yield this.checkSum(JSON.stringify(record)).then((checksum) => {
                    this.logger.log("Checksum", checksum);
                    record["requestId"] = data.requestId; // We don't want to add the requestId to the checksum
                    record["checksum"] = checksum;
                });
                if (recordField) {
                    recordField.value = JSON.stringify(record);
                }
                if (dateField) {
                    dateField.value = this.todaysDate();
                }
                if (statusField) {
                    statusField.value = "Success";
                }
            }
            else if ("error" in data) {
                let record = {};
                record["formData"] = formData;
                yield this.checkSum(JSON.stringify(record)).then((checksum) => {
                    this.logger.log("Checksum", checksum);
                    record["requestId"] = data.requestId; // We don't want to add the requestId to the checksum
                    record["checksum"] = checksum;
                });
                if (recordField) {
                    recordField.value = JSON.stringify(record);
                }
                if (dateField) {
                    dateField.value = this.todaysDate();
                }
                if (statusField) {
                    statusField.value = data.error;
                }
            }
        }))
            .catch((error) => {
            if (error.toString().includes("AbortError")) {
                // fetch aborted due to timeout
                this.logger.log("Fetch aborted");
                this.httpStatus = 408;
            }
            // network error or json parsing error
            this.writeError(error);
        });
        this._form.submitPromise = ret;
        return ret;
    }
}
