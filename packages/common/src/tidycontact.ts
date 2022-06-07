import { EnForm, ENGrid, EngridLogger } from "./";
import { Options } from "./interfaces/options";

export class TidyContact {
  private logger: EngridLogger = new EngridLogger(
    "TidyContact",
    "#FFFFFF",
    "#4d9068",
    "📧"
  );
  private endpoint = "https://api.tidycontact.io";
  private wasCalled = false; // True if the API endpoint was called
  private httpStatus: number = 0;
  private timeout = 5; // Seconds to API Timeout
  private isDirty = false; // True if the address was changed by the user

  private options: Options["TidyContact"];

  private _form: EnForm = EnForm.getInstance();

  constructor() {
    this.options = ENGrid.getOption("TidyContact") as Options["TidyContact"];
    if (this.options === false) return;
    this.loadOptions();
    if (!this.hasAddressFields()) {
      this.logger.log("No address fields found");
      return;
    }
    this.createFields();
    this.addEventListeners();
    if (
      ENGrid.checkNested(
        window.EngagingNetworks,
        "require",
        "_defined",
        "enjs",
        "checkSubmissionFailed"
      ) &&
      !window.EngagingNetworks.require._defined.enjs.checkSubmissionFailed() &&
      ENGrid.getFieldValue(this.options?.address_fields?.address1 as string) !=
        ""
    ) {
      this.logger.log("Address Field is not empty");
      this.isDirty = true;
    }
  }
  private loadOptions() {
    if (this.options && !this.options.address_fields) {
      this.options.address_fields = {
        address1: "supporter.address1", // Address Field 1
        address2: "supporter.address2", // Address Field 2
        address3: "supporter.address3", // Address Field 3 - This is only used for field creation
        city: "supporter.city", // City field
        region: "supporter.region", // State field
        postalCode: "supporter.postcode", // Zipcode field
        country: "supporter.country", // Country field
      };
    }
  }
  private createFields() {
    if (!this.options) return;
    // Creating Latitude and Longitude fields
    const latitudeField = ENGrid.getField(
      "supporter.geo.latitude"
    ) as HTMLInputElement;
    const longitudeField = ENGrid.getField(
      "supporter.geo.longitude"
    ) as HTMLInputElement;
    if (!latitudeField) {
      ENGrid.createHiddenInput("supporter.geo.latitude", "");
      this.logger.log("Creating Hidden Field: supporter.geo.latitude");
    }
    if (!longitudeField) {
      ENGrid.createHiddenInput("supporter.geo.longitude", "");
      this.logger.log("Creating Hidden Field: supporter.geo.longitude");
    }
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
    if (!ENGrid.getField(this.options.address_fields?.address2 as string)) {
      ENGrid.createHiddenInput(
        this.options.address_fields?.address2 as string,
        ""
      );
      this.logger.log(
        "Creating Hidden Field: " + this.options.address_fields?.address2
      );
    }
    if (!ENGrid.getField(this.options.address_fields?.address3 as string)) {
      ENGrid.createHiddenInput(
        this.options.address_fields?.address3 as string,
        ""
      );
      this.logger.log(
        "Creating Hidden Field: " + this.options.address_fields?.address3
      );
    }
  }
  private addEventListeners() {
    if (!this.options) return;
    // Add event listeners to fields
    if (this.options.address_fields) {
      for (const [key, value] of Object.entries(this.options.address_fields)) {
        const field = ENGrid.getField(value) as HTMLInputElement;
        if (!field) continue;
        field.addEventListener("change", () => {
          this.logger.log("Changed " + field.name, true);
          this.isDirty = true;
        });
      }
    }
    // Add event listener to submit
    this._form.onSubmit.subscribe(this.callAPI.bind(this));
  }
  private async checkSum(str: string) {
    // encode as UTF-8
    const msgBuffer = new TextEncoder().encode(str);

    // hash the message
    const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);

    // convert ArrayBuffer to Array
    const hashArray = Array.from(new Uint8Array(hashBuffer));

