// ENgrid component: CustomPremium
// Filters premium gifts based on window.EngridPageOptions.CustomPremium configuration
// Rules:
// - Config shape: window.EngridPageOptions.CustomPremium[frequency][productId] = minimumAmount
// - On frequency or amount change, wait 500ms (allow EN to re-render), then:
//   - Show only gifts whose minimumAmount <= current amount; hide others
//   - If none visible, hide entire .en__component--premiumgiftblock
//   - If current selection becomes invalid, select default; if default not visible, select "No Premium" and clear transaction.selprodvariantid
// - Run once 500ms after page load
// - Add EnForm onSubmit hook to clear transaction.selprodvariantid when no visible premium items

import {
  ENGrid,
  DonationAmount,
  DonationFrequency,
  EnForm,
  EngridLogger,
} from ".";

type FrequencyFlatProducts = { [productId: string]: number };
type FrequencyConfig = {
  products?: FrequencyFlatProducts;
  default?: number | string;
} & FrequencyFlatProducts;
type CustomPremiumConfig = { [frequency: string]: FrequencyConfig };

export class CustomPremium {
  private logger: EngridLogger = new EngridLogger(
    "CustomPremium",
    "teal",
    "white",
    "🧩"
  );
  private _amount = DonationAmount.getInstance();
  private _frequency = DonationFrequency.getInstance();
  private _enForm = EnForm.getInstance();
  private debounceTimer: number | undefined;
  private stylesInjected = false;
  private pendingFrequencyChange: boolean = false;

  constructor() {
    if (!this.shouldRun()) return;

    this.injectStyles();

    // Initial run: execute once after 500ms
    window.setTimeout(() => this.run(), 500);

    // On changes, schedule processing and fade out immediately
    this._amount.onAmountChange.subscribe(() => this.scheduleRun());
    this._frequency.onFrequencyChange.subscribe(() => {
      this.pendingFrequencyChange = true;
      this.scheduleRun();
    });

    // Clear hidden variant field on submit if there are no visible premium items
    this._enForm.onSubmit.subscribe(() => {
      if (!this.hasVisiblePremiumItems()) {
        this.clearVariantField();
      }
    });
  }

  private shouldRun() {
    const isPremiumPage =
      "pageJson" in window &&
      "pageType" in window.pageJson &&
      window.pageJson.pageType === "premiumgift";
    const hasConfig = !!ENGrid.getOption("CustomPremium");
    return isPremiumPage && hasConfig;
  }

  private get config(): CustomPremiumConfig | null {
    const cfg = ENGrid.getOption("CustomPremium") as
      | CustomPremiumConfig
      | undefined;
    return cfg || null;
  }

  private get premiumContainer(): HTMLElement | null {
    return document.querySelector(
      ".en__component--premiumgiftblock"
    ) as HTMLElement;
  }

  private get giftItems(): HTMLElement[] {
    return Array.from(document.querySelectorAll(".en__pg")) as HTMLElement[];
  }

  private getFrequencyConfig(frequency: string): FrequencyConfig | null {
    const customPremiumConfig = this.config;
    if (!customPremiumConfig) return null;
    const frequencyConfig = customPremiumConfig[frequency];
    if (frequencyConfig && typeof frequencyConfig === "object")
      return frequencyConfig as FrequencyConfig;
    return null;
  }

  private getProductsMap(frequency: string): FrequencyFlatProducts {
    const frequencyConfig = this.getFrequencyConfig(frequency);
    const productsMap: FrequencyFlatProducts = {};
    if (!frequencyConfig) return productsMap;
    // If explicit products object exists, use it
    if (
      frequencyConfig.products &&
      typeof frequencyConfig.products === "object"
    ) {
      Object.entries(frequencyConfig.products).forEach(([productId, min]) => {
        const id = String(productId);
        const minAmount = Number(min);
        if (!isNaN(minAmount)) productsMap[id] = minAmount;
      });
      return productsMap;
    }
    // Otherwise, treat own numeric-value keys as products, ignore 'default'
    Object.entries(frequencyConfig).forEach(([key, value]) => {
      if (key === "default") return;
      const minAmount = Number(value as any);
      if (!isNaN(minAmount)) productsMap[String(key)] = minAmount;
    });
    return productsMap;
  }

  private getConfiguredDefaultPid(frequency: string): string | null {
    const frequencyConfig = this.getFrequencyConfig(frequency);
    if (!frequencyConfig) return null;
    const defaultValue = (frequencyConfig as any).default;
    if (defaultValue === undefined || defaultValue === null) return "0"; // not set => No Premium by spec
    const id = String(defaultValue);
    return id;
  }

  private injectStyles() {
    if (this.stylesInjected) return;
    const id = "engrid-custom-premium-style";
    if (document.getElementById(id)) {
      this.stylesInjected = true;
      return;
    }
    const style = document.createElement("style");
    style.id = id;
    style.innerHTML = `
      .en__component--premiumgiftblock { transition: opacity 200ms ease-in-out; }
      .en__component--premiumgiftblock.engrid-premium-processing { opacity: 0; pointer-events: none; }
      .en__component--premiumgiftblock.engrid-premium-hidden { display: none !important; }
      .en__component--premiumgiftblock.engrid-premium-ready { opacity: 1; }
    `;
    document.head.appendChild(style);
    this.stylesInjected = true;
  }

