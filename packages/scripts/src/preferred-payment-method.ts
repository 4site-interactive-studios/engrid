import { ENGrid, EngridLogger } from ".";

type PreferredPaymentMethodConfig = {
  preferredPaymentMethodField: string;
  defaultPaymentMethod: string[];
};

export class PreferredPaymentMethod {
  private logger: EngridLogger = new EngridLogger(
    "PreferredPaymentMethod",
    "#ffffff",
    "#1f2933",
    "⭐️"
  );

  private readonly availabilityTimeoutMs = 4000;
  private cleanupHandlers: Array<() => void> = [];
  private selectionFinalized = false;

  private config: PreferredPaymentMethodConfig = this.resolveConfig();

  constructor() {
    if (!this.shouldRun()) {
      return;
    }

    const candidates = this.buildCandidateList();
    if (candidates.length === 0) {
      this.logger.log("No payment methods to evaluate. Skipping.");
      return;
    }

    this.logger.log(
      `Evaluating preferred payment methods in order: ${candidates.join(", ")}`
    );
    this.tryCandidateAtIndex(0, candidates);
  }

  private shouldRun(): boolean {
    if (ENGrid.getPageType() !== "DONATION") {
      this.logger.log(
        "Not a donation page. Skipping preferred payment selection."
      );
      return false;
    }

    if (!this.getGiveBySelectInputs().length) {
      this.logger.log("No give-by-select inputs found. Skipping.");
      return false;
    }

    const config = ENGrid.getOption("PreferredPaymentMethod");
    if (config === false) {
      this.logger.log("PreferredPaymentMethod option disabled.");
      return false;
    }

    return true;
  }

  private resolveConfig(): PreferredPaymentMethodConfig {
    const option = ENGrid.getOption("PreferredPaymentMethod");
    if (option && typeof option === "object") {
      const preferredPaymentMethodField =
        option.preferredPaymentMethodField || "";
      const defaultPaymentMethod = Array.isArray(option.defaultPaymentMethod)
        ? option.defaultPaymentMethod.filter((item) => !!item)
        : [];
      return {
        preferredPaymentMethodField,
        defaultPaymentMethod:
          defaultPaymentMethod.length > 0 ? defaultPaymentMethod : ["card"],
      };
    }
    return {
      preferredPaymentMethodField: "",
      defaultPaymentMethod: ["card"],
    };
  }

  private buildCandidateList(): string[] {
    const candidates: string[] = [];
    const seen = new Set<string>();

    const pushCandidate = (value: string | null) => {
      if (!value) return;
      const normalized = this.normalizePaymentValue(value);
      if (!normalized || seen.has(normalized)) return;
      seen.add(normalized);
      candidates.push(normalized);
    };

    pushCandidate(this.getFieldPreference());
    pushCandidate(this.getUrlPreference());
    this.config.defaultPaymentMethod.forEach(pushCandidate);

    return candidates;
  }

  private getFieldPreference(): string | null {
    const fieldName = this.config.preferredPaymentMethodField?.trim();
    if (!fieldName) {
      return null;
    }
    const fieldValue = ENGrid.getFieldValue(fieldName);
    if (!fieldValue) {
      this.logger.log(
        `Preferred payment field "${fieldName}" is empty. Moving on.`
      );
      return null;
    }
    this.logger.log(
      `Preferred payment from field "${fieldName}" resolved to "${fieldValue}".`
    );
    return fieldValue;
  }

  private getUrlPreference(): string | null {
    const urlValue = ENGrid.getUrlParameter("payment");
    if (typeof urlValue === "string" && urlValue.trim() !== "") {
      this.logger.log(`Preferred payment from URL parameter: "${urlValue}".`);
      return urlValue;
    }
    return null;
  }

  private tryCandidateAtIndex(index: number, candidates: string[]) {
    if (this.selectionFinalized) {
      return;
    }

    if (index >= candidates.length) {
      this.logger.log("No preferred payment method was applied.");
      return;
    }

    const method = candidates[index];
    if (!this.paymentMethodExists(method)) {
      this.logger.log(`Payment method "${method}" not found. Skipping.`);
      this.tryCandidateAtIndex(index + 1, candidates);
      return;
    }

    if (this.isPaymentMethodAvailable(method)) {
      this.logger.success(`Selecting available payment method "${method}".`);
      this.applySelection(method);
      return;
    }

    this.logger.log(
      `Payment method "${method}" exists but is not available yet. Waiting up to ${this.availabilityTimeoutMs}ms.`
    );
    this.waitForAvailability(
      method,
      () => {
        if (this.selectionFinalized) return;
        if (this.isPaymentMethodAvailable(method)) {
          this.logger.success(
            `Selecting payment method "${method}" once it became available.`
          );
          this.applySelection(method);
        }
      },
      () => {
        if (this.selectionFinalized) return;
        this.logger.log(
          `Payment method "${method}" still unavailable after waiting. Trying next option.`
        );
        this.tryCandidateAtIndex(index + 1, candidates);
      }
    );
  }