    // convert bytes to hex string
    const hashHex = hashArray
      .map((b) => ("00" + b.toString(16)).slice(-2))
      .join("");
    return hashHex;
  }
  private todaysDate() {
    return new Date()
      .toLocaleString("en-ZA", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      })
      .replace(/\/+/g, ""); // Format date as YYYYMMDD
  }
  private countryAllowed(country: string): boolean {
    if (!this.options) return false;
    return !!this.options.countries?.includes(country.toLowerCase());
  }
  private fetchTimeOut(url: RequestInfo, params?: RequestInit) {
    const abort = new AbortController();
    const signal = abort.signal;
    params = { ...params, signal };
    const promise = fetch(url, params);
    if (signal) signal.addEventListener("abort", () => abort.abort());
    const timeout = setTimeout(() => abort.abort(), this.timeout * 1000);
    return promise.finally(() => clearTimeout(timeout));
  }
  private writeError(error: string) {
    if (!this.options) return;
    const recordField = ENGrid.getField(
      this.options.record_field as string
    ) as HTMLInputElement;
    const dateField = ENGrid.getField(
      this.options.date_field as string
    ) as HTMLInputElement;
    const statusField = ENGrid.getField(
      this.options.status_field as string
    ) as HTMLInputElement;
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
        error: typeof error === "string" ? error : errorType.toUpperCase(),
      };
      recordField.value = JSON.stringify(errorData);
    }
    if (dateField) {
      dateField.value = this.todaysDate();
    }
    if (statusField) {
      statusField.value = "ERROR-API";
    }
  }
  private setFields(data: { [key: string]: any }) {
    if (!this.options) return {};
    let response: { [key: string]: {} } = {};
    const country = this.getCountry();
    const postalCodeValue = ENGrid.getFieldValue(
      this.options.address_fields?.postalCode as string
    ) as string;
    const zipDivider = this.options.us_zip_divider ?? "+";
    // Check if there's no address2 field
    const address2Field = ENGrid.getField(
      this.options.address_fields?.address2 as string
    );
    if ("address2" in data && !address2Field) {
      const address = ENGrid.getFieldValue(
        this.options.address_fields?.address1 as string
      );
      if (address == data.address1 + " " + data.address2) {
        delete data.address1;
        delete data.address2;
      } else {
        data.address1 = data.address1 + " " + data.address2;
        delete data.address2;
      }
    }
    if (
      "postalCode" in data &&
      postalCodeValue.replace("+", zipDivider) ===
        data.postalCode.replace("+", zipDivider)
    ) {
      // Postal code is the same
      delete data.postalCode;
    }
    // Set the fields
    for (const key in data) {
      const fieldKey =
        this.options.address_fields &&
        Object.keys(this.options.address_fields).includes(key)
          ? this.options.address_fields[key as keyof Options["TidyContact"]]
          : key;
      const field = ENGrid.getField(fieldKey) as HTMLInputElement;
      if (field) {
        let value = data[key];
        if (
          key === "postalCode" &&
          ["US", "USA", "United States"].includes(country)
        ) {
          value = value.replace("+", zipDivider) ?? ""; // Replace the "+" with the zip divider
        }
        response[key] = { from: field.value, to: value };
        this.logger.log(`Set ${field.name} to ${value} (${field.value})`);
        ENGrid.setFieldValue(fieldKey, value);
      } else {
        this.logger.log(`Field ${key} not found`);
      }
    }
    return response;
  }
  private hasAddressFields(): boolean {
    if (!this.options) return false;
    const address1 = ENGrid.getField(
      this.options.address_fields?.address1 as string
    );
    const address2 = ENGrid.getField(
      this.options.address_fields?.address2 as string
    );
    const city = ENGrid.getField(this.options.address_fields?.city as string);
    const region = ENGrid.getField(
      this.options.address_fields?.region as string
    );
    const postalCode = ENGrid.getField(
      this.options.address_fields?.postalCode as string
    );
    const country = ENGrid.getField(
      this.options.address_fields?.country as string
    );
    return !!(address1 || address2 || city || region || postalCode || country);
  }
  private canUseAPI(): boolean {
    if (!this.options) return false;
    const country = !!this.getCountry();
    const address1 = !!ENGrid.getFieldValue(
      this.options.address_fields?.address1 as string
    );
    const city = !!ENGrid.getFieldValue(
      this.options.address_fields?.city as string
    );
    const region = !!ENGrid.getFieldValue(
      this.options.address_fields?.region as string
    );
    const postalCode = !!ENGrid.getFieldValue(
      this.options.address_fields?.postalCode as string
    );
    if (country && address1) {
      return (city && region) || postalCode;
    }
    return false;
  }
  private getCountry(): string {
    if (!this.options) return "";
    const countryFallback = this.options.country_fallback ?? "";
    const country = ENGrid.getFieldValue(
      this.options.address_fields?.country as string
    );
    return country || countryFallback.toUpperCase();
  }

  private callAPI() {
    if (!this.options) return;
    if (!this.isDirty || this.wasCalled) return;
    if (!this._form.submit) {
      this.logger.log("Form Submission Interrupted by Other Component");
      return;
    }
    const recordField = ENGrid.getField(
      this.options.record_field as string
    ) as HTMLInputElement;
    const dateField = ENGrid.getField(
      this.options.date_field as string
    ) as HTMLInputElement;
    const statusField = ENGrid.getField(
      this.options.status_field as string
    ) as HTMLInputElement;
    const latitudeField = ENGrid.getField(
      "supporter.geo.latitude"
    ) as HTMLInputElement;
    const longitudeField = ENGrid.getField(
      "supporter.geo.longitude"
    ) as HTMLInputElement;
    if (!this.canUseAPI()) {
      this.logger.log("Not Enough Data to Call API");
      if (dateField) {
        dateField.value = this.todaysDate();
      }
      if (statusField) {
        statusField.value = "PARTIALADDRESS";
      }
      return true;
    }
    // Call the API
    const address1 = ENGrid.getFieldValue(
      this.options.address_fields?.address1 as string
    );
    const address2 = ENGrid.getFieldValue(
      this.options.address_fields?.address2 as string
    );
    const city = ENGrid.getFieldValue(
      this.options.address_fields?.city as string
    );
    const region = ENGrid.getFieldValue(
      this.options.address_fields?.region as string
    );
    const postalCode = ENGrid.getFieldValue(
      this.options.address_fields?.postalCode as string
    );
    const country = this.getCountry();
    if (!this.countryAllowed(country)) {
      this.logger.log("Country not allowed: " + country);
      if (recordField) {
        let record: { [key: string]: any } = {};
        record = Object.assign(
          { date: this.todaysDate(), status: "DISALLOWED" },
          record
        );
        recordField.value = JSON.stringify(record);
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
      .then(async (data) => {
        this.logger.log("callAPI response", JSON.parse(JSON.stringify(data)));
        if (data.valid === true) {
          let record: { [key: string]: any } = {};
          if ("changed" in data) {
            record = this.setFields(data.changed);
          }
          record["formData"] = formData;
          await this.checkSum(JSON.stringify(record)).then((checksum) => {
            this.logger.log("Checksum", checksum);
            record["requestId"] = data.requestId; // We don't want to add the requestId to the checksum
            record["checksum"] = checksum;
          });
          if ("latitude" in data) {
            latitudeField.value = data.latitude;
            record["latitude"] = data.latitude;
          }
          if ("longitude" in data) {
            longitudeField.value = data.longitude;
            record["longitude"] = data.longitude;
          }
          if (recordField) {
            record = Object.assign(
              { date: this.todaysDate(), status: "SUCCESS" },
              record
            );
            recordField.value = JSON.stringify(record);
          }
          if (dateField) {
            dateField.value = this.todaysDate();
          }
          if (statusField) {
            statusField.value = "SUCCESS";
          }
        } else {
          let record: { [key: string]: any } = {};
          record["formData"] = formData;
          await this.checkSum(JSON.stringify(record)).then((checksum) => {
            this.logger.log("Checksum", checksum);
            record["requestId"] = data.requestId; // We don't want to add the requestId to the checksum
            record["checksum"] = checksum;
          });
          if (recordField) {
            record = Object.assign(
              { date: this.todaysDate(), status: "ERROR" },
              record
            );
            recordField.value = JSON.stringify(record);
          }
          if (dateField) {
            dateField.value = this.todaysDate();
          }
          if (statusField) {
            statusField.value =
              "error" in data ? `ERROR: ` + data.error : "INVALID ADDRESS";
          }
        }
      })
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