  private startProcessingVisual() {
    const container = this.premiumContainer;
    if (container) {
      container.classList.add("engrid-premium-processing");
      container.classList.remove("engrid-premium-ready");
    }
  }

  private endProcessingVisual(hasVisible: boolean) {
    const container = this.premiumContainer;
    if (!container) return;
    container.classList.remove("engrid-premium-processing");
    if (hasVisible) {
      container.classList.remove("engrid-premium-hidden");
      container.classList.add("engrid-premium-ready");
    } else {
      container.classList.add("engrid-premium-hidden");
      container.classList.remove("engrid-premium-ready");
    }
  }

  private scheduleRun() {
    // Immediately fade out while we wait for EN to re-render
    this.startProcessingVisual();
    if (this.debounceTimer) window.clearTimeout(this.debounceTimer);
    this.debounceTimer = window.setTimeout(() => this.run(), 500);
  }

  private getCurrentFreq(): string {
    return (this._frequency.frequency || "onetime").toLowerCase();
  }

  private getCurrentAmount(): number {
    return this._amount.amount || 0;
  }

  private getAllowedProductIds(freq: string, amount: number): Set<string> {
    const cfg = this.config;
    const allowed = new Set<string>();
    if (!cfg) return allowed;
    const products = this.getProductsMap(freq);
    Object.keys(products).forEach((pid) => {
      const min = Number(products[pid]);
      if (!isNaN(min) && amount >= min) allowed.add(String(pid));
    });
    return allowed;
  }

  private getProductId(item: HTMLElement): string | null {
    const input = item.querySelector(
      'input[name="en__pg"]'
    ) as HTMLInputElement | null;
    return input ? input.value : null;
  }

  private showItem(item: HTMLElement, show: boolean) {
    (item.style as any).display = show ? "" : "none";
  }

  private selectByProductId(productId: string) {
    const radio = document.querySelector(
      'input[name="en__pg"][value="' + productId + '"]'
    ) as HTMLInputElement | null;
    if (radio) {
      radio.checked = true;
      radio.dispatchEvent(
        new Event("change", { bubbles: true, cancelable: true })
      );
      // Update EN's selected class if necessary
      const prev = document.querySelector(".en__pg--selected");
      const pg = radio.closest(".en__pg");
      if (prev && prev !== pg) prev.classList.remove("en__pg--selected");
      if (pg) pg.classList.add("en__pg--selected");
    }
  }

  private clearVariantField() {
    ENGrid.setFieldValue("transaction.selprodvariantid", "");
  }

  private hasVisiblePremiumItems(): boolean {
    // Exclude the "No Premium" (value 0) from count
    return this.giftItems.some((item) => {
      const pid = this.getProductId(item);
      const visible = ENGrid.isVisible(item);
      return visible && pid !== "0";
    });
  }

  private run() {
    const container = this.premiumContainer;
    if (!container) return this.logger.log("No premium container found.");
    const frequency = this.getCurrentFreq();
    const amount = this.getCurrentAmount();
    const allowedProductIds = this.getAllowedProductIds(frequency, amount);

    // Iterate items and toggle visibility
    let anyVisible = false;
    const items = this.giftItems;
    const noPremiumItems: HTMLElement[] = [];
    items.forEach((item) => {
      const productId = this.getProductId(item);
      if (!productId) return;
      if (productId === "0") {
        // track no-premium items but don't decide visibility here — it's always available
        noPremiumItems.push(item);
        this.showItem(item, true);
        return;
      }
      const visible = allowedProductIds.has(productId);
      this.showItem(item, visible);
      if (visible) anyVisible = true;
    });

    // If nothing visible (besides no-premium), hide whole container
    const hasVisibleGifts = anyVisible;
    this.endProcessingVisual(hasVisibleGifts);

    // Selection handling
    const current = document.querySelector(
      'input[name="en__pg"]:checked'
    ) as HTMLInputElement | null;
    const currentProductId = current?.value || null;

    const defaultProductId = this.getConfiguredDefaultPid(frequency); // may be "0"

    // If current selection is invalid after filtering, apply default logic
    const currentIsValid =
      currentProductId === "0" ||
      (currentProductId ? allowedProductIds.has(currentProductId) : false);
    if (!currentIsValid) {
      if (
        defaultProductId &&
        defaultProductId !== "0" &&
        allowedProductIds.has(defaultProductId)
      ) {
        this.selectByProductId(defaultProductId);
      } else {
        this.selectByProductId("0");
        this.clearVariantField();
      }
    } else {
      // Current selection is valid; only force No Premium if frequency changed and default is 0/missing
      if (
        this.pendingFrequencyChange &&
        (!defaultProductId || defaultProductId === "0")
      ) {
        if (currentProductId !== "0") {
          this.selectByProductId("0");
          this.clearVariantField();
        }
      }
    }

    // If container hidden (no visible gifts), select No Premium and clear hidden
    if (!hasVisibleGifts) {
      this.selectByProductId("0");
      this.clearVariantField();
    }

    this.logger.log(
      `Processed gifts for freq=${frequency}, amount=${amount}. Visible gifts: ${
        hasVisibleGifts ? "yes" : "no"
      }`
    );
    // Reset frequency-change flag after processing
    this.pendingFrequencyChange = false;
  }
}
