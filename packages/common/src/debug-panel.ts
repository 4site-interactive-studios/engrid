import { ENGrid, EngridLogger, BrandingHtml } from "./";

interface QuickfillData {
  name: string;
  value: string;
}

interface QuickfillObject {
  [key: string]: QuickfillData[];
}

export class DebugPanel {
  private logger: EngridLogger = new EngridLogger(
    "Debug Panel",
    "#f0f0f0",
    "#ff0000",
    "💥"
  );

  private element: HTMLElement | null = null;

  private currentTimestamp: string = this.getCurrentTimestamp();

  public static debugSessionStorageKey = "engrid_debug_panel";

  private pageLayouts: string[] | undefined;

  private quickFills: QuickfillObject = {
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

  constructor(pageLayouts: string[] | undefined) {
    this.logger.log("Adding debug panel and starting a debug session");

    this.pageLayouts = pageLayouts;

    this.loadDebugPanel();

    this.element = document.querySelector(".debug-panel");
    this.element?.addEventListener("click", () => {
      this.element?.classList.add("debug-panel--open");
    });

    const debugPanelClose = document.querySelector(".debug-panel__close");

    debugPanelClose?.addEventListener("click", (e) => {
      e.stopPropagation();
      this.element?.classList.remove("debug-panel--open");
    });

    if (ENGrid.getUrlParameter("assets") === "local") {
      this.element?.classList.add("debug-panel--local");
    }

    window.sessionStorage.setItem(DebugPanel.debugSessionStorageKey, "active");
  }

  private loadDebugPanel() {
    document.body.insertAdjacentHTML(
      "beforeend",
      `<div class="debug-panel">
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
              <div class="debug-panel__option">
                <button class="btn debug-panel__btn debug-panel__btn--edit" type="button">Open edit page</button>
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
        </div>`
    );

    this.setupLayoutSwitcher();
    this.setupThemeSwitcher();
    this.setupSubThemeSwitcher();
    this.setupFormQuickfill();
    this.createDebugSessionEndHandler();
    this.setupEmbeddedLayoutSwitcher();
    this.setupDebugLayoutSwitcher();
    this.setupBrandingHtmlHandler();
    this.setupEditBtnHandler();
  }

  private switchENGridLayout(layout: string) {
    ENGrid.setBodyData("layout", layout);
  }

  private setupLayoutSwitcher() {
    const engridLayoutSwitch = document.getElementById(
      "engrid-layout-switch"
    ) as HTMLSelectElement;

    if (engridLayoutSwitch) {
      this.pageLayouts?.forEach((layout) => {
        engridLayoutSwitch.insertAdjacentHTML(
          "beforeend",
          `<option value="${layout}">${layout}</option>`
        );
      });

      engridLayoutSwitch.value = ENGrid.getBodyData("layout") ?? "";

      engridLayoutSwitch.addEventListener("change", (e) => {
        const target = e.target as HTMLSelectElement;
        this.switchENGridLayout(target.value);
      });
    }
  }

  private setupThemeSwitcher() {
    const engridThemeInput = document.getElementById(
      "engrid-theme"
    ) as HTMLInputElement;

    if (engridThemeInput) {
      engridThemeInput.value = ENGrid.getBodyData("theme") ?? "";
      ["keyup", "blur"].forEach((ev) => {
        engridThemeInput.addEventListener(ev, (e) => {
          const target = e.target as HTMLInputElement;
          this.switchENGridTheme(target.value);
        });
      });
    }
  }

  private switchENGridTheme(theme: string) {
    ENGrid.setBodyData("theme", theme);
  }

  private setupSubThemeSwitcher() {
    const engridSubthemeInput = document.getElementById(
      "engrid-subtheme"
    ) as HTMLInputElement;

    if (engridSubthemeInput) {
      engridSubthemeInput.value = ENGrid.getBodyData("subtheme") ?? "";
      ["keyup", "blur"].forEach((ev) => {
        engridSubthemeInput.addEventListener(ev, (e) => {
          const target = e.target as HTMLInputElement;
          this.switchENGridSubtheme(target.value);
        });
      });
    }
  }

  private switchENGridSubtheme(subtheme: string) {
    ENGrid.setBodyData("subtheme", subtheme);
  }

  private setupFormQuickfill() {
    const engridQuickfill = document.getElementById(
      "engrid-form-quickfill"
    ) as HTMLSelectElement;

    engridQuickfill?.addEventListener("change", (e) => {
      const target = e.target as HTMLSelectElement;
      this.quickFills[target.value].forEach((qf) => {
        this.setFieldValue(qf);
      });
    });
  }

  private setFieldValue(qf: QuickfillData) {
    if (qf.name === "transaction.ccexpire") {
      const ccExpireEls = document.getElementsByName(
        "transaction.ccexpire"
      ) as NodeListOf<HTMLInputElement>;
      if (ccExpireEls.length > 0) {
        const expirationDate = qf.value.split("/");
        ccExpireEls[0].value = expirationDate[0];
        ccExpireEls[1].value = expirationDate[1];
      } else {
        ccExpireEls[0].value = qf.value;
      }
      return;
    }

    ENGrid.setFieldValue(qf.name, qf.value);
  }

  private getCurrentTimestamp() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    return `${year}${month}${day}-${hours}${minutes}`;
  }

  private createDebugSessionEndHandler() {
    const debugSessionEndBtn = document.querySelector(".debug-panel__btn--end");

    debugSessionEndBtn?.addEventListener("click", () => {
      this.logger.log("Removing panel and ending debug session");
      this.element?.remove();
      window.sessionStorage.removeItem(DebugPanel.debugSessionStorageKey);
    });
  }

  private setupEmbeddedLayoutSwitcher() {
    const embeddedLayoutSwitch = document.getElementById(
      "engrid-embedded-layout"
    ) as HTMLInputElement;

    if (embeddedLayoutSwitch) {
      embeddedLayoutSwitch.checked = !!ENGrid.getBodyData("embedded");
      embeddedLayoutSwitch.addEventListener("change", (e) => {
        const target = e.target as HTMLInputElement;
        ENGrid.setBodyData("embedded", target.checked);
      });
    }
  }

  private setupDebugLayoutSwitcher() {
    const debugLayoutSwitch = document.getElementById(
      "engrid-debug-layout"
    ) as HTMLInputElement;

    if (debugLayoutSwitch) {
      debugLayoutSwitch.checked = ENGrid.getBodyData("debug") === "layout";
      debugLayoutSwitch.addEventListener("change", (e) => {
        const target = e.target as HTMLInputElement;
        if (target.checked) {
          ENGrid.setBodyData("debug", "layout");
        } else {
          ENGrid.setBodyData("debug", "");
        }
      });
    }
  }

  private setupBrandingHtmlHandler() {
    const brandingHtmlBtn = document.querySelector(
      ".debug-panel__btn--branding"
    ) as HTMLButtonElement;

    if (ENGrid.getUrlParameter("development") === "branding") {
      brandingHtmlBtn.setAttribute("disabled", "");
    }

    brandingHtmlBtn?.addEventListener("click", (e) => {
      new BrandingHtml();
      const el = e.target as HTMLButtonElement;
      el.setAttribute("disabled", "");
    });
  }

  private setupEditBtnHandler() {
    const editBtn = document.querySelector(
      ".debug-panel__btn--edit"
    ) as HTMLButtonElement;

    editBtn?.addEventListener("click", () => {
      window.open(
        `https://${ENGrid.getDataCenter()}.engagingnetworks.app/index.html#pages/${ENGrid.getPageID()}/edit`,
        "_blank"
      );
    });
  }
}
