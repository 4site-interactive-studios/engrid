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

  private countries_list = [
    ["Afghanistan", "af", "93", "070 123 4567"],
    ["Albania", "al", "355", "067 212 3456"],
    ["Algeria", "dz", "213", "0551 23 45 67"],
    ["American Samoa", "as", "1", "(684) 733-1234"],
    ["Andorra", "ad", "376", "312 345"],
    ["Angola", "ao", "244", "923 123 456"],
    ["Anguilla", "ai", "1", "(264) 235-1234"],
    ["Antigua and Barbuda", "ag", "1", "(268) 464-1234"],
    ["Argentina", "ar", "54", "011 15-2345-6789"],
    ["Armenia", "am", "374", "077 123456"],
    ["Aruba", "aw", "297", "560 1234"],
    ["Australia", "au", "61", "0412 345 678"],
    ["Austria", "at", "43", "0664 123456"],
    ["Azerbaijan", "az", "994", "040 123 45 67"],
    ["Bahamas", "bs", "1", "(242) 359-1234"],
    ["Bahrain", "bh", "973", "3600 1234"],
    ["Bangladesh", "bd", "880", "01812-345678"],
    ["Barbados", "bb", "1", "(246) 250-1234"],
    ["Belarus", "by", "375", "8 029 491-19-11"],
    ["Belgium", "be", "32", "0470 12 34 56"],
    ["Belize", "bz", "501", "622-1234"],
    ["Benin", "bj", "229", "90 01 12 34"],
    ["Bermuda", "bm", "1", "(441) 370-1234"],
    ["Bhutan", "bt", "975", "17 12 34 56"],
    ["Bolivia", "bo", "591", "71234567"],
    ["Bosnia and Herzegovina", "ba", "387", "061 123 456"],
    ["Botswana", "bw", "267", "71 123 456"],
    ["Brazil", "br", "55", "(11) 96123-4567"],
    ["British Indian Ocean Territory", "io", "246", "380 1234"],
    ["British Virgin Islands", "vg", "1", "(284) 300-1234"],
    ["Brunei", "bn", "673", "712 3456"],
    ["Bulgaria", "bg", "359", "048 123 456"],
    ["Burkina Faso", "bf", "226", "70 12 34 56"],
    ["Burundi", "bi", "257", "79 56 12 34"],
    ["Cambodia", "kh", "855", "091 234 567"],
    ["Cameroon", "cm", "237", "6 71 23 45 67"],
    ["Canada", "ca", "1", "(506) 234-5678"],
    ["Cape Verde", "cv", "238", "991 12 34"],
    ["Caribbean Netherlands", "bq", "599", "318 1234"],
    ["Cayman Islands", "ky", "1", "(345) 323-1234"],
    ["Central African Republic", "cf", "236", "70 01 23 45"],
    ["Chad", "td", "235", "63 01 23 45"],
    ["Chile", "cl", "56", "(2) 2123 4567"],
    ["China", "cn", "86", "131 2345 6789"],
    ["Christmas Island", "cx", "61", "0412 345 678"],
    ["Cocos Islands", "cc", "61", "0412 345 678"],
    ["Colombia", "co", "57", "321 1234567"],
    ["Comoros", "km", "269", "321 23 45"],
    ["Congo", "cd", "243", "0991 234 567"],
    ["Congo", "cg", "242", "06 123 4567"],
    ["Cook Islands", "ck", "682", "71 234"],
    ["Costa Rica", "cr", "506", "8312 3456"],
    ["Côte d’Ivoire", "ci", "225", "01 23 45 6789"],
    ["Croatia", "hr", "385", "092 123 4567"],
    ["Cuba", "cu", "53", "05 1234567"],
    ["Curaçao", "cw", "599", "9 518 1234"],
    ["Cyprus", "cy", "357", "96 123456"],
    ["Czech Republic", "cz", "420", "601 123 456"],
    ["Denmark", "dk", "45", "32 12 34 56"],
    ["Djibouti", "dj", "253", "77 83 10 01"],
    ["Dominica", "dm", "1", "(767) 225-1234"],
    ["Dominican Republic", "do", "1", "(809) 234-5678"],
    ["Ecuador", "ec", "593", "099 123 4567"],
    ["Egypt", "eg", "20", "0100 123 4567"],
    ["El Salvador", "sv", "503", "7012 3456"],
    ["Equatorial Guinea", "gq", "240", "222 123 456"],
    ["Eritrea", "er", "291", "07 123 456"],
    ["Estonia", "ee", "372", "5123 4567"],
    ["Eswatini", "sz", "268", "7612 3456"],
    ["Ethiopia", "et", "251", "091 123 4567"],
    ["Falkland Islands", "fk", "500", "51234"],
    ["Faroe Islands", "fo", "298", "211234"],
    ["Fiji", "fj", "679", "701 2345"],
    ["Finland", "fi", "358", "041 2345678"],
    ["France", "fr", "33", "06 12 34 56 78"],
    ["French Guiana", "gf", "594", "0694 20 12 34"],
    ["French Polynesia", "pf", "689", "87 12 34 56"],
    ["Gabon", "ga", "241", "06 03 12 34"],
    ["Gambia", "gm", "220", "301 2345"],
    ["Georgia", "ge", "995", "555 12 34 56"],
    ["Germany", "de", "49", "01512 3456789"],
    ["Ghana", "gh", "233", "023 123 4567"],
    ["Gibraltar", "gi", "350", "57123456"],
    ["Greece", "gr", "30", "691 234 5678"],
    ["Greenland", "gl", "299", "22 12 34"],
    ["Grenada", "gd", "1", "(473) 403-1234"],
    ["Guadeloupe", "gp", "590", "0690 00 12 34"],
    ["Guam", "gu", "1", "(671) 300-1234"],
    ["Guatemala", "gt", "502", "5123 4567"],
    ["Guernsey", "gg", "44", "07781 123456"],
    ["Guinea", "gn", "224", "601 12 34 56"],
    ["Guinea-Bissau", "gw", "245", "955 012 345"],
    ["Guyana", "gy", "592", "609 1234"],
    ["Haiti", "ht", "509", "34 10 1234"],
    ["Honduras", "hn", "504", "9123-4567"],
    ["Hong Kong", "hk", "852", "5123 4567"],
    ["Hungary", "hu", "36", "06 20 123 4567"],
    ["Iceland", "is", "354", "611 1234"],
    ["India", "in", "91", "081234 56789"],
    ["Indonesia", "id", "62", "0812-345-678"],
    ["Iran", "ir", "98", "0912 345 6789"],
    ["Iraq", "iq", "964", "0791 234 5678"],
    ["Ireland", "ie", "353", "085 012 3456"],
    ["Isle of Man", "im", "44", "07924 123456"],
    ["Israel", "il", "972", "050-234-5678"],
    ["Italy", "it", "39", "312 345 6789"],
    ["Jamaica", "jm", "1", "(876) 210-1234"],
    ["Japan", "jp", "81", "090-1234-5678"],
    ["Jersey", "je", "44", "07797 712345"],
    ["Jordan", "jo", "962", "07 9012 3456"],
    ["Kazakhstan", "kz", "7", "8 (771) 000 9998"],
    ["Kenya", "ke", "254", "0712 123456"],
    ["Kiribati", "ki", "686", "72001234"],
    ["Kosovo", "xk", "383", "043 201 234"],
    ["Kuwait", "kw", "965", "500 12345"],
    ["Kyrgyzstan", "kg", "996", "0700 123 456"],
    ["Laos", "la", "856", "020 23 123 456"],
    ["Latvia", "lv", "371", "21 234 567"],
    ["Lebanon", "lb", "961", "71 123 456"],
    ["Lesotho", "ls", "266", "5012 3456"],
    ["Liberia", "lr", "231", "077 012 3456"],
    ["Libya", "ly", "218", "091-2345678"],
    ["Liechtenstein", "li", "423", "660 234 567"],
    ["Lithuania", "lt", "370", "(8-612) 34567"],
    ["Luxembourg", "lu", "352", "628 123 456"],
    ["Macau", "mo", "853", "6612 3456"],
    ["North Macedonia", "mk", "389", "072 345 678"],
    ["Madagascar", "mg", "261", "032 12 345 67"],
    ["Malawi", "mw", "265", "0991 23 45 67"],
    ["Malaysia", "my", "60", "012-345 6789"],
    ["Maldives", "mv", "960", "771-2345"],
    ["Mali", "ml", "223", "65 01 23 45"],
    ["Malta", "mt", "356", "9696 1234"],
    ["Marshall Islands", "mh", "692", "235-1234"],
    ["Martinique", "mq", "596", "0696 20 12 34"],
    ["Mauritania", "mr", "222", "22 12 34 56"],
    ["Mauritius", "mu", "230", "5251 2345"],
    ["Mayotte", "yt", "262", "0639 01 23 45"],
    ["Mexico", "mx", "52", "222 123 4567"],
    ["Micronesia", "fm", "691", "350 1234"],
    ["Moldova", "md", "373", "0621 12 345"],
    ["Monaco", "mc", "377", "06 12 34 56 78"],
    ["Mongolia", "mn", "976", "8812 3456"],
    ["Montenegro", "me", "382", "067 622 901"],
    ["Montserrat", "ms", "1", "(664) 492-3456"],
    ["Morocco", "ma", "212", "0650-123456"],
    ["Mozambique", "mz", "258", "82 123 4567"],
    ["Myanmar", "mm", "95", "09 212 3456"],
    ["Namibia", "na", "264", "081 123 4567"],
    ["Nauru", "nr", "674", "555 1234"],
    ["Nepal", "np", "977", "984-1234567"],
    ["Netherlands", "nl", "31", "06 12345678"],
    ["New Caledonia", "nc", "687", "75.12.34"],
    ["New Zealand", "nz", "64", "021 123 4567"],
    ["Nicaragua", "ni", "505", "8123 4567"],
    ["Niger", "ne", "227", "93 12 34 56"],
    ["Nigeria", "ng", "234", "0802 123 4567"],
    ["Niue", "nu", "683", "888 4012"],
    ["Norfolk Island", "nf", "672", "3 81234"],
    ["North Korea", "kp", "850", "0192 123 4567"],
    ["Northern Mariana Islands", "mp", "1", "(670) 234-5678"],
    ["Norway", "no", "47", "406 12 345"],
    ["Oman", "om", "968", "9212 3456"],
    ["Pakistan", "pk", "92", "0301 2345678"],
    ["Palau", "pw", "680", "620 1234"],
    ["Palestine", "ps", "970", "0599 123 456"],
    ["Panama", "pa", "507", "6123-4567"],
    ["Papua New Guinea", "pg", "675", "7012 3456"],
    ["Paraguay", "py", "595", "0961 456789"],
    ["Peru", "pe", "51", "912 345 678"],
    ["Philippines", "ph", "63", "0905 123 4567"],
    ["Poland", "pl", "48", "512 345 678"],
    ["Portugal", "pt", "351", "912 345 678"],
    ["Puerto Rico", "pr", "1", "(787) 234-5678"],
    ["Qatar", "qa", "974", "3312 3456"],
    ["Réunion", "re", "262", "0692 12 34 56"],
    ["Romania", "ro", "40", "0712 034 567"],
    ["Russia", "ru", "7", "8 (912) 345-67-89"],
    ["Rwanda", "rw", "250", "0720 123 456"],
    ["Saint Barthélemy", "bl", "590", "0690 00 12 34"],
    ["Saint Helena", "sh", "290", "51234"],
    ["Saint Kitts and Nevis", "kn", "1", "(869) 765-2917"],
    ["Saint Lucia", "lc", "1", "(758) 284-5678"],
    ["Saint Martin", "mf", "590", "0690 00 12 34"],
    ["Saint Pierre and Miquelon", "pm", "508", "055 12 34"],
    ["Saint Vincent and the Grenadines", "vc", "1", "(784) 430-1234"],
    ["Samoa", "ws", "685", "72 12345"],
    ["San Marino", "sm", "378", "66 66 12 12"],
    ["São Tomé and Príncipe", "st", "239", "981 2345"],
    ["Saudi Arabia", "sa", "966", "051 234 5678"],
    ["Senegal", "sn", "221", "70 123 45 67"],
    ["Serbia", "rs", "381", "060 1234567"],
    ["Seychelles", "sc", "248", "2 510 123"],
    ["Sierra Leone", "sl", "232", "(025) 123456"],
    ["Singapore", "sg", "65", "8123 4567"],
    ["Sint Maarten", "sx", "1", "(721) 520-5678"],
    ["Slovakia", "sk", "421", "0912 123 456"],
    ["Slovenia", "si", "386", "031 234 567"],
    ["Solomon Islands", "sb", "677", "74 21234"],
    ["Somalia", "so", "252", "7 1123456"],
    ["South Africa", "za", "27", "071 123 4567"],
    ["South Korea", "kr", "82", "010-2000-0000"],
    ["South Sudan", "ss", "211", "0977 123 456"],
    ["Spain", "es", "34", "612 34 56 78"],
    ["Sri Lanka", "lk", "94", "071 234 5678"],
    ["Sudan", "sd", "249", "091 123 1234"],
    ["Suriname", "sr", "597", "741-2345"],
    ["Svalbard and Jan Mayen", "sj", "47", "412 34 567"],
    ["Sweden", "se", "46", "070-123 45 67"],
    ["Switzerland", "ch", "41", "078 123 45 67"],
    ["Syria", "sy", "963", "0944 567 890"],
    ["Taiwan", "tw", "886", "0912 345 678"],
    ["Tajikistan", "tj", "992", "917 12 3456"],
    ["Tanzania", "tz", "255", "0621 234 567"],
    ["Thailand", "th", "66", "081 234 5678"],
    ["Timor-Leste", "tl", "670", "7721 2345"],
    ["Togo", "tg", "228", "90 11 23 45"],
    ["Tokelau", "tk", "690", "7290"],
    ["Tonga", "to", "676", "771 5123"],
    ["Trinidad and Tobago", "tt", "1", "(868) 291-1234"],
    ["Tunisia", "tn", "216", "20 123 456"],
    ["Turkey", "tr", "90", "0501 234 56 78"],
    ["Turkmenistan", "tm", "993", "8 66 123456"],
    ["Turks and Caicos Islands", "tc", "1", "(649) 231-1234"],
    ["Tuvalu", "tv", "688", "90 1234"],
    ["U.S. Virgin Islands", "vi", "1", "(340) 642-1234"],
    ["Uganda", "ug", "256", "0712 345678"],
    ["Ukraine", "ua", "380", "050 123 4567"],
    ["United Arab Emirates", "ae", "971", "050 123 4567"],
    ["United Kingdom", "gb", "44", "07400 123456"],
    ["United States", "us", "1", "(201) 555-0123"],
    ["Uruguay", "uy", "598", "094 231 234"],
    ["Uzbekistan", "uz", "998", "8 91 234 56 78"],
    ["Vanuatu", "vu", "678", "591 2345"],
    ["Vatican City", "va", "39", "312 345 6789"],
    ["Venezuela", "ve", "58", "0412-1234567"],
    ["Vietnam", "vn", "84", "091 234 56 78"],
    ["Wallis and Futuna", "wf", "681", "82 12 34"],
    ["Western Sahara", "eh", "212", "0650-123456"],
    ["Yemen", "ye", "967", "0712 345 678"],
    ["Zambia", "zm", "260", "095 5123456"],
    ["Zimbabwe", "zw", "263", "071 234 5678"],
    ["Åland Islands", "ax", "358", "041 2345678"],
  ];
  private countries_dropdown: HTMLDivElement | null = null;
  private country_ip = null;

  constructor() {
    this.options = ENGrid.getOption("TidyContact") as Options["TidyContact"];
    if (this.options === false || !this.options?.cid) return;
    this.loadOptions();
    if (!this.hasAddressFields() && !this.phoneEnabled()) {
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
    if (this.phoneEnabled()) {
      this.createPhoneFields();
      this.createPhoneMarginVariable();
      this.logger.log("Phone Standardization is enabled");
      if (this.countryDropDownEnabled()) {
        this.renderFlagsDropDown();
      }
      const phoneField = ENGrid.getField(
        this.options?.address_fields?.phone as string
      );
      if (phoneField) {
        phoneField.addEventListener("keyup", (e) => {
          this.handlePhoneInputKeydown(e);
        });
        this.setDefaultPhoneCountry();
      }
    }
  }
  private loadOptions() {
    if (this.options) {
      if (!this.options.address_fields) {
        this.options.address_fields = {
          address1: "supporter.address1", // Address Field 1
          address2: "supporter.address2", // Address Field 2
          address3: "supporter.address3", // Address Field 3 - This is only used for field creation
          city: "supporter.city", // City field
          region: "supporter.region", // State field
          postalCode: "supporter.postcode", // Zipcode field
          country: "supporter.country", // Country field
          phone: "supporter.phoneNumber2", // Phone field
        };
      }
      this.options.address_enable = this.options.address_enable ?? true;
      if (this.options.phone_enable) {
        this.options.phone_flags = this.options.phone_flags ?? true;
        this.options.phone_country_from_ip =
          this.options.phone_country_from_ip ?? true;
        this.options.phone_preferred_countries =
          this.options.phone_preferred_countries ?? [];
      }
    }
  }
  private createFields() {
    if (!this.options || !this.hasAddressFields()) return;
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
  private createPhoneFields() {
    if (!this.options) return;
    ENGrid.createHiddenInput("tc.phone.country", "");
    this.logger.log("Creating hidden field: tc.phone.country");
    if (this.options.phone_record_field) {
      const recordField = ENGrid.getField(this.options.phone_record_field);
      if (!recordField) {
        ENGrid.createHiddenInput(this.options.phone_record_field, "");
        this.logger.log(
          "Creating hidden field: " + this.options.phone_record_field
        );
      }
    }
    if (this.options.phone_date_field) {
      const dateField = ENGrid.getField(this.options.phone_date_field);
      if (!dateField) {
        ENGrid.createHiddenInput(this.options.phone_date_field, "");
        this.logger.log(
          "Creating hidden field: " + this.options.phone_date_field
        );
      }
    }
    if (this.options.phone_status_field) {
      const statusField = ENGrid.getField(this.options.phone_status_field);
      if (!statusField) {
        ENGrid.createHiddenInput(this.options.phone_status_field, "");
        this.logger.log(
          "Creating hidden field: " + this.options.phone_status_field
        );
      }
    }
  }
  private createPhoneMarginVariable() {
    if (!this.options) return;
    const phone = ENGrid.getField(
      this.options.address_fields?.phone as string
    ) as HTMLInputElement;
    if (phone) {
      const phoneStyle = window.getComputedStyle(phone);
      const marginTop = phoneStyle.marginTop;
      const marginBottom = phoneStyle.marginBottom;
      document.documentElement.style.setProperty(
        "--tc-phone-margin-top",
        marginTop
      );
      document.documentElement.style.setProperty(
        "--tc-phone-margin-bottom",
        marginBottom
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
    // If the country list is empty, allow all countries
    if (!this.options.countries || this.options.countries.length === 0) {
      return true;
    }
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
    if (!this.options || !this.options.address_enable) return {};
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
        ENGrid.setFieldValue(fieldKey, value, false);
      } else {
        this.logger.log(`Field ${key} not found`);
      }
    }
    return response;
  }
  private hasAddressFields(): boolean {
    if (!this.options || !this.options.address_enable) return false;
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
    if (!this.options || !this.hasAddressFields()) return false;
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
  private canUsePhoneAPI(): boolean {
    if (!this.options) return false;
    if (this.phoneEnabled()) {
      const phone = !!ENGrid.getFieldValue(
        this.options.address_fields?.phone as string
      );
      const countryPhone = !!ENGrid.getFieldValue("tc.phone.country");
      return phone && countryPhone;
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

  private getCountryByCode(code: string) {
    const countryItem =
      this.countries_list.find((country) => country.includes(code)) ?? "";
    if (countryItem) {
      return {
        name: countryItem[0],
        code: countryItem[1],
        dialCode: countryItem[2],
        placeholder: countryItem[3],
      };
    }
    return null;
  }
  private phoneEnabled(): boolean {
    return !!(this.options && this.options.phone_enable);
  }
  private countryDropDownEnabled(): boolean {
    return !!(this.options && this.options.phone_flags);
  }
  private async getCountryFromIP() {
    return fetch(`https://${window.location.hostname}/cdn-cgi/trace`)
      .then((res) => res.text())
      .then((t) => {
        let data = t.replace(/[\r\n]+/g, '","').replace(/\=+/g, '":"');
        data = '{"' + data.slice(0, data.lastIndexOf('","')) + '"}';
        const jsondata = JSON.parse(data);
        this.country_ip = jsondata.loc;
        return this.country_ip;
      });
  }
  private renderFlagsDropDown() {
    if (!this.options) return;
    const phoneInput = ENGrid.getField(
      this.options.address_fields?.phone as string
    );
    if (!phoneInput) return;
    this.countries_dropdown = document.createElement("div") as HTMLDivElement;
    this.countries_dropdown.classList.add("tc-flags-container");
    const selectedFlag = document.createElement("div");
    selectedFlag.classList.add("tc-selected-flag");
    selectedFlag.setAttribute("role", "combobox");
    selectedFlag.setAttribute("aria-haspopup", "listbox");
    selectedFlag.setAttribute("aria-expanded", "false");
    selectedFlag.setAttribute("aria-owns", "tc-flags-list");
    selectedFlag.setAttribute("aria-label", "Select Country");
    selectedFlag.setAttribute("tabindex", "0");
    const seletedFlagInner = document.createElement("div");
    seletedFlagInner.classList.add("tc-flag");
    // seletedFlagInner.innerHTML = this.getFlagImage("us", "United States");
    const flagArrow = document.createElement("div");
    flagArrow.classList.add("tc-flag-arrow");
    // flagArrow.innerHTML = "&#x25BC;";
    selectedFlag.appendChild(seletedFlagInner);
    selectedFlag.appendChild(flagArrow);
    selectedFlag.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (selectedFlag.classList.contains("tc-open")) {
        this.closeCountryDropDown();
      } else {
        this.openCountryDropDown();
      }
    });
    const countryList = document.createElement("ul");
    countryList.classList.add("tc-country-list");
    countryList.classList.add("tc-hide");
    countryList.setAttribute("id", "tc-country-list");
    countryList.setAttribute("role", "listbox");
    countryList.setAttribute("aria-label", "List of Countries");
    countryList.setAttribute("aria-hidden", "true");
    if ((this.options.phone_preferred_countries as string[]).length > 0) {
      const preferredCountries: {
        name: string;
        code: string;
        dialCode: string;
        placeholder: string;
      }[] = [];
      (this.options.phone_preferred_countries as string[]).forEach(
        (country) => {
          const countryItem = this.getCountryByCode(country);
          if (countryItem) {
            preferredCountries.push(countryItem);
          }
        }
      );
      this.appendCountryItems(
        countryList,
        preferredCountries,
        "tc-country-list-item",
        true
      );
      const divider = document.createElement("li");
      divider.classList.add("tc-divider");
      divider.setAttribute("role", "separator");
      divider.setAttribute("aria-disabled", "true");
      countryList.appendChild(divider);
      this.logger.log(
        "Rendering preferred countries",
        JSON.stringify(preferredCountries)
      );
    }
    const countryListItems: {
      name: string;
      code: string;
      dialCode: string;
      placeholder: string;
    }[] = [];
    this.countries_list.forEach((country) => {
      countryListItems.push({
        name: country[0],
        code: country[1],
        dialCode: country[2],
        placeholder: country[3],
      });
    });
    this.appendCountryItems(
      countryList,
      countryListItems,
      "tc-country-list-item"
    );
    countryList.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      const target = (e.target as HTMLElement).closest("li") as HTMLLIElement;
      if (target.classList.contains("tc-country-list-item")) {
        const countryItem = this.getCountryByCode(
          target.getAttribute("data-country-code") as string
        );
        if (countryItem) {
          this.setPhoneCountry(countryItem);
        }
      }
    });
    countryList.addEventListener("mouseover", (e) => {
      e.preventDefault();
      e.stopPropagation();
      const target = (e.target as HTMLElement).closest(
        "li.tc-country-list-item"
      ) as HTMLLIElement;
      if (target) {
        this.highlightCountry(target.getAttribute("data-country-code"));
      }
    });
    this.countries_dropdown.appendChild(selectedFlag);
    this.countries_dropdown.appendChild(countryList);
    (phoneInput.parentNode as HTMLElement).insertBefore(
      this.countries_dropdown,
      phoneInput
    );
    (phoneInput.parentNode as HTMLElement).classList.add(
      "tc-has-country-flags"
    );
    this.countries_dropdown.addEventListener("keydown", (e) => {
      const isDropdownHidden = this.countries_dropdown
        ?.querySelector(".tc-country-list")
        ?.classList.contains("tc-hide");

      if (
        isDropdownHidden &&
        ["ArrowUp", "Up", "ArrowDown", "Down", " ", "Enter"].indexOf(e.key) !==
          -1
      ) {
        // prevent form from being submitted if "ENTER" was pressed
        e.preventDefault();
        // prevent event from being handled again by document
        e.stopPropagation();
        this.openCountryDropDown();
      }

      // allow navigation from dropdown to input on TAB
      if (e.key === "Tab") this.closeCountryDropDown();
    });
    document.addEventListener("keydown", (e) => {
      const isDropdownHidden = this.countries_dropdown
        ?.querySelector(".tc-country-list")
        ?.classList.contains("tc-hide");
      if (!isDropdownHidden) {
        // prevent down key from scrolling the whole page,
        // and enter key from submitting a form etc
        e.preventDefault();

        // up and down to navigate
        if (
          e.key === "ArrowUp" ||
          e.key === "Up" ||
          e.key === "ArrowDown" ||
          e.key === "Down"
        )
          this.handleUpDownKey(e.key);
        // enter to select
        else if (e.key === "Enter") this.handleEnterKey();
        // esc to close
        else if (e.key === "Escape") this.closeCountryDropDown();
      }
    });
    document.addEventListener("click", (e) => {
      const isDropdownHidden = this.countries_dropdown
        ?.querySelector(".tc-country-list")
        ?.classList.contains("tc-hide");
      if (
        !isDropdownHidden &&
        !(e.target as HTMLElement).closest(".tc-country-list")
      ) {
        this.closeCountryDropDown();
      }
    });
  }
  private handleUpDownKey(key: string) {
    const highlightedCountry =
      this.countries_dropdown?.querySelector(".tc-highlight");
    if (highlightedCountry) {
      let next =
        key === "ArrowUp" || key === "Up"
          ? highlightedCountry.previousElementSibling
          : highlightedCountry.nextElementSibling;
      if (next) {
        if (next.classList.contains("tc-divider")) {
          next =
            key === "ArrowUp" || key === "Up"
              ? next.previousElementSibling
              : next.nextElementSibling;
        }
        this.highlightCountry(
          next?.getAttribute("data-country-code") as string
        );
      }
    }
  }
  private handleEnterKey() {
    const highlightedCountry =
      this.countries_dropdown?.querySelector(".tc-highlight");
    if (highlightedCountry) {
      const countryItem = this.getCountryByCode(
        highlightedCountry?.getAttribute("data-country-code") as string
      );
      this.setPhoneCountry(countryItem);
    }
  }
  private handlePhoneInputKeydown(e: Event) {
    const phoneInput = e.target as HTMLInputElement;
    const phoneNumber = phoneInput.value;
    if (phoneNumber.charAt(0) === "+") {
      if (phoneNumber.length > 2) {
        const countryItem = this.getCountryByCode(phoneNumber.substring(1, 3));
        if (countryItem) {
          this.setPhoneCountry(countryItem);
        } else {
          this.setDefaultPhoneCountry();
        }
      }
    }
  }
  private openCountryDropDown() {
    if (!this.countries_dropdown) return;
    const countryList =
      this.countries_dropdown.querySelector(".tc-country-list");
    const selectedFlag =
      this.countries_dropdown.querySelector(".tc-selected-flag");

    if (countryList && selectedFlag) {
      countryList.classList.remove("tc-hide");
      selectedFlag.setAttribute("aria-expanded", "true");
      selectedFlag.classList.add("tc-open");
    }
  }
  private closeCountryDropDown() {
    if (!this.options) return;
    if (!this.countries_dropdown) return;
    const countryList =
      this.countries_dropdown.querySelector(".tc-country-list");
    const selectedFlag =
      this.countries_dropdown.querySelector(".tc-selected-flag");

    if (countryList && selectedFlag) {
      countryList.classList.add("tc-hide");
      selectedFlag.setAttribute("aria-expanded", "false");
      selectedFlag.classList.remove("tc-open");
    }
    const phoneInput = ENGrid.getField(
      this.options.address_fields?.phone as string
    ) as HTMLInputElement;
    phoneInput.focus();
  }
  private getFlagImage(code: string, name: string) {
    return `<picture>
      <source
        loading="lazy"
        type="image/webp"
        srcset="https://flagcdn.com/h20/${code}.webp,
          https://flagcdn.com/h40/${code}.webp 2x,
          https://flagcdn.com/h60/${code}.webp 3x">
      <source
        loading="lazy"
        type="image/png"
        srcset="https://flagcdn.com/h20/${code}.png,
          https://flagcdn.com/h40/${code}.png 2x,
          https://flagcdn.com/h60/${code}.png 3x">
      <img
        loading="lazy"
        src="https://flagcdn.com/h20/${code}.png"
        height="20"
        alt="${name}">
    </picture>`;
  }
  private appendCountryItems(
    countryContainer: HTMLUListElement,
    countries: {
      name: string;
      code: string;
      dialCode: string;
      placeholder: string;
    }[],
    className: string,
    preferred: boolean = false
  ) {
    let html = "";
    // for each country
    for (let i = 0; i < countries.length; i++) {
      const c = countries[i];
      const idSuffix = !!preferred ? "-preferred" : "" ?? "";
      // open the list item
      html += `<li class='tc-country ${className}' tabIndex='-1' id='tc-item-${c.code}${idSuffix}' role='option' data-dial-code='${c.dialCode}' data-country-code='${c.code}' aria-selected='false'>`;
      // add the flag
      html += `<div class='tc-flag-box'><div class='tc-flag tc-${
        c.code
      }'>${this.getFlagImage(c.code, c.name)}</div></div>`;
      // and the country name and dial code
      html += `<span class='tc-country-name'>${c.name}</span>`;
      html += `<span class='tc-dial-code'>+${c.dialCode}</span>`;
      // close the list item
      html += "</li>";
    }
    countryContainer.insertAdjacentHTML("beforeend", html);
  }
  private setDefaultPhoneCountry() {
    if (!this.options) return;
    // First, try to get the country from IP
    if (this.options.phone_country_from_ip) {
      this.getCountryFromIP()
        .then((country) => {
          this.logger.log("Country from IP:", country);
          this.setPhoneCountry(
            this.getCountryByCode((country ?? "us").toLowerCase())
          );
        })
        .catch((error) => {
          this.setPhoneCountry(this.getCountryByCode("us"));
        });
      return;
    }
    // Then, get the default country Text
    const countryField = ENGrid.getField(
      this.options.address_fields?.country as string
    ) as HTMLSelectElement;
    if (countryField) {
      const countryText = countryField.options[countryField.selectedIndex].text;
      // Then, get the country code from the Text
      const countryData = this.getCountryByCode(countryText);
      if (countryData) {
        this.setPhoneCountry(countryData);
        return;
      } else if (
        (this.options.phone_preferred_countries as string[]).length > 0
      ) {
        // If no country code is found, use the first priority country
        this.setPhoneCountry(
          this.getCountryByCode(
            (this.options.phone_preferred_countries as string[])[0]
          )
        );
        return;
      }
    }
    // If nothing works, GO USA!
    this.setPhoneCountry(this.getCountryByCode("us"));
  }
  private setPhoneCountry(
    country: {
      name: string;
      code: string;
      dialCode: string;
      placeholder: string;
    } | null
  ) {
    if (!this.options || !country) return;

    const countryInput = ENGrid.getField(
      "tc.phone.country"
    ) as HTMLInputElement;
    if (countryInput.value === country.code) return;
    const phoneInput = ENGrid.getField(
      this.options.address_fields?.phone as string
    ) as HTMLInputElement;
    if (this.countryDropDownEnabled()) {
      const selectedFlag =
        this.countries_dropdown?.querySelector(".tc-selected-flag");
      const flagElement = this.countries_dropdown?.querySelector(".tc-flag");
      if (selectedFlag && flagElement) {
        flagElement.innerHTML = this.getFlagImage(country.code, country.name);
        selectedFlag.setAttribute("data-country", country.code);
      }
      const currentSelectedCountry = this.countries_dropdown?.querySelector(
        ".tc-country-list-item[aria-selected='true']"
      );
      if (currentSelectedCountry) {
        currentSelectedCountry.classList.remove("tc-selected");
        currentSelectedCountry.setAttribute("aria-selected", "false");
      }
      const currentHighlightedCountry =
        this.countries_dropdown?.querySelector(".tc-highlight");
      if (currentHighlightedCountry) {
        currentHighlightedCountry.classList.remove("tc-highlight");
      }
      const countryListItem = this.countries_dropdown?.querySelector(
        `.tc-country-list-item[data-country-code='${country.code}']`
      );
      if (countryListItem) {
        countryListItem.classList.add("tc-selected");
        countryListItem.setAttribute("aria-selected", "true");
        countryListItem.classList.add("tc-highlight");
      }
      if (selectedFlag?.classList.contains("tc-open"))
        this.closeCountryDropDown();
    }
    phoneInput.setAttribute("placeholder", country.placeholder);
    countryInput.value = country.code;
    this.logger.log(
      `Setting phone country to ${country.code} -  ${country.name}`
    );
  }
  private highlightCountry(countryCode: string | null) {
    if (!countryCode) return;
    const currentHighlightedCountry =
      this.countries_dropdown?.querySelector(".tc-highlight");
    if (currentHighlightedCountry) {
      currentHighlightedCountry.classList.remove("tc-highlight");
    }
    const countryList =
      this.countries_dropdown?.querySelector(".tc-country-list");
    if (countryList) {
      const country = countryList.querySelector(
        `.tc-country[data-country-code='${countryCode}']`
      );
      if (country) {
        country.classList.add("tc-highlight");
        country.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "nearest",
        });
      }
    }
  }
  private async setPhoneDataFromAPI(data: any, id: string) {
    if (!this.options) return;
    const phoneField = ENGrid.getField(
      this.options.address_fields?.phone as string
    ) as HTMLInputElement;
    const recordField = ENGrid.getField(
      this.options.phone_record_field as string
    ) as HTMLInputElement;
    const dateField = ENGrid.getField(
      this.options.phone_date_field as string
    ) as HTMLInputElement;
    const statusField = ENGrid.getField(
      this.options.phone_status_field as string
    ) as HTMLInputElement;
    let record: any = {};
    record["formData"] = { [phoneField.name]: phoneField.value };
    record["formatted"] = data.formatted;
    record["number_type"] = data.number_type;
    if (data.valid === true) {
      if (phoneField.value !== data.formatted.e164) {
        record["phone"] = {
          from: phoneField.value,
          to: data.formatted.e164,
        };
        phoneField.value = data.formatted.e164;
      }

      await this.checkSum(JSON.stringify(record)).then((checksum) => {
        this.logger.log("Phone Checksum", checksum);
        record["requestId"] = id; // We don't want to add the requestId to the checksum
        record["checksum"] = checksum;
      });
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
      await this.checkSum(JSON.stringify(record)).then((checksum) => {
        this.logger.log("Phone Checksum", checksum);
        record["requestId"] = id; // We don't want to add the requestId to the checksum
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
          "error" in data ? `ERROR: ` + data.error : "INVALIDPHONE";
      }
    }
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
    if (!this.canUseAPI() && !this.canUsePhoneAPI()) {
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
    let formData: { [key: string]: any } = {
      url: window.location.href,
      cid: this.options.cid,
    };
    if (this.canUseAPI()) {
      formData = Object.assign(formData, {
        address1,
        address2,
        city,
        region,
        postalCode,
        country,
      });
    }
    if (this.canUsePhoneAPI()) {
      formData.phone = ENGrid.getFieldValue(
        this.options.address_fields?.phone as string
      );
      formData.phoneCountry = ENGrid.getFieldValue("tc.phone.country");
    }
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
              "error" in data ? `ERROR: ` + data.error : "INVALIDADDRESS";
          }
        }
        if (this.phoneEnabled() && "phone" in data) {
          await this.setPhoneDataFromAPI(data.phone, data.requestId);
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
