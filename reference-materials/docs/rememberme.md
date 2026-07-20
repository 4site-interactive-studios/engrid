**RememberMe Configuration**

If configured, engrid will embed a 'RememberMe' opt-in checkbox that, if checked, will save the user's form details (address, name, email, etc) into a cookie and restore it whenever that user returns to an EN form. If details are saved and being auto-filled, instead of a 'RememberMe' opt-in checkbox, a 'Clear Autofill' link is shown that the use can click to make it 'forget' their details.

---

To enable, add a 'RememberMe' property to the 'options' object in your engrid theme.  It supports the following sub-properties:

**checked**: If set to true, the rememberme opt-in checkbox will be checked by default.  Defaults to false.

**remoteUrl**: Should be set to a webpage that will work as a remote repository for your form details -- it will save them into a cookie on that remote URL's domain.  If this isn't provided, the cookie will be saved to the current page's domain. Defaults to null.

**fieldNames**: An array of strings, each one corresponding to a form input's name.  Each one will be saved and autofilled via rememberme.  All other fields will be ignored by RememberMe.  Example common names worth setting: 'supporter.firstName', 'supporter.lastName', 'supporter.address1', 'supporter.address2', 'supporter.city', 'supporter.country', 'supporter.region', 'supporter.postcode', 'supporter.emailAddress'. Defaults to [].

**fieldOptInSelectorTarget**: A string containing a comma-delimited list of selectors.  The script will try each selector in turn, until it finds one that exists.  Then it will place the 'RememberMe' opt-in element relative to it (before or after, depending on the value of fieldOptInSelectorTargetLocation).  Defaults to '.en__field--emailAddress.en__field'.

**fieldOptInSelectorTargetLocation**: A string that is set to either 'before' or 'after'. Defaults to 'after'.

**fieldClearSelectorTarget**: A string containing a comma-delimited list of selectors.  The script will try each selector in turn, until it finds one that exists.  Then it will place the "Clear Autofill" link relative to it (before or after, depending on the value of fieldClearSelectorTargetLocation). Defaults to 'label[for="en__field_supporter_firstName"]'

**fieldClearSelectorTargetLocation**: A string that is set to either 'before' or 'after'. Defaults to 'before'.

**fieldClearLabel**: A string containing the text for the "Clear Autofill" link that appears when data is being auto-filled. Defaults to `(clear autofill)`.

**cookieName**: String dictating the name of the cookie stores the autofill data.  Defaults to 'engrid-autofill'.

**cookieExpirationDays**: Number of days for the cookie expiration.  Defaults to 365.

**fieldDonationAmountRadioName**: A string containing the name of the Engaging Networks donation amount radio buttons.  You can probably let this stay defaulted. Defaults to 'transaction.donationAmt'

**fieldDonationAmountOtherName**: A string containing the name of the Engaging Networks donation amount "Other" input field.  You can probably let this stay defaulted. Defaults to 'transaction.donationAmt.other'

**fieldDonationRecurrPayRadioName**: A string containing the name of the Engaging Networks frequency field.  You can probably let this stay defaulted. Defaults to 'transaction.recurrpay'

**fieldDonationRecurrFreqRadioName**: A string containing the name of the Engaging Networks recurring frequency radio buttons. You can probably let this stay defaulted. Defaults to 'transaction.recurrfreq'

**fieldDonationAmountOtherCheckboxID**: This is deprecated and will be removed.

**hide**: Boolean. If set to `true`, the Remember Me opt-in element is rendered with the `hide` CSS class, effectively keeping it invisible while still allowing the component to function. Useful when clients want autofill behavior without displaying the opt-in checkbox to the donor. Defaults to `false`.

**encryptData**: Boolean. If set to true, the saved form details are encrypted with browser-native AES-GCM (Web Crypto) before being stored, and the resulting bytes are base64-encoded. This applies to both the local cookie and the remote-iframe cookie. The encryption key is randomly generated once per device and kept in `localStorage` (never written to the cookie itself, so it never travels with the transported value). In remote mode, the key and store live in the iframe's origin, so multiple sites sharing that remote origin (e.g. FWW and FWA) share them automatically — however, note that this relies on localStorage access within the cross-origin iframe, which is subject to Chrome's third-party storage partitioning (see known limitations). If the key is missing or decryption otherwise fails (a different device, or cleared storage), the component silently discards the data and falls back to the normal, no-autofill experience. Defaults to false. When enabled with `remoteUrl`, the remote page must implement the matching encrypt/decrypt protocol (see the "Sample Remote URL Page Markup" section below for a reference starting point).

---

**Sample Remote URL Page Markup to be used as a cookie repository**

    <!DOCTYPE html>
    <html lang="en">

    <head>
      <meta charset="UTF-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>{CLIENT NAME}</title>
    </head>

    <body>
      <script>
        (function () {
          //allowed domains
          var whitelist = [
            "www.client.org",
            "act.client.org",
          ];
          function verifyOrigin(origin) {
            var domain = origin.replace(/^https?:\/\/|:\d{1,4}$/g, "").toLowerCase(),
              i = 0,
              len = whitelist.length;
            while (i < len) {
              if (whitelist[i] == domain) {
                return true;
              }
              i++;
            }
            return false;
          }
          function readCookie(name) {
            var nameEQ = encodeURIComponent(name) + "=";
            var ca = document.cookie.split(';');
            for (var i = 0; i < ca.length; i++) {
              var c = ca[i];
              while (c.charAt(0) === ' ')
                c = c.substring(1, c.length);
              if (c.indexOf(nameEQ) === 0)
                return decodeURIComponent(c.substring(nameEQ.length, c.length));
            }
            return null;
          }
          function writeCookie(name, value, days) {
            var d = new Date();
            d.setTime(d.getTime() + (days * 24 * 60 * 60 * 1000));
            document.cookie = name + "=" + JSON.stringify(value) + ";expires=" + d.toUTCString() + ';SameSite=none;Secure;';
          }
          function handleRequest(event) {
            if (verifyOrigin(event.origin)) {
              var data = JSON.parse(event.data);
              if (data.hasOwnProperty('operation') && data.hasOwnProperty('key')) {
                var retVal = {
                  id: data.id,
                  key: data.key,
                  value: null
                };
                if (data.operation == 'write' && data.hasOwnProperty('value')) {
                  writeCookie(data.key, data.value, 60);
                } else if (data.operation == 'read') {
                  retVal.value = readCookie(data.key);
                }
              }
              event.source.postMessage(JSON.stringify(retVal), event.origin);
            }
          }
          if (window.addEventListener) {
            window.addEventListener("message", handleRequest, false);
          } else if (window.attachEvent) {
            window.attachEvent("onmessage", handleRequest);
          }
        })();


      </script>
    </body>
    </html>
