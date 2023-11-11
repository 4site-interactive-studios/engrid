/******/ (() => {
  // webpackBootstrap
  /******/ "use strict";
  /******/ var __webpack_modules__ = {
    /***/ 705: /***/ (
      __unused_webpack_module,
      exports,
      __nccwpck_require__
    ) => {
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.cardNumber = void 0;
      var luhn10 = __nccwpck_require__(163);
      var getCardTypes = __nccwpck_require__(61);
      function verification(card, isPotentiallyValid, isValid) {
        return {
          card: card,
          isPotentiallyValid: isPotentiallyValid,
          isValid: isValid,
        };
      }
      function cardNumber(value, options) {
        if (options === void 0) {
          options = {};
        }
        var isPotentiallyValid, isValid, maxLength;
        if (typeof value !== "string" && typeof value !== "number") {
          return verification(null, false, false);
        }
        var testCardValue = String(value).replace(/-|\s/g, "");
        if (!/^\d*$/.test(testCardValue)) {
          return verification(null, false, false);
        }
        var potentialTypes = getCardTypes(testCardValue);
        if (potentialTypes.length === 0) {
          return verification(null, false, false);
        } else if (potentialTypes.length !== 1) {
          return verification(null, true, false);
        }
        var cardType = potentialTypes[0];
        if (options.maxLength && testCardValue.length > options.maxLength) {
          return verification(cardType, false, false);
        }
        if (
          cardType.type === getCardTypes.types.UNIONPAY &&
          options.luhnValidateUnionPay !== true
        ) {
          isValid = true;
        } else {
          isValid = luhn10(testCardValue);
        }
        maxLength = Math.max.apply(null, cardType.lengths);
        if (options.maxLength) {
          maxLength = Math.min(options.maxLength, maxLength);
        }
        for (var i = 0; i < cardType.lengths.length; i++) {
          if (cardType.lengths[i] === testCardValue.length) {
            isPotentiallyValid = testCardValue.length < maxLength || isValid;
            return verification(cardType, isPotentiallyValid, isValid);
          }
        }
        return verification(cardType, testCardValue.length < maxLength, false);
      }
      exports.cardNumber = cardNumber;

      /***/
    },

    /***/ 436: /***/ (__unused_webpack_module, exports) => {
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.cardholderName = void 0;
      var CARD_NUMBER_REGEX = /^[\d\s-]*$/;
      var MAX_LENGTH = 255;
      function verification(isValid, isPotentiallyValid) {
        return { isValid: isValid, isPotentiallyValid: isPotentiallyValid };
      }
      function cardholderName(value) {
        if (typeof value !== "string") {
          return verification(false, false);
        }
        if (value.length === 0) {
          return verification(false, true);
        }
        if (value.length > MAX_LENGTH) {
          return verification(false, false);
        }
        if (CARD_NUMBER_REGEX.test(value)) {
          return verification(false, true);
        }
        return verification(true, true);
      }
      exports.cardholderName = cardholderName;

      /***/
    },

    /***/ 634: /***/ (__unused_webpack_module, exports) => {
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.cvv = void 0;
      var DEFAULT_LENGTH = 3;
      function includes(array, thing) {
        for (var i = 0; i < array.length; i++) {
          if (thing === array[i]) {
            return true;
          }
        }
        return false;
      }
      function max(array) {
        var maximum = DEFAULT_LENGTH;
        var i = 0;
        for (; i < array.length; i++) {
          maximum = array[i] > maximum ? array[i] : maximum;
        }
        return maximum;
      }
      function verification(isValid, isPotentiallyValid) {
        return { isValid: isValid, isPotentiallyValid: isPotentiallyValid };
      }
      function cvv(value, maxLength) {
        if (maxLength === void 0) {
          maxLength = DEFAULT_LENGTH;
        }
        maxLength = maxLength instanceof Array ? maxLength : [maxLength];
        if (typeof value !== "string") {
          return verification(false, false);
        }
        if (!/^\d*$/.test(value)) {
          return verification(false, false);
        }
        if (includes(maxLength, value.length)) {
          return verification(true, true);
        }
        if (value.length < Math.min.apply(null, maxLength)) {
          return verification(false, true);
        }
        if (value.length > max(maxLength)) {
          return verification(false, false);
        }
        return verification(true, true);
      }
      exports.cvv = cvv;

      /***/
    },

    /***/ 730: /***/ function (
      __unused_webpack_module,
      exports,
      __nccwpck_require__
    ) {
      var __assign =
        (this && this.__assign) ||
        function () {
          __assign =
            Object.assign ||
            function (t) {
              for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s)
                  if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
              }
              return t;
            };
          return __assign.apply(this, arguments);
        };
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.expirationDate = void 0;
      var parse_date_1 = __nccwpck_require__(67);
      var expiration_month_1 = __nccwpck_require__(564);
      var expiration_year_1 = __nccwpck_require__(1);
      function verification(isValid, isPotentiallyValid, month, year) {
        return {
          isValid: isValid,
          isPotentiallyValid: isPotentiallyValid,
          month: month,
          year: year,
        };
      }
      function expirationDate(value, maxElapsedYear) {
        var date;
        if (typeof value === "string") {
          value = value.replace(/^(\d\d) (\d\d(\d\d)?)$/, "$1/$2");
          date = (0, parse_date_1.parseDate)(String(value));
        } else if (value !== null && typeof value === "object") {
          var fullDate = __assign({}, value);
          date = {
            month: String(fullDate.month),
            year: String(fullDate.year),
          };
        } else {
          return verification(false, false, null, null);
        }
        var monthValid = (0, expiration_month_1.expirationMonth)(date.month);
        var yearValid = (0, expiration_year_1.expirationYear)(
          date.year,
          maxElapsedYear
        );
        if (monthValid.isValid) {
          if (yearValid.isCurrentYear) {
            var isValidForThisYear = monthValid.isValidForThisYear;
            return verification(
              isValidForThisYear,
              isValidForThisYear,
              date.month,
              date.year
            );
          }
          if (yearValid.isValid) {
            return verification(true, true, date.month, date.year);
          }
        }
        if (monthValid.isPotentiallyValid && yearValid.isPotentiallyValid) {
          return verification(false, true, null, null);
        }
        return verification(false, false, null, null);
      }
      exports.expirationDate = expirationDate;

      /***/
    },

    /***/ 564: /***/ (__unused_webpack_module, exports) => {
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.expirationMonth = void 0;
      function verification(isValid, isPotentiallyValid, isValidForThisYear) {
        return {
          isValid: isValid,
          isPotentiallyValid: isPotentiallyValid,
          isValidForThisYear: isValidForThisYear || false,
        };
      }
      function expirationMonth(value) {
        var currentMonth = new Date().getMonth() + 1;
        if (typeof value !== "string") {
          return verification(false, false);
        }
        if (value.replace(/\s/g, "") === "" || value === "0") {
          return verification(false, true);
        }
        if (!/^\d*$/.test(value)) {
          return verification(false, false);
        }
        var month = parseInt(value, 10);
        if (isNaN(Number(value))) {
          return verification(false, false);
        }
        var result = month > 0 && month < 13;
        return verification(result, result, result && month >= currentMonth);
      }
      exports.expirationMonth = expirationMonth;

      /***/
    },

    /***/ 1: /***/ (__unused_webpack_module, exports) => {
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.expirationYear = void 0;
      var DEFAULT_VALID_NUMBER_OF_YEARS_IN_THE_FUTURE = 19;
      function verification(isValid, isPotentiallyValid, isCurrentYear) {
        return {
          isValid: isValid,
          isPotentiallyValid: isPotentiallyValid,
          isCurrentYear: isCurrentYear || false,
        };
      }
      function expirationYear(value, maxElapsedYear) {
        if (maxElapsedYear === void 0) {
          maxElapsedYear = DEFAULT_VALID_NUMBER_OF_YEARS_IN_THE_FUTURE;
        }
        var isCurrentYear;
        if (typeof value !== "string") {
          return verification(false, false);
        }
        if (value.replace(/\s/g, "") === "") {
          return verification(false, true);
        }
        if (!/^\d*$/.test(value)) {
          return verification(false, false);
        }
        var len = value.length;
        if (len < 2) {
          return verification(false, true);
        }
        var currentYear = new Date().getFullYear();
        if (len === 3) {
          // 20x === 20x
          var firstTwo = value.slice(0, 2);
          var currentFirstTwo = String(currentYear).slice(0, 2);
          return verification(false, firstTwo === currentFirstTwo);
        }
        if (len > 4) {
          return verification(false, false);
        }
        var numericValue = parseInt(value, 10);
        var twoDigitYear = Number(String(currentYear).substr(2, 2));
        var valid = false;
        if (len === 2) {
          if (String(currentYear).substr(0, 2) === value) {
            return verification(false, true);
          }
          isCurrentYear = twoDigitYear === numericValue;
          valid =
            numericValue >= twoDigitYear &&
            numericValue <= twoDigitYear + maxElapsedYear;
        } else if (len === 4) {
          isCurrentYear = currentYear === numericValue;
          valid =
            numericValue >= currentYear &&
            numericValue <= currentYear + maxElapsedYear;
        }
        return verification(valid, valid, isCurrentYear);
      }
      exports.expirationYear = expirationYear;

      /***/
    },

    /***/ 499: /***/ function (
      module,
      __unused_webpack_exports,
      __nccwpck_require__
    ) {
      var __createBinding =
        (this && this.__createBinding) ||
        (Object.create
          ? function (o, m, k, k2) {
              if (k2 === undefined) k2 = k;
              var desc = Object.getOwnPropertyDescriptor(m, k);
              if (
                !desc ||
                ("get" in desc
                  ? !m.__esModule
                  : desc.writable || desc.configurable)
              ) {
                desc = {
                  enumerable: true,
                  get: function () {
                    return m[k];
                  },
                };
              }
              Object.defineProperty(o, k2, desc);
            }
          : function (o, m, k, k2) {
              if (k2 === undefined) k2 = k;
              o[k2] = m[k];
            });
      var __setModuleDefault =
        (this && this.__setModuleDefault) ||
        (Object.create
          ? function (o, v) {
              Object.defineProperty(o, "default", {
                enumerable: true,
                value: v,
              });
            }
          : function (o, v) {
              o["default"] = v;
            });
      var __importStar =
        (this && this.__importStar) ||
        function (mod) {
          if (mod && mod.__esModule) return mod;
          var result = {};
          if (mod != null)
            for (var k in mod)
              if (
                k !== "default" &&
                Object.prototype.hasOwnProperty.call(mod, k)
              )
                __createBinding(result, mod, k);
          __setModuleDefault(result, mod);
          return result;
        };
      var creditCardType = __importStar(__nccwpck_require__(61));
      var cardholder_name_1 = __nccwpck_require__(436);
      var card_number_1 = __nccwpck_require__(705);
      var expiration_date_1 = __nccwpck_require__(730);
      var expiration_month_1 = __nccwpck_require__(564);
      var expiration_year_1 = __nccwpck_require__(1);
      var cvv_1 = __nccwpck_require__(634);
      var postal_code_1 = __nccwpck_require__(957);
      var cardValidator = {
        creditCardType: creditCardType,
        cardholderName: cardholder_name_1.cardholderName,
        number: card_number_1.cardNumber,
        expirationDate: expiration_date_1.expirationDate,
        expirationMonth: expiration_month_1.expirationMonth,
        expirationYear: expiration_year_1.expirationYear,
        cvv: cvv_1.cvv,
        postalCode: postal_code_1.postalCode,
      };
      module.exports = cardValidator;

      /***/
    },

    /***/ 947: /***/ (__unused_webpack_module, exports) => {
      // Polyfill taken from <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/isArray#Polyfill>.
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.isArray = void 0;
      exports.isArray =
        Array.isArray ||
        function (arg) {
          return Object.prototype.toString.call(arg) === "[object Array]";
        };

      /***/
    },

    /***/ 67: /***/ (__unused_webpack_module, exports, __nccwpck_require__) => {
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.parseDate = void 0;
      var expiration_year_1 = __nccwpck_require__(1);
      var is_array_1 = __nccwpck_require__(947);
      function getNumberOfMonthDigitsInDateString(dateString) {
        var firstCharacter = Number(dateString[0]);
        var assumedYear;
        /*
      if the first character in the string starts with `0`,
      we know that the month will be 2 digits.
  
      '0122' => {month: '01', year: '22'}
    */
        if (firstCharacter === 0) {
          return 2;
        }
        /*
      if the first character in the string starts with
      number greater than 1, it must be a 1 digit month
  
      '322' => {month: '3', year: '22'}
    */
        if (firstCharacter > 1) {
          return 1;
        }
        /*
      if the first 2 characters make up a number between
      13-19, we know that the month portion must be 1
  
      '139' => {month: '1', year: '39'}
    */
        if (firstCharacter === 1 && Number(dateString[1]) > 2) {
          return 1;
        }
        /*
      if the first 2 characters make up a number between
      10-12, we check if the year portion would be considered
      valid if we assumed that the month was 1. If it is
      not potentially valid, we assume the month must have
      2 digits.
  
      '109' => {month: '10', year: '9'}
      '120' => {month: '1', year: '20'} // when checked in the year 2019
      '120' => {month: '12', year: '0'} // when checked in the year 2021
    */
        if (firstCharacter === 1) {
          assumedYear = dateString.substr(1);
          return (0, expiration_year_1.expirationYear)(assumedYear)
            .isPotentiallyValid
            ? 1
            : 2;
        }
        /*
      If the length of the value is exactly 5 characters,
      we assume a full year was passed in, meaning the remaining
      single leading digit must be the month value.
  
      '12202' => {month: '1', year: '2202'}
    */
        if (dateString.length === 5) {
          return 1;
        }
        /*
      If the length of the value is more than five characters,
      we assume a full year was passed in addition to the month
      and therefore the month portion must be 2 digits.
  
      '112020' => {month: '11', year: '2020'}
    */
        if (dateString.length > 5) {
          return 2;
        }
        /*
      By default, the month value is the first value
    */
        return 1;
      }
      function parseDate(datestring) {
        var date;
        if (/^\d{4}-\d{1,2}$/.test(datestring)) {
          date = datestring.split("-").reverse();
        } else if (/\//.test(datestring)) {
          date = datestring.split(/\s*\/\s*/g);
        } else if (/\s/.test(datestring)) {
          date = datestring.split(/ +/g);
        }
        if ((0, is_array_1.isArray)(date)) {
          return {
            month: date[0] || "",
            year: date.slice(1).join(),
          };
        }
        var numberOfDigitsInMonth =
          getNumberOfMonthDigitsInDateString(datestring);
        var month = datestring.substr(0, numberOfDigitsInMonth);
        return {
          month: month,
          year: datestring.substr(month.length),
        };
      }
      exports.parseDate = parseDate;

      /***/
    },

    /***/ 163: /***/ (module) => {
      /* eslint-disable */
      /*
       * Luhn algorithm implementation in JavaScript
       * Copyright (c) 2009 Nicholas C. Zakas
       *
       * Permission is hereby granted, free of charge, to any person obtaining a copy
       * of this software and associated documentation files (the "Software"), to deal
       * in the Software without restriction, including without limitation the rights
       * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
       * copies of the Software, and to permit persons to whom the Software is
       * furnished to do so, subject to the following conditions:
       *
       * The above copyright notice and this permission notice shall be included in
       * all copies or substantial portions of the Software.
       *
       * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
       * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
       * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
       * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
       * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
       * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
       * THE SOFTWARE.
       */

      function luhn10(identifier) {
        var sum = 0;
        var alt = false;
        var i = identifier.length - 1;
        var num;
        while (i >= 0) {
          num = parseInt(identifier.charAt(i), 10);
          if (alt) {
            num *= 2;
            if (num > 9) {
              num = (num % 10) + 1; // eslint-disable-line no-extra-parens
            }
          }
          alt = !alt;
          sum += num;
          i--;
        }
        return sum % 10 === 0;
      }
      module.exports = luhn10;

      /***/
    },

    /***/ 957: /***/ (__unused_webpack_module, exports) => {
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.postalCode = void 0;
      var DEFAULT_MIN_POSTAL_CODE_LENGTH = 3;
      function verification(isValid, isPotentiallyValid) {
        return { isValid: isValid, isPotentiallyValid: isPotentiallyValid };
      }
      function postalCode(value, options) {
        if (options === void 0) {
          options = {};
        }
        var minLength = options.minLength || DEFAULT_MIN_POSTAL_CODE_LENGTH;
        if (typeof value !== "string") {
          return verification(false, false);
        } else if (value.length < minLength) {
          return verification(false, true);
        }
        return verification(true, true);
      }
      exports.postalCode = postalCode;

      /***/
    },

    /***/ 61: /***/ function (
      module,
      __unused_webpack_exports,
      __nccwpck_require__
    ) {
      var __assign =
        (this && this.__assign) ||
        function () {
          __assign =
            Object.assign ||
            function (t) {
              for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s)
                  if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
              }
              return t;
            };
          return __assign.apply(this, arguments);
        };
      var cardTypes = __nccwpck_require__(126);
      var add_matching_cards_to_results_1 = __nccwpck_require__(258);
      var is_valid_input_type_1 = __nccwpck_require__(81);
      var find_best_match_1 = __nccwpck_require__(910);
      var clone_1 = __nccwpck_require__(40);
      var customCards = {};
      var cardNames = {
        VISA: "visa",
        MASTERCARD: "mastercard",
        AMERICAN_EXPRESS: "american-express",
        DINERS_CLUB: "diners-club",
        DISCOVER: "discover",
        JCB: "jcb",
        UNIONPAY: "unionpay",
        MAESTRO: "maestro",
        ELO: "elo",
        MIR: "mir",
        HIPER: "hiper",
        HIPERCARD: "hipercard",
      };
      var ORIGINAL_TEST_ORDER = [
        cardNames.VISA,
        cardNames.MASTERCARD,
        cardNames.AMERICAN_EXPRESS,
        cardNames.DINERS_CLUB,
        cardNames.DISCOVER,
        cardNames.JCB,
        cardNames.UNIONPAY,
        cardNames.MAESTRO,
        cardNames.ELO,
        cardNames.MIR,
        cardNames.HIPER,
        cardNames.HIPERCARD,
      ];
      var testOrder = clone_1.clone(ORIGINAL_TEST_ORDER);
      function findType(cardType) {
        return customCards[cardType] || cardTypes[cardType];
      }
      function getAllCardTypes() {
        return testOrder.map(function (cardType) {
          return clone_1.clone(findType(cardType));
        });
      }
      function getCardPosition(name, ignoreErrorForNotExisting) {
        if (ignoreErrorForNotExisting === void 0) {
          ignoreErrorForNotExisting = false;
        }
        var position = testOrder.indexOf(name);
        if (!ignoreErrorForNotExisting && position === -1) {
          throw new Error('"' + name + '" is not a supported card type.');
        }
        return position;
      }
      function creditCardType(cardNumber) {
        var results = [];
        if (!is_valid_input_type_1.isValidInputType(cardNumber)) {
          return results;
        }
        if (cardNumber.length === 0) {
          return getAllCardTypes();
        }
        testOrder.forEach(function (cardType) {
          var cardConfiguration = findType(cardType);
          add_matching_cards_to_results_1.addMatchingCardsToResults(
            cardNumber,
            cardConfiguration,
            results
          );
        });
        var bestMatch = find_best_match_1.findBestMatch(results);
        if (bestMatch) {
          return [bestMatch];
        }
        return results;
      }
      creditCardType.getTypeInfo = function (cardType) {
        return clone_1.clone(findType(cardType));
      };
      creditCardType.removeCard = function (name) {
        var position = getCardPosition(name);
        testOrder.splice(position, 1);
      };
      creditCardType.addCard = function (config) {
        var existingCardPosition = getCardPosition(config.type, true);
        customCards[config.type] = config;
        if (existingCardPosition === -1) {
          testOrder.push(config.type);
        }
      };
      creditCardType.updateCard = function (cardType, updates) {
        var originalObject = customCards[cardType] || cardTypes[cardType];
        if (!originalObject) {
          throw new Error(
            '"' +
              cardType +
              "\" is not a recognized type. Use `addCard` instead.'"
          );
        }
        if (updates.type && originalObject.type !== updates.type) {
          throw new Error("Cannot overwrite type parameter.");
        }
        var clonedCard = clone_1.clone(originalObject);
        clonedCard = __assign(__assign({}, clonedCard), updates);
        customCards[clonedCard.type] = clonedCard;
      };
      creditCardType.changeOrder = function (name, position) {
        var currentPosition = getCardPosition(name);
        testOrder.splice(currentPosition, 1);
        testOrder.splice(position, 0, name);
      };
      creditCardType.resetModifications = function () {
        testOrder = clone_1.clone(ORIGINAL_TEST_ORDER);
        customCards = {};
      };
      creditCardType.types = cardNames;
      module.exports = creditCardType;

      /***/
    },

    /***/ 258: /***/ (
      __unused_webpack_module,
      exports,
      __nccwpck_require__
    ) => {
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.addMatchingCardsToResults = void 0;
      var clone_1 = __nccwpck_require__(40);
      var matches_1 = __nccwpck_require__(597);
      function addMatchingCardsToResults(
        cardNumber,
        cardConfiguration,
        results
      ) {
        var i, patternLength;
        for (i = 0; i < cardConfiguration.patterns.length; i++) {
          var pattern = cardConfiguration.patterns[i];
          if (!matches_1.matches(cardNumber, pattern)) {
            continue;
          }
          var clonedCardConfiguration = clone_1.clone(cardConfiguration);
          if (Array.isArray(pattern)) {
            patternLength = String(pattern[0]).length;
          } else {
            patternLength = String(pattern).length;
          }
          if (cardNumber.length >= patternLength) {
            clonedCardConfiguration.matchStrength = patternLength;
          }
          results.push(clonedCardConfiguration);
          break;
        }
      }
      exports.addMatchingCardsToResults = addMatchingCardsToResults;

      /***/
    },

    /***/ 126: /***/ (module) => {
      var cardTypes = {
        visa: {
          niceType: "Visa",
          type: "visa",
          patterns: [4],
          gaps: [4, 8, 12],
          lengths: [16, 18, 19],
          code: {
            name: "CVV",
            size: 3,
          },
        },
        mastercard: {
          niceType: "Mastercard",
          type: "mastercard",
          patterns: [
            [51, 55],
            [2221, 2229],
            [223, 229],
            [23, 26],
            [270, 271],
            2720,
          ],
          gaps: [4, 8, 12],
          lengths: [16],
          code: {
            name: "CVC",
            size: 3,
          },
        },
        "american-express": {
          niceType: "American Express",
          type: "american-express",
          patterns: [34, 37],
          gaps: [4, 10],
          lengths: [15],
          code: {
            name: "CID",
            size: 4,
          },
        },
        "diners-club": {
          niceType: "Diners Club",
          type: "diners-club",
          patterns: [[300, 305], 36, 38, 39],
          gaps: [4, 10],
          lengths: [14, 16, 19],
          code: {
            name: "CVV",
            size: 3,
          },
        },
        discover: {
          niceType: "Discover",
          type: "discover",
          patterns: [6011, [644, 649], 65],
          gaps: [4, 8, 12],
          lengths: [16, 19],
          code: {
            name: "CID",
            size: 3,
          },
        },
        jcb: {
          niceType: "JCB",
          type: "jcb",
          patterns: [2131, 1800, [3528, 3589]],
          gaps: [4, 8, 12],
          lengths: [16, 17, 18, 19],
          code: {
            name: "CVV",
            size: 3,
          },
        },
        unionpay: {
          niceType: "UnionPay",
          type: "unionpay",
          patterns: [
            620,
            [624, 626],
            [62100, 62182],
            [62184, 62187],
            [62185, 62197],
            [62200, 62205],
            [622010, 622999],
            622018,
            [622019, 622999],
            [62207, 62209],
            [622126, 622925],
            [623, 626],
            6270,
            6272,
            6276,
            [627700, 627779],
            [627781, 627799],
            [6282, 6289],
            6291,
            6292,
            810,
            [8110, 8131],
            [8132, 8151],
            [8152, 8163],
            [8164, 8171],
          ],
          gaps: [4, 8, 12],
          lengths: [14, 15, 16, 17, 18, 19],
          code: {
            name: "CVN",
            size: 3,
          },
        },
        maestro: {
          niceType: "Maestro",
          type: "maestro",
          patterns: [
            493698,
            [500000, 504174],
            [504176, 506698],
            [506779, 508999],
            [56, 59],
            63,
            67,
            6,
          ],
          gaps: [4, 8, 12],
          lengths: [12, 13, 14, 15, 16, 17, 18, 19],
          code: {
            name: "CVC",
            size: 3,
          },
        },
        elo: {
          niceType: "Elo",
          type: "elo",
          patterns: [
            401178,
            401179,
            438935,
            457631,
            457632,
            431274,
            451416,
            457393,
            504175,
            [506699, 506778],
            [509000, 509999],
            627780,
            636297,
            636368,
            [650031, 650033],
            [650035, 650051],
            [650405, 650439],
            [650485, 650538],
            [650541, 650598],
            [650700, 650718],
            [650720, 650727],
            [650901, 650978],
            [651652, 651679],
            [655000, 655019],
            [655021, 655058],
          ],
          gaps: [4, 8, 12],
          lengths: [16],
          code: {
            name: "CVE",
            size: 3,
          },
        },
        mir: {
          niceType: "Mir",
          type: "mir",
          patterns: [[2200, 2204]],
          gaps: [4, 8, 12],
          lengths: [16, 17, 18, 19],
          code: {
            name: "CVP2",
            size: 3,
          },
        },
        hiper: {
          niceType: "Hiper",
          type: "hiper",
          patterns: [
            637095, 63737423, 63743358, 637568, 637599, 637609, 637612,
          ],
          gaps: [4, 8, 12],
          lengths: [16],
          code: {
            name: "CVC",
            size: 3,
          },
        },
        hipercard: {
          niceType: "Hipercard",
          type: "hipercard",
          patterns: [606282],
          gaps: [4, 8, 12],
          lengths: [16],
          code: {
            name: "CVC",
            size: 3,
          },
        },
      };
      module.exports = cardTypes;

      /***/
    },

    /***/ 40: /***/ (__unused_webpack_module, exports) => {
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.clone = void 0;
      function clone(originalObject) {
        if (!originalObject) {
          return null;
        }
        return JSON.parse(JSON.stringify(originalObject));
      }
      exports.clone = clone;

      /***/
    },

    /***/ 910: /***/ (__unused_webpack_module, exports) => {
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.findBestMatch = void 0;
      function hasEnoughResultsToDetermineBestMatch(results) {
        var numberOfResultsWithMaxStrengthProperty = results.filter(function (
          result
        ) {
          return result.matchStrength;
        }).length;
        /*
         * if all possible results have a maxStrength property that means the card
         * number is sufficiently long enough to determine conclusively what the card
         * type is
         * */
        return (
          numberOfResultsWithMaxStrengthProperty > 0 &&
          numberOfResultsWithMaxStrengthProperty === results.length
        );
      }
      function findBestMatch(results) {
        if (!hasEnoughResultsToDetermineBestMatch(results)) {
          return null;
        }
        return results.reduce(function (bestMatch, result) {
          if (!bestMatch) {
            return result;
          }
          /*
           * If the current best match pattern is less specific than this result, set
           * the result as the new best match
           * */
          if (Number(bestMatch.matchStrength) < Number(result.matchStrength)) {
            return result;
          }
          return bestMatch;
        });
      }
      exports.findBestMatch = findBestMatch;

      /***/
    },

    /***/ 81: /***/ (__unused_webpack_module, exports) => {
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.isValidInputType = void 0;
      function isValidInputType(cardNumber) {
        return typeof cardNumber === "string" || cardNumber instanceof String;
      }
      exports.isValidInputType = isValidInputType;

      /***/
    },

    /***/ 597: /***/ (__unused_webpack_module, exports) => {
      /*
       * Adapted from https://github.com/polvo-labs/card-type/blob/aaab11f80fa1939bccc8f24905a06ae3cd864356/src/cardType.js#L37-L42
       * */
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.matches = void 0;
      function matchesRange(cardNumber, min, max) {
        var maxLengthToCheck = String(min).length;
        var substr = cardNumber.substr(0, maxLengthToCheck);
        var integerRepresentationOfCardNumber = parseInt(substr, 10);
        min = parseInt(String(min).substr(0, substr.length), 10);
        max = parseInt(String(max).substr(0, substr.length), 10);
        return (
          integerRepresentationOfCardNumber >= min &&
          integerRepresentationOfCardNumber <= max
        );
      }
      function matchesPattern(cardNumber, pattern) {
        pattern = String(pattern);
        return (
          pattern.substring(0, cardNumber.length) ===
          cardNumber.substring(0, pattern.length)
        );
      }
      function matches(cardNumber, pattern) {
        if (Array.isArray(pattern)) {
          return matchesRange(cardNumber, pattern[0], pattern[1]);
        }
        return matchesPattern(cardNumber, pattern);
      }
      exports.matches = matches;

      /***/
    },

    /******/
  };
  /************************************************************************/
  /******/ // The module cache
  /******/ var __webpack_module_cache__ = {};
  /******/
  /******/ // The require function
  /******/ function __nccwpck_require__(moduleId) {
    /******/ // Check if module is in cache
    /******/ var cachedModule = __webpack_module_cache__[moduleId];
    /******/ if (cachedModule !== undefined) {
      /******/ return cachedModule.exports;
      /******/
    }
    /******/ // Create a new module (and put it into the cache)
    /******/ var module = (__webpack_module_cache__[moduleId] = {
      /******/ // no module.id needed
      /******/ // no module.loaded needed
      /******/ exports: {},
      /******/
    });
    /******/
    /******/ // Execute the module function
    /******/ var threw = true;
    /******/ try {
      /******/ __webpack_modules__[moduleId].call(
        module.exports,
        module,
        module.exports,
        __nccwpck_require__
      );
      /******/ threw = false;
      /******/
    } finally {
      /******/ if (threw) delete __webpack_module_cache__[moduleId];
      /******/
    }
    /******/
    /******/ // Return the exports of the module
    /******/ return module.exports;
    /******/
  }
  /******/
  /************************************************************************/
  /******/ /* webpack/runtime/compat */
  /******/
  /******/ if (typeof __nccwpck_require__ !== "undefined")
    __nccwpck_require__.ab = __dirname + "/";
  /******/
  /************************************************************************/
  /******/
  /******/ // startup
  /******/ // Load entry module and return exports
  /******/ // This entry module is referenced by other modules so it can't be inlined
  /******/ var __webpack_exports__ = __nccwpck_require__(499);
  /******/ module.exports = __webpack_exports__;
  /******/
  /******/
})();
