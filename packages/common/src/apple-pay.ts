import { DonationAmount, EnForm } from "@4site/engrid-events/src";

/*global window */
const ApplePaySession = (window as any).ApplePaySession;
const merchantIdentifier = (window as any).merchantIdentifier;
const merchantDomainName = (window as any).merchantDomainName;
const merchantDisplayName = (window as any).merchantDisplayName;
const merchantSessionIdentifier = (window as any).merchantSessionIdentifier;
const merchantNonce = (window as any).merchantNonce;
const merchantEpochTimestamp = (window as any).merchantEpochTimestamp;
const merchantSignature = (window as any).merchantSignature;
const merchantCountryCode = (window as any).merchantCountryCode;
const merchantCurrencyCode = (window as any).merchantCurrencyCode;
const merchantSupportedNetworks = (window as any).merchantSupportedNetworks;
const merchantCapabilities = (window as any).merchantCapabilities;
const merchantTotalLabel = (window as any).merchantTotalLabel;

export default class ApplePay {

    public applePay: HTMLInputElement = document.querySelector('.en__field__input.en__field__input--radio[value="applepay"]') as HTMLInputElement;
    public _amount: DonationAmount = amount;
    constructor() {
        this.checkApplePay();
    }

    private async checkApplePay() {
        const pageform = document.querySelector("form.en__component--page") as HTMLFormElement;
        if (!this.applePay || !window.hasOwnProperty('ApplePaySession')) return false;

        const promise = ApplePaySession.canMakePaymentsWithActiveCard(merchantIdentifier);
        let applePayEnabled: Boolean = false;
        await promise.then((canMakePayments: Boolean) => {
            applePayEnabled = canMakePayments;
            if (canMakePayments) {
                let input = document.createElement("input");
                input.setAttribute("type", "hidden");
                input.setAttribute("name", "PkPaymentToken");
                input.setAttribute("id", "applePayToken");
                pageform.appendChild(input);
                form.onSubmit.subscribe(() => this.onPayClicked());
            }
        });
        console.log('applePayEnabled', applePayEnabled);
        let applePayWrapper = this.applePay.closest('.en__field__item') as HTMLDivElement;
        if (applePayEnabled) {
            // Set Apple Pay Class
            applePayWrapper?.classList.add('applePayWrapper');
        } else {
            // Hide Apple Pay Wrapper
            if (applePayWrapper) applePayWrapper.style.display = 'none';
        }
        return applePayEnabled;
    }

    public performValidation(url: string) {
        return new Promise(function (resolve, reject) {
            var merchantSession: any = {};
            merchantSession.merchantIdentifier = merchantIdentifier;
            merchantSession.merchantSessionIdentifier = merchantSessionIdentifier;
            merchantSession.nonce = merchantNonce;
            merchantSession.domainName = merchantDomainName;
            merchantSession.epochTimestamp = merchantEpochTimestamp;
            merchantSession.signature = merchantSignature;
            var validationData = "&merchantIdentifier=" + merchantIdentifier + "&merchantDomain=" + merchantDomainName + "&displayName=" + merchantDisplayName;
            var validationUrl = '/ea-dataservice/rest/applepay/validateurl?url=' + url + validationData;
            var xhr = new XMLHttpRequest();
            xhr.onload = function () {
                var data = JSON.parse(this.responseText);
                resolve(data);
            };
            xhr.onerror = reject;
            xhr.open('GET', validationUrl);
            xhr.send();
        });
    }

    private log(name: string, msg: string) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', '/ea-dataservice/rest/applepay/log?name=' + name + '&msg=' + msg);
        xhr.send();
    }

    public sendPaymentToken(token: any) {
        return new Promise(function (resolve, reject) {
            resolve(true);
        });
    }

    private onPayClicked() {
        const enFieldPaymentType = document.querySelector(
            "#en__field_transaction_paymenttype"
        ) as HTMLSelectElement;
        // Only work if Payment Type is Apple Pay
        if (enFieldPaymentType.value == 'applepay') {
            try {
                let donationAmount = this._amount.amount;
                var request = {
                    supportedNetworks: merchantSupportedNetworks,
                    merchantCapabilities: merchantCapabilities,
                    countryCode: merchantCountryCode,
                    currencyCode: merchantCurrencyCode,
                    total: {
                        label: merchantTotalLabel,
                        amount: donationAmount
                    }
                }
                var session = new ApplePaySession(1, request);
                session.onvalidatemerchant = function (event: any) {
                    this.performValidation(event.validationURL).then(function (merchantSession: any) {
                        session.completeMerchantValidation(merchantSession);
                    });
                }
                session.onpaymentauthorized = function (event: any) {
                    this.sendPaymentToken(event.payment.token).then(function (success: any) {
                        (document.getElementById("applePayToken") as HTMLInputElement).value = JSON.stringify(event.payment.token);
                    });
                }
                session.oncancel = function (event: any) {
                    console.log('Cancelled', event);
                    alert("You cancelled. Sorry it didn't work out.");
                }
                session.begin();
            } catch (e) {
                alert("Developer mistake: '" + e.message + "'");
            }
        }

    }
}