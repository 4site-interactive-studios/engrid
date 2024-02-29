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
        var _a, _b, _c, _d, _e;
        this.logger = new EngridLogger("TidyContact", "#FFFFFF", "#4d9068", "📧");
        this.endpoint = "https://api.tidycontact.io";
        this.wasCalled = false; // True if the API endpoint was called
        this.httpStatus = 0;
        this.timeout = 5; // Seconds to API Timeout
        this.isDirty = false; // True if the address was changed by the user
        this._form = EnForm.getInstance();
        this.countries_list = [
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
        this.countries_dropdown = null;
        this.country_ip = null;
        this.options = ENGrid.getOption("TidyContact");
        if (this.options === false || !((_a = this.options) === null || _a === void 0 ? void 0 : _a.cid))
            return;
        this.loadOptions();
        if (!this.hasAddressFields() && !this.phoneEnabled()) {
            this.logger.log("No address fields found");
            return;
        }
        this.createFields();
        this.addEventListeners();
        if (ENGrid.checkNested(window.EngagingNetworks, "require", "_defined", "enjs", "checkSubmissionFailed") &&
            !window.EngagingNetworks.require._defined.enjs.checkSubmissionFailed() &&
            ENGrid.getFieldValue((_c = (_b = this.options) === null || _b === void 0 ? void 0 : _b.address_fields) === null || _c === void 0 ? void 0 : _c.address1) !=
                "") {
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
            const phoneField = ENGrid.getField((_e = (_d = this.options) === null || _d === void 0 ? void 0 : _d.address_fields) === null || _e === void 0 ? void 0 : _e.phone);
            if (phoneField) {
                phoneField.addEventListener("keyup", (e) => {
                    this.handlePhoneInputKeydown(e);
                });
                this.setDefaultPhoneCountry();
            }
        }
    }
    loadOptions() {
        var _a, _b, _c, _d;
        if (this.options) {
            if (!this.options.address_fields) {
                this.options.address_fields = {
                    address1: "supporter.address1",
                    address2: "supporter.address2",
                    address3: "supporter.address3",
                    city: "supporter.city",
                    region: "supporter.region",
                    postalCode: "supporter.postcode",
                    country: "supporter.country",
                    phone: "supporter.phoneNumber2", // Phone field
                };
            }
            this.options.address_enable = (_a = this.options.address_enable) !== null && _a !== void 0 ? _a : true;
            if (this.options.phone_enable) {
                this.options.phone_flags = (_b = this.options.phone_flags) !== null && _b !== void 0 ? _b : true;
                this.options.phone_country_from_ip =
                    (_c = this.options.phone_country_from_ip) !== null && _c !== void 0 ? _c : true;
                this.options.phone_preferred_countries =
                    (_d = this.options.phone_preferred_countries) !== null && _d !== void 0 ? _d : [];
            }
        }
    }
    createFields() {
        var _a, _b, _c, _d, _e, _f;
        if (!this.options || !this.hasAddressFields())
            return;
        // Creating Latitude and Longitude fields
        const latitudeField = ENGrid.getField("supporter.geo.latitude");
        const longitudeField = ENGrid.getField("supporter.geo.longitude");
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
        if (!ENGrid.getField((_a = this.options.address_fields) === null || _a === void 0 ? void 0 : _a.address2)) {
            ENGrid.createHiddenInput((_b = this.options.address_fields) === null || _b === void 0 ? void 0 : _b.address2, "");
            this.logger.log("Creating Hidden Field: " + ((_c = this.options.address_fields) === null || _c === void 0 ? void 0 : _c.address2));
        }
        if (!ENGrid.getField((_d = this.options.address_fields) === null || _d === void 0 ? void 0 : _d.address3)) {
            ENGrid.createHiddenInput((_e = this.options.address_fields) === null || _e === void 0 ? void 0 : _e.address3, "");
            this.logger.log("Creating Hidden Field: " + ((_f = this.options.address_fields) === null || _f === void 0 ? void 0 : _f.address3));
        }
    }
    createPhoneFields() {
        if (!this.options)
            return;
        ENGrid.createHiddenInput("tc.phone.country", "");
        this.logger.log("Creating hidden field: tc.phone.country");
        if (this.options.phone_record_field) {
            const recordField = ENGrid.getField(this.options.phone_record_field);
            if (!recordField) {
                ENGrid.createHiddenInput(this.options.phone_record_field, "");
                this.logger.log("Creating hidden field: " + this.options.phone_record_field);
            }
        }
        if (this.options.phone_date_field) {
            const dateField = ENGrid.getField(this.options.phone_date_field);
            if (!dateField) {
                ENGrid.createHiddenInput(this.options.phone_date_field, "");
                this.logger.log("Creating hidden field: " + this.options.phone_date_field);
            }
        }
        if (this.options.phone_status_field) {
            const statusField = ENGrid.getField(this.options.phone_status_field);
            if (!statusField) {
                ENGrid.createHiddenInput(this.options.phone_status_field, "");
                this.logger.log("Creating hidden field: " + this.options.phone_status_field);
            }
        }
    }
    createPhoneMarginVariable() {
        var _a;
        if (!this.options)
            return;
        const phone = ENGrid.getField((_a = this.options.address_fields) === null || _a === void 0 ? void 0 : _a.phone);
        if (phone) {
            const phoneStyle = window.getComputedStyle(phone);
            const marginTop = phoneStyle.marginTop;
            const marginBottom = phoneStyle.marginBottom;
            document.documentElement.style.setProperty("--tc-phone-margin-top", marginTop);
            document.documentElement.style.setProperty("--tc-phone-margin-bottom", marginBottom);
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
        // If the country list is empty, allow all countries
        if (!this.options.countries || this.options.countries.length === 0) {
            return true;
        }
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
    setFields(data) {
        var _a, _b, _c, _d, _e;
        if (!this.options || !this.options.address_enable)
            return {};
        let response = {};
        const country = this.getCountry();
        const postalCodeValue = ENGrid.getFieldValue((_a = this.options.address_fields) === null || _a === void 0 ? void 0 : _a.postalCode);
        const zipDivider = (_b = this.options.us_zip_divider) !== null && _b !== void 0 ? _b : "+";
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
            postalCodeValue.replace("+", zipDivider) ===
                data.postalCode.replace("+", zipDivider)) {
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
                    ["US", "USA", "United States"].includes(country)) {
                    value = (_e = value.replace("+", zipDivider)) !== null && _e !== void 0 ? _e : ""; // Replace the "+" with the zip divider
                }
                response[key] = { from: field.value, to: value };
                this.logger.log(`Set ${field.name} to ${value} (${field.value})`);
                ENGrid.setFieldValue(fieldKey, value, false);
            }
            else {
                this.logger.log(`Field ${key} not found`);
            }
        }
        return response;
    }
    hasAddressFields() {
        var _a, _b, _c, _d, _e, _f;
        if (!this.options || !this.options.address_enable)
            return false;
        const address1 = ENGrid.getField((_a = this.options.address_fields) === null || _a === void 0 ? void 0 : _a.address1);
        const address2 = ENGrid.getField((_b = this.options.address_fields) === null || _b === void 0 ? void 0 : _b.address2);
        const city = ENGrid.getField((_c = this.options.address_fields) === null || _c === void 0 ? void 0 : _c.city);
        const region = ENGrid.getField((_d = this.options.address_fields) === null || _d === void 0 ? void 0 : _d.region);
        const postalCode = ENGrid.getField((_e = this.options.address_fields) === null || _e === void 0 ? void 0 : _e.postalCode);
        const country = ENGrid.getField((_f = this.options.address_fields) === null || _f === void 0 ? void 0 : _f.country);
        return !!(address1 || address2 || city || region || postalCode || country);
    }
    canUseAPI() {
        var _a, _b, _c, _d;
        if (!this.options || !this.hasAddressFields())
            return false;
        const country = !!this.getCountry();
        const address1 = !!ENGrid.getFieldValue((_a = this.options.address_fields) === null || _a === void 0 ? void 0 : _a.address1);
        const city = !!ENGrid.getFieldValue((_b = this.options.address_fields) === null || _b === void 0 ? void 0 : _b.city);
        const region = !!ENGrid.getFieldValue((_c = this.options.address_fields) === null || _c === void 0 ? void 0 : _c.region);
        const postalCode = !!ENGrid.getFieldValue((_d = this.options.address_fields) === null || _d === void 0 ? void 0 : _d.postalCode);
        if (country && address1) {
            return (city && region) || postalCode;
        }
        return false;
    }
    canUsePhoneAPI() {
        var _a;
        if (!this.options)
            return false;
        if (this.phoneEnabled()) {
            const phone = !!ENGrid.getFieldValue((_a = this.options.address_fields) === null || _a === void 0 ? void 0 : _a.phone);
            const countryPhone = !!ENGrid.getFieldValue("tc.phone.country");
            return phone && countryPhone;
        }
        return false;
    }
    getCountry() {
        var _a, _b;
        if (!this.options)
            return "";
        const countryFallback = (_a = this.options.country_fallback) !== null && _a !== void 0 ? _a : "";
        const country = ENGrid.getFieldValue((_b = this.options.address_fields) === null || _b === void 0 ? void 0 : _b.country);
        return country || countryFallback.toUpperCase();
    }
    getCountryByCode(code) {
        var _a;
        const countryItem = (_a = this.countries_list.find((country) => country.includes(code))) !== null && _a !== void 0 ? _a : "";
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
    phoneEnabled() {
        return !!(this.options && this.options.phone_enable);
    }
    countryDropDownEnabled() {
        return !!(this.options && this.options.phone_flags);
    }
    getCountryFromIP() {
        return __awaiter(this, void 0, void 0, function* () {
            return fetch(`https://${window.location.hostname}/cdn-cgi/trace`)
                .then((res) => res.text())
                .then((t) => {
                let data = t.replace(/[\r\n]+/g, '","').replace(/\=+/g, '":"');
                data = '{"' + data.slice(0, data.lastIndexOf('","')) + '"}';
                const jsondata = JSON.parse(data);
                this.country_ip = jsondata.loc;
                return this.country_ip;
            });
        });
    }
    renderFlagsDropDown() {
        var _a;
        if (!this.options)
            return;
        const phoneInput = ENGrid.getField((_a = this.options.address_fields) === null || _a === void 0 ? void 0 : _a.phone);
        if (!phoneInput)
            return;
        this.countries_dropdown = document.createElement("div");
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
            }
            else {
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
        if (this.options.phone_preferred_countries.length > 0) {
            const preferredCountries = [];
            this.options.phone_preferred_countries.forEach((country) => {
                const countryItem = this.getCountryByCode(country);
                if (countryItem) {
                    preferredCountries.push(countryItem);
                }
            });
            this.appendCountryItems(countryList, preferredCountries, "tc-country-list-item", true);
            const divider = document.createElement("li");
            divider.classList.add("tc-divider");
            divider.setAttribute("role", "separator");
            divider.setAttribute("aria-disabled", "true");
            countryList.appendChild(divider);
            this.logger.log("Rendering preferred countries", JSON.stringify(preferredCountries));
        }
        const countryListItems = [];
        this.countries_list.forEach((country) => {
            countryListItems.push({
                name: country[0],
                code: country[1],
                dialCode: country[2],
                placeholder: country[3],
            });
        });
        this.appendCountryItems(countryList, countryListItems, "tc-country-list-item");
        countryList.addEventListener("click", (e) => {
            e.preventDefault();
            e.stopPropagation();
            const target = e.target.closest("li");
            if (target.classList.contains("tc-country-list-item")) {
                const countryItem = this.getCountryByCode(target.getAttribute("data-country-code"));
                if (countryItem) {
                    this.setPhoneCountry(countryItem);
                }
            }
        });
        countryList.addEventListener("mouseover", (e) => {
            e.preventDefault();
            e.stopPropagation();
            const target = e.target.closest("li.tc-country-list-item");
            if (target) {
                this.highlightCountry(target.getAttribute("data-country-code"));
            }
        });
        this.countries_dropdown.appendChild(selectedFlag);
        this.countries_dropdown.appendChild(countryList);
        phoneInput.parentNode.insertBefore(this.countries_dropdown, phoneInput);
        phoneInput.parentNode.classList.add("tc-has-country-flags");
        this.countries_dropdown.addEventListener("keydown", (e) => {
            var _a, _b;
            const isDropdownHidden = (_b = (_a = this.countries_dropdown) === null || _a === void 0 ? void 0 : _a.querySelector(".tc-country-list")) === null || _b === void 0 ? void 0 : _b.classList.contains("tc-hide");
            if (isDropdownHidden &&
                ["ArrowUp", "Up", "ArrowDown", "Down", " ", "Enter"].indexOf(e.key) !==
                    -1) {
                // prevent form from being submitted if "ENTER" was pressed
                e.preventDefault();
                // prevent event from being handled again by document
                e.stopPropagation();
                this.openCountryDropDown();
            }
            // allow navigation from dropdown to input on TAB
            if (e.key === "Tab")
                this.closeCountryDropDown();
        });
        document.addEventListener("keydown", (e) => {
            var _a, _b;
            const isDropdownHidden = (_b = (_a = this.countries_dropdown) === null || _a === void 0 ? void 0 : _a.querySelector(".tc-country-list")) === null || _b === void 0 ? void 0 : _b.classList.contains("tc-hide");
            if (!isDropdownHidden) {
                // prevent down key from scrolling the whole page,
                // and enter key from submitting a form etc
                e.preventDefault();
                // up and down to navigate
                if (e.key === "ArrowUp" ||
                    e.key === "Up" ||
                    e.key === "ArrowDown" ||
                    e.key === "Down")
                    this.handleUpDownKey(e.key);
                // enter to select
                else if (e.key === "Enter")
                    this.handleEnterKey();
                // esc to close
                else if (e.key === "Escape")
                    this.closeCountryDropDown();
            }
        });
        document.addEventListener("click", (e) => {
            var _a, _b;
            const isDropdownHidden = (_b = (_a = this.countries_dropdown) === null || _a === void 0 ? void 0 : _a.querySelector(".tc-country-list")) === null || _b === void 0 ? void 0 : _b.classList.contains("tc-hide");
            if (!isDropdownHidden &&
                !e.target.closest(".tc-country-list")) {
                this.closeCountryDropDown();
            }
        });
    }
    handleUpDownKey(key) {
        var _a;
        const highlightedCountry = (_a = this.countries_dropdown) === null || _a === void 0 ? void 0 : _a.querySelector(".tc-highlight");
        if (highlightedCountry) {
            let next = key === "ArrowUp" || key === "Up"
                ? highlightedCountry.previousElementSibling
                : highlightedCountry.nextElementSibling;
            if (next) {
                if (next.classList.contains("tc-divider")) {
                    next =
                        key === "ArrowUp" || key === "Up"
                            ? next.previousElementSibling
                            : next.nextElementSibling;
                }
                this.highlightCountry(next === null || next === void 0 ? void 0 : next.getAttribute("data-country-code"));
            }
        }
    }
    handleEnterKey() {
        var _a;
        const highlightedCountry = (_a = this.countries_dropdown) === null || _a === void 0 ? void 0 : _a.querySelector(".tc-highlight");
        if (highlightedCountry) {
            const countryItem = this.getCountryByCode(highlightedCountry === null || highlightedCountry === void 0 ? void 0 : highlightedCountry.getAttribute("data-country-code"));
            this.setPhoneCountry(countryItem);
        }
    }
    handlePhoneInputKeydown(e) {
        const phoneInput = e.target;
        const phoneNumber = phoneInput.value;
        if (phoneNumber.charAt(0) === "+") {
            if (phoneNumber.length > 2) {
                const countryItem = this.getCountryByCode(phoneNumber.substring(1, 3));
                if (countryItem) {
                    this.setPhoneCountry(countryItem);
                }
                else {
                    this.setDefaultPhoneCountry();
                }
            }
        }
    }
    openCountryDropDown() {
        if (!this.countries_dropdown)
            return;
        const countryList = this.countries_dropdown.querySelector(".tc-country-list");
        const selectedFlag = this.countries_dropdown.querySelector(".tc-selected-flag");
        if (countryList && selectedFlag) {
            countryList.classList.remove("tc-hide");
            selectedFlag.setAttribute("aria-expanded", "true");
            selectedFlag.classList.add("tc-open");
        }
    }
    closeCountryDropDown() {
        var _a;
        if (!this.options)
            return;
        if (!this.countries_dropdown)
            return;
        const countryList = this.countries_dropdown.querySelector(".tc-country-list");
        const selectedFlag = this.countries_dropdown.querySelector(".tc-selected-flag");
        if (countryList && selectedFlag) {
            countryList.classList.add("tc-hide");
            selectedFlag.setAttribute("aria-expanded", "false");
            selectedFlag.classList.remove("tc-open");
        }
        const phoneInput = ENGrid.getField((_a = this.options.address_fields) === null || _a === void 0 ? void 0 : _a.phone);
        phoneInput.focus();
    }
    getFlagImage(code, name) {
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
    appendCountryItems(countryContainer, countries, className, preferred = false) {
        let html = "";
        // for each country
        for (let i = 0; i < countries.length; i++) {
            const c = countries[i];
            const idSuffix = !!preferred ? "-preferred" : "" !== null && "" !== void 0 ? "" : "";
            // open the list item
            html += `<li class='tc-country ${className}' tabIndex='-1' id='tc-item-${c.code}${idSuffix}' role='option' data-dial-code='${c.dialCode}' data-country-code='${c.code}' aria-selected='false'>`;
            // add the flag
            html += `<div class='tc-flag-box'><div class='tc-flag tc-${c.code}'>${this.getFlagImage(c.code, c.name)}</div></div>`;
            // and the country name and dial code
            html += `<span class='tc-country-name'>${c.name}</span>`;
            html += `<span class='tc-dial-code'>+${c.dialCode}</span>`;
            // close the list item
            html += "</li>";
        }
        countryContainer.insertAdjacentHTML("beforeend", html);
    }
    setDefaultPhoneCountry() {
        var _a;
        if (!this.options)
            return;
        // First, try to get the country from IP
        if (this.options.phone_country_from_ip) {
            this.getCountryFromIP()
                .then((country) => {
                this.logger.log("Country from IP:", country);
                this.setPhoneCountry(this.getCountryByCode((country !== null && country !== void 0 ? country : "us").toLowerCase()));
            })
                .catch((error) => {
                this.setPhoneCountry(this.getCountryByCode("us"));
            });
            return;
        }
        // Then, get the default country Text
        const countryField = ENGrid.getField((_a = this.options.address_fields) === null || _a === void 0 ? void 0 : _a.country);
        if (countryField) {
            const countryText = countryField.options[countryField.selectedIndex].text;
            // Then, get the country code from the Text
            const countryData = this.getCountryByCode(countryText);
            if (countryData) {
                this.setPhoneCountry(countryData);
                return;
            }
            else if (this.options.phone_preferred_countries.length > 0) {
                // If no country code is found, use the first priority country
                this.setPhoneCountry(this.getCountryByCode(this.options.phone_preferred_countries[0]));
                return;
            }
        }
        // If nothing works, GO USA!
        this.setPhoneCountry(this.getCountryByCode("us"));
    }
    setPhoneCountry(country) {
        var _a, _b, _c, _d, _e, _f;
        if (!this.options || !country)
            return;
        const countryInput = ENGrid.getField("tc.phone.country");
        if (countryInput.value === country.code)
            return;
        const phoneInput = ENGrid.getField((_a = this.options.address_fields) === null || _a === void 0 ? void 0 : _a.phone);
        if (this.countryDropDownEnabled()) {
            const selectedFlag = (_b = this.countries_dropdown) === null || _b === void 0 ? void 0 : _b.querySelector(".tc-selected-flag");
            const flagElement = (_c = this.countries_dropdown) === null || _c === void 0 ? void 0 : _c.querySelector(".tc-flag");
            if (selectedFlag && flagElement) {
                flagElement.innerHTML = this.getFlagImage(country.code, country.name);
                selectedFlag.setAttribute("data-country", country.code);
            }
            const currentSelectedCountry = (_d = this.countries_dropdown) === null || _d === void 0 ? void 0 : _d.querySelector(".tc-country-list-item[aria-selected='true']");
            if (currentSelectedCountry) {
                currentSelectedCountry.classList.remove("tc-selected");
                currentSelectedCountry.setAttribute("aria-selected", "false");
            }
            const currentHighlightedCountry = (_e = this.countries_dropdown) === null || _e === void 0 ? void 0 : _e.querySelector(".tc-highlight");
            if (currentHighlightedCountry) {
                currentHighlightedCountry.classList.remove("tc-highlight");
            }
            const countryListItem = (_f = this.countries_dropdown) === null || _f === void 0 ? void 0 : _f.querySelector(`.tc-country-list-item[data-country-code='${country.code}']`);
            if (countryListItem) {
                countryListItem.classList.add("tc-selected");
                countryListItem.setAttribute("aria-selected", "true");
                countryListItem.classList.add("tc-highlight");
            }
            if (selectedFlag === null || selectedFlag === void 0 ? void 0 : selectedFlag.classList.contains("tc-open"))
                this.closeCountryDropDown();
        }
        phoneInput.setAttribute("placeholder", country.placeholder);
        countryInput.value = country.code;
        this.logger.log(`Setting phone country to ${country.code} -  ${country.name}`);
    }
    highlightCountry(countryCode) {
        var _a, _b;
        if (!countryCode)
            return;
        const currentHighlightedCountry = (_a = this.countries_dropdown) === null || _a === void 0 ? void 0 : _a.querySelector(".tc-highlight");
        if (currentHighlightedCountry) {
            currentHighlightedCountry.classList.remove("tc-highlight");
        }
        const countryList = (_b = this.countries_dropdown) === null || _b === void 0 ? void 0 : _b.querySelector(".tc-country-list");
        if (countryList) {
            const country = countryList.querySelector(`.tc-country[data-country-code='${countryCode}']`);
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
    setPhoneDataFromAPI(data, id) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.options)
                return;
            const phoneField = ENGrid.getField((_a = this.options.address_fields) === null || _a === void 0 ? void 0 : _a.phone);
            const recordField = ENGrid.getField(this.options.phone_record_field);
            const dateField = ENGrid.getField(this.options.phone_date_field);
            const statusField = ENGrid.getField(this.options.phone_status_field);
            let record = {};
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
                yield this.checkSum(JSON.stringify(record)).then((checksum) => {
                    this.logger.log("Phone Checksum", checksum);
                    record["requestId"] = id; // We don't want to add the requestId to the checksum
                    record["checksum"] = checksum;
                });
                if (recordField) {
                    record = Object.assign({ date: this.todaysDate(), status: "SUCCESS" }, record);
                    recordField.value = JSON.stringify(record);
                }
                if (dateField) {
                    dateField.value = this.todaysDate();
                }
                if (statusField) {
                    statusField.value = "SUCCESS";
                }
            }
            else {
                yield this.checkSum(JSON.stringify(record)).then((checksum) => {
                    this.logger.log("Phone Checksum", checksum);
                    record["requestId"] = id; // We don't want to add the requestId to the checksum
                    record["checksum"] = checksum;
                });
                if (recordField) {
                    record = Object.assign({ date: this.todaysDate(), status: "ERROR" }, record);
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
        });
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
        const latitudeField = ENGrid.getField("supporter.geo.latitude");
        const longitudeField = ENGrid.getField("supporter.geo.longitude");
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
        const address1 = ENGrid.getFieldValue((_a = this.options.address_fields) === null || _a === void 0 ? void 0 : _a.address1);
        const address2 = ENGrid.getFieldValue((_b = this.options.address_fields) === null || _b === void 0 ? void 0 : _b.address2);
        const city = ENGrid.getFieldValue((_c = this.options.address_fields) === null || _c === void 0 ? void 0 : _c.city);
        const region = ENGrid.getFieldValue((_d = this.options.address_fields) === null || _d === void 0 ? void 0 : _d.region);
        const postalCode = ENGrid.getFieldValue((_e = this.options.address_fields) === null || _e === void 0 ? void 0 : _e.postalCode);
        const country = this.getCountry();
        if (!this.countryAllowed(country)) {
            this.logger.log("Country not allowed: " + country);
            if (recordField) {
                let record = {};
                record = Object.assign({ date: this.todaysDate(), status: "DISALLOWED" }, record);
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
        let formData = {
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
            formData.phone = ENGrid.getFieldValue((_f = this.options.address_fields) === null || _f === void 0 ? void 0 : _f.phone);
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
            .then((data) => __awaiter(this, void 0, void 0, function* () {
            this.logger.log("callAPI response", JSON.parse(JSON.stringify(data)));
            if (data.valid === true) {
                let record = {};
                if ("changed" in data) {
                    record = this.setFields(data.changed);
                }
                record["formData"] = formData;
                yield this.checkSum(JSON.stringify(record)).then((checksum) => {
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
                    record = Object.assign({ date: this.todaysDate(), status: "SUCCESS" }, record);
                    recordField.value = JSON.stringify(record);
                }
                if (dateField) {
                    dateField.value = this.todaysDate();
                }
                if (statusField) {
                    statusField.value = "SUCCESS";
                }
            }
            else {
                let record = {};
                record["formData"] = formData;
                yield this.checkSum(JSON.stringify(record)).then((checksum) => {
                    this.logger.log("Checksum", checksum);
                    record["requestId"] = data.requestId; // We don't want to add the requestId to the checksum
                    record["checksum"] = checksum;
                });
                if (recordField) {
                    record = Object.assign({ date: this.todaysDate(), status: "ERROR" }, record);
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
                yield this.setPhoneDataFromAPI(data.phone, data.requestId);
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
