import { ENGrid, EngridLogger, BrandingHtml } from "./";
export class DebugPanel {
    constructor(pageLayouts) {
        var _a, _b;
        this.logger = new EngridLogger("Debug Panel", "#f0f0f0", "#ff0000", "💥");
        this.element = null;
        this.currentTimestamp = this.getCurrentTimestamp();
        this.quickFills = {
            "pi-general": [
                {
                    name: "supporter.title",
                    value: "Ms",
                },
                {
                    name: "supporter.firstName",
                    value: "4Site",
                },
                {
                    name: "supporter.lastName",
                    value: "Studio",
                },
                {
                    name: "supporter.emailAddress",
                    value: "en-test@4sitestudios.com",
                },
                {
                    name: "supporter.phoneNumber",
                    value: "555-555-5555",
                },
            ],
            "pi-unique": [
                {
                    name: "supporter.title",
                    value: "Ms",
                },
                {
                    name: "supporter.firstName",
                    value: `4Site ${this.currentTimestamp}`,
                },
                {
                    name: "supporter.lastName",
                    value: "Studio",
                },
                {
                    name: "supporter.emailAddress",
                    value: `en-test+${this.currentTimestamp}@4sitestudios.com`,
                },
                {
                    name: "supporter.phoneNumber",
                    value: "555-555-5555",
                },
            ],
            "us-address": [
                {
                    name: "supporter.address1",
                    value: "3431 14th St NW",
                },
                {
                    name: "supporter.address2",
                    value: "Suite 1",
                },
                {
                    name: "supporter.city",
                    value: "Washington",
                },
                {
                    name: "supporter.region",
                    value: "DC",
                },
                {
                    name: "supporter.postcode",
                    value: "20010",
                },
                {
                    name: "supporter.country",
                    value: "US",
                },
            ],
            "us-address-senate-rep": [
                {
                    name: "supporter.address1",
                    value: "20 W 34th Street",
                },
                {
                    name: "supporter.address2",
                    value: "",
                },
                {
                    name: "supporter.city",
                    value: "New York",
                },
                {
                    name: "supporter.region",
                    value: "NY",
                },
                {
                    name: "supporter.postcode",
                    value: "10001",
                },
                {
                    name: "supporter.country",
                    value: "US",
                },
            ],
            "us-address-nonexistent": [
                {
                    name: "supporter.address1",
                    value: "12345 Main Street",
                },
                {
                    name: "supporter.address2",
                    value: "",
                },
                {
                    name: "supporter.city",
                    value: "New York",
                },
                {
                    name: "supporter.region",
                    value: "TX",
                },
                {
                    name: "supporter.postcode",
                    value: "90210",
                },
                {
                    name: "supporter.country",
                    value: "US",
                },
            ],
            "cc-paysafe-visa": [
                {
                    name: "transaction.ccnumber",
                    value: "4530910000012345",
                },
                {
                    name: "transaction.ccexpire",
                    value: "12/27",
                },
                {
                    name: "transaction.ccvv",
                    value: "111",
                },
            ],
            "cc-paysafe-visa-invalid": [
                {
                    name: "transaction.ccnumber",
                    value: "411111",
                },
                {
                    name: "transaction.ccexpire",
                    value: "12/27",
                },
                {
                    name: "transaction.ccvv",
                    value: "111",
                },
            ],
            "cc-paysafe-mastercard": [
                {
                    name: "transaction.ccnumber",
                    value: "5036150000001115",
                },
                {
                    name: "transaction.ccexpire",
                    value: "12/27",
                },
                {
                    name: "transaction.ccvv",
                    value: "111",
                },
            ],
        };
        this.logger.log("Adding debug panel and starting a debug session");
        this.pageLayouts = pageLayouts;
        this.loadDebugPanel();
        this.element = document.querySelector(".debug-panel");
        (_a = this.element) === null || _a === void 0 ? void 0 : _a.addEventListener("click", () => {
            var _a;
            (_a = this.element) === null || _a === void 0 ? void 0 : _a.classList.add("debug-panel--open");
        });
        const debugPanelClose = document.querySelector(".debug-panel__close");
        debugPanelClose === null || debugPanelClose === void 0 ? void 0 : debugPanelClose.addEventListener("click", (e) => {
            var _a;
            e.stopPropagation();
            (_a = this.element) === null || _a === void 0 ? void 0 : _a.classList.remove("debug-panel--open");
        });
        if (ENGrid.getUrlParameter("assets") === "local") {
            (_b = this.element) === null || _b === void 0 ? void 0 : _b.classList.add("debug-panel--local");
        }
        window.sessionStorage.setItem(DebugPanel.debugSessionStorageKey, "active");
    }
    loadDebugPanel() {
        document.body.insertAdjacentHTML("beforeend", `<div class="debug-panel">
          <div class="debug-panel__container">
            <div class="debug-panel__closed-title">Debug</div>
            <div class="debug-panel__title">
              <h2>Debug Panel</h2>
              <div class="debug-panel__close">X</div>
            </div>
            <div class="debug-panel__options">
              <div class="debug-panel__option">
                <label for="engrid-layout-switch">Switch layout</label>
                <select name="engrid-layout" id="engrid-layout-switch">
                </select>
              </div>
              <div class="debug-panel__option">
                <div class="debug-panel__checkbox">
                  <input type="checkbox" name="engrid-embedded-layout" id="engrid-embedded-layout">
                  <label for="engrid-embedded-layout">Embedded layout</label>            
                </div>
              </div>
              <div class="debug-panel__option">
                <label for="engrid-theme">Theme</label>
                <input type="text" id="engrid-theme">
              </div>
              <div class="debug-panel__option">
                <label for="engrid-theme">Sub-theme</label>
                <input type="text" id="engrid-subtheme">
              </div>
              <div class="debug-panel__option">
                <label for="engrid-form-quickfill">Form Quick-fill</label>
                <select name="engrid-form-quickfill" id="engrid-form-quickfill">
                  <option disabled selected>Choose an option</option>
                  <option value="pi-general">Personal Info - General</option>
                  <option value="pi-unique">Personal Info - Unique</option>
                  <option value="us-address-senate-rep">US Address - w/ Senate Rep</option>
                  <option value="us-address">US Address - w/o Senate Rep</option>
                  <option value="us-address-nonexistent">US Address - Nonexistent</option>
                  <option value="cc-paysafe-visa">CC - Paysafe - Visa</option>
                  <option value="cc-paysafe-visa-invalid">CC - Paysafe - Visa (Invalid)</option>
                  <option value="cc-paysafe-mastercard">CC - Paysafe - Mastercard</option>
                </select>
              </div>
              <div class="debug-panel__option debug-panel__option--local">
                <div class="debug-panel__checkbox">
                  <input type="checkbox" name="engrid-debug-layout" id="engrid-debug-layout">
                  <label for="engrid-debug-layout">Debug layout</label>            
                </div>
              </div>
              <div class="debug-panel__option debug-panel__option--local">
                <button class="btn debug-panel__btn debug-panel__btn--branding" type="button">Insert branding HTML</button>
              </div>
              <div class="debug-panel__option">
                <button class="btn debug-panel__btn debug-panel__btn--end" type="button">End debug session</button>
              </div>
            </div>
          </div>
        </div>`);
        this.setupLayoutSwitcher();
        this.setupThemeSwitcher();
        this.setupSubThemeSwitcher();
        this.setupFormQuickfill();
        this.createDebugSessionEndHandler();
        this.setupEmbeddedLayoutSwitcher();
        this.setupDebugLayoutSwitcher();
        this.setupBrandingHtmlHandler();
    }
    switchENGridLayout(layout) {
        ENGrid.setBodyData("layout", layout);
    }
    setupLayoutSwitcher() {
        var _a, _b;
        const engridLayoutSwitch = document.getElementById("engrid-layout-switch");
        if (engridLayoutSwitch) {
            (_a = this.pageLayouts) === null || _a === void 0 ? void 0 : _a.forEach((layout) => {
                engridLayoutSwitch.insertAdjacentHTML("beforeend", `<option value="${layout}">${layout}</option>`);
            });
            engridLayoutSwitch.value = (_b = ENGrid.getBodyData("layout")) !== null && _b !== void 0 ? _b : "";
            engridLayoutSwitch.addEventListener("change", (e) => {
                const target = e.target;
                this.switchENGridLayout(target.value);
            });
        }
    }
    setupThemeSwitcher() {
        var _a;
        const engridThemeInput = document.getElementById("engrid-theme");
        if (engridThemeInput) {
            engridThemeInput.value = (_a = ENGrid.getBodyData("theme")) !== null && _a !== void 0 ? _a : "";
            ["keyup", "blur"].forEach((ev) => {
                engridThemeInput.addEventListener(ev, (e) => {
                    const target = e.target;
                    this.switchENGridTheme(target.value);
                });
            });
        }
    }
    switchENGridTheme(theme) {
        ENGrid.setBodyData("theme", theme);
    }
    setupSubThemeSwitcher() {
        var _a;
        const engridSubthemeInput = document.getElementById("engrid-subtheme");
        if (engridSubthemeInput) {
            engridSubthemeInput.value = (_a = ENGrid.getBodyData("subtheme")) !== null && _a !== void 0 ? _a : "";
            ["keyup", "blur"].forEach((ev) => {
                engridSubthemeInput.addEventListener(ev, (e) => {
                    const target = e.target;
                    this.switchENGridSubtheme(target.value);
                });
            });
        }
    }
    switchENGridSubtheme(subtheme) {
        ENGrid.setBodyData("subtheme", subtheme);
    }
    setupFormQuickfill() {
        const engridQuickfill = document.getElementById("engrid-form-quickfill");
        engridQuickfill === null || engridQuickfill === void 0 ? void 0 : engridQuickfill.addEventListener("change", (e) => {
            const target = e.target;
            this.quickFills[target.value].forEach((qf) => {
                this.setFieldValue(qf);
            });
        });
    }
    setFieldValue(qf) {
        if (qf.name === "transaction.ccexpire") {
            const ccExpireEls = document.getElementsByName("transaction.ccexpire");
            if (ccExpireEls.length > 0) {
                const expirationDate = qf.value.split("/");
                ccExpireEls[0].value = expirationDate[0];
                ccExpireEls[1].value = expirationDate[1];
            }
            else {
                ccExpireEls[0].value = qf.value;
            }
            return;
        }
        ENGrid.setFieldValue(qf.name, qf.value);
    }
    getCurrentTimestamp() {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, "0");
        const day = String(now.getDate()).padStart(2, "0");
        const hours = String(now.getHours()).padStart(2, "0");
        const minutes = String(now.getMinutes()).padStart(2, "0");
        return `${year}${month}${day}-${hours}${minutes}`;
    }
    createDebugSessionEndHandler() {
        const debugSessionEndBtn = document.querySelector(".debug-panel__btn--end");
        debugSessionEndBtn === null || debugSessionEndBtn === void 0 ? void 0 : debugSessionEndBtn.addEventListener("click", () => {
            var _a;
            this.logger.log("Removing panel and ending debug session");
            (_a = this.element) === null || _a === void 0 ? void 0 : _a.remove();
            window.sessionStorage.removeItem(DebugPanel.debugSessionStorageKey);
        });
    }
    setupEmbeddedLayoutSwitcher() {
        const embeddedLayoutSwitch = document.getElementById("engrid-embedded-layout");
        if (embeddedLayoutSwitch) {
            embeddedLayoutSwitch.checked = !!ENGrid.getBodyData("embedded");
            embeddedLayoutSwitch.addEventListener("change", (e) => {
                const target = e.target;
                ENGrid.setBodyData("embedded", target.checked);
            });
        }
    }
    setupDebugLayoutSwitcher() {
        const debugLayoutSwitch = document.getElementById("engrid-debug-layout");
        if (debugLayoutSwitch) {
            debugLayoutSwitch.checked = ENGrid.getBodyData("debug") === "layout";
            debugLayoutSwitch.addEventListener("change", (e) => {
                const target = e.target;
                if (target.checked) {
                    ENGrid.setBodyData("debug", "layout");
                }
                else {
                    ENGrid.setBodyData("debug", "");
                }
            });
        }
    }
    setupBrandingHtmlHandler() {
        const brandingHtmlBtn = document.querySelector(".debug-panel__btn--branding");
        if (ENGrid.getUrlParameter("development") === "branding") {
            brandingHtmlBtn.setAttribute("disabled", "");
        }
        brandingHtmlBtn === null || brandingHtmlBtn === void 0 ? void 0 : brandingHtmlBtn.addEventListener("click", (e) => {
            new BrandingHtml();
            const el = e.target;
            el.setAttribute("disabled", "");
        });
    }
}
DebugPanel.debugSessionStorageKey = "engrid_debug_panel";