  private waitForAvailability(
    method: string,
    onAvailable: () => void,
    onTimeout: () => void
  ) {
    const observers: MutationObserver[] = [];

    const cleanup = () => {
      observers.forEach((observer) => observer.disconnect());
      observers.length = 0;
      this.cleanupHandlers = this.cleanupHandlers.filter(
        (fn) => fn !== cleanup
      );
      window.clearTimeout(timeoutId);
    };

    this.cleanupHandlers.push(cleanup);

    const checkAvailability = () => {
      if (this.selectionFinalized) {
        cleanup();
        return;
      }
      if (this.isPaymentMethodAvailable(method)) {
        cleanup();
        onAvailable();
      }
    };

    const fieldContainer =
      this.getGiveBySelectContainer() || (document.body as HTMLElement);

    const domObserver = new MutationObserver(() => checkAvailability());
    domObserver.observe(fieldContainer, {
      attributes: true,
      attributeFilter: ["class", "style"],
      childList: true,
      subtree: true,
    });
    observers.push(domObserver);

    const attributeFilters = this.getAvailabilityAttributeFilters(method);
    if (attributeFilters.length > 0) {
      const attrObserver = new MutationObserver(() => checkAvailability());
      attrObserver.observe(document.body, {
        attributes: true,
        attributeFilter: attributeFilters,
      });
      observers.push(attrObserver);
    }

    const timeoutId = window.setTimeout(() => {
      cleanup();
      onTimeout();
    }, this.availabilityTimeoutMs);
  }

  private applySelection(method: string) {
    if (this.selectionFinalized) {
      return;
    }

    const input = this.findPaymentInput(method);
    if (!input) {
      this.logger.log(
        `Unable to locate give-by-select input for "${method}" during selection.`
      );
      return;
    }

    if (!this.isPaymentMethodAvailable(method)) {
      this.logger.log(`Payment method "${method}" is not available to select.`);
      return;
    }

    const label = this.findLabelForInput(input);
    if (label) {
      label.click();
    } else {
      input.checked = true;
      input.dispatchEvent(
        new Event("change", { bubbles: true, cancelable: true })
      );
    }

    ENGrid.setPaymentType(method);
    this.selectionFinalized = true;
    this.cleanupAllObservers();
  }

  private paymentMethodExists(method: string): boolean {
    return !!this.findPaymentInput(method);
  }

  private isPaymentMethodAvailable(method: string): boolean {
    const input = this.findPaymentInput(method);
    if (!input || input.disabled) {
      return false;
    }
    const container = this.getInputContainer(input);
    return container ? ENGrid.isVisible(container) : ENGrid.isVisible(input);
  }

  private findPaymentInput(method: string): HTMLInputElement | null {
    const normalized = this.normalizePaymentValue(method);
    if (!normalized) {
      return null;
    }
    const inputs = this.getGiveBySelectInputs();
    return (
      Array.from(inputs).find(
        (input) =>
          input.value && this.normalizePaymentValue(input.value) === normalized
      ) || null
    );
  }

  private getGiveBySelectInputs(): NodeListOf<HTMLInputElement> {
    return document.getElementsByName(
      "transaction.giveBySelect"
    ) as NodeListOf<HTMLInputElement>;
  }

  private getGiveBySelectContainer(): HTMLElement | null {
    return document.querySelector(
      ".en__field--give-by-select, .give-by-select"
    ) as HTMLElement;
  }

  private getInputContainer(input: HTMLInputElement): HTMLElement | null {
    return (
      input.closest(".en__field__item") ||
      input.closest(".en__field__element") ||
      (input.parentElement as HTMLElement | null)
    );
  }

  private findLabelForInput(input: HTMLInputElement): HTMLLabelElement | null {
    if (input.id) {
      const externalLabel = document.querySelector(
        `label[for="${input.id}"]`
      ) as HTMLLabelElement;
      if (externalLabel) {
        return externalLabel;
      }
    }
    return input.closest("label") as HTMLLabelElement | null;
  }

  private normalizePaymentValue(value: string): string {
    return value.trim().toLowerCase();
  }

  private getAvailabilityAttributeFilters(method: string): string[] {
    const map: { [key: string]: string[] } = {
      stripedigitalwallet: [
        "data-engrid-payment-type-option-apple-pay",
        "data-engrid-payment-type-option-google-pay",
      ],
      paypaltouch: [
        "data-engrid-payment-type-option-paypal-one-touch",
        "data-engrid-payment-type-option-venmo",
      ],
      daf: ["data-engrid-payment-type-option-daf"],
    };
    return map[method] || [];
  }

  private cleanupAllObservers() {
    this.cleanupHandlers.forEach((cleanup) => cleanup());
    this.cleanupHandlers = [];
  }
}
