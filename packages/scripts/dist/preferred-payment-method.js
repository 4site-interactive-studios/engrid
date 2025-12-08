import { ENGrid, EngridLogger } from ".";
export class PreferredPaymentMethod {
    constructor() {
        var _a;
        this.logger = new EngridLogger("PreferredPaymentMethod", "#ffffff", "#1f2933", "⭐️");
        this.availabilityTimeoutMs = 4000;
        this.cleanupHandlers = [];
        this.selectionFinalized = false;
        this.listenersAttached = false;
        this.config = this.resolveConfig();
        this.preferredFieldName = ((_a = this.config.preferredPaymentMethodField) === null || _a === void 0 ? void 0 : _a.trim()) || "";
        if (!this.shouldRun()) {
            return;
        }
        this.attachGiveBySelectListeners();
        const candidates = this.buildCandidateList();
        if (candidates.length === 0) {
            this.logger.log("No payment methods to evaluate. Skipping.");
            return;
        }
        this.logger.log(`Evaluating preferred payment methods in order: ${candidates.join(", ")}`);
        this.tryCandidateAtIndex(0, candidates);
    }
    shouldRun() {
        if (ENGrid.getPageType() !== "DONATION") {
            this.logger.log("Not a donation page. Skipping preferred payment selection.");
            return false;
        }
        // If there's a "payment" URL parameter, we can proceed
        if (ENGrid.getUrlParameter("payment")) {
            return true;
        }
        if (!this.getGiveBySelectInputs().length) {
            this.logger.log("No give-by-select inputs found. Skipping.");
            return false;
        }
        const config = ENGrid.getOption("PreferredPaymentMethod") || false;
        if (config === false) {
            this.logger.log("PreferredPaymentMethod option disabled.");
            return false;
        }
        return true;
    }
    resolveConfig() {
        const option = ENGrid.getOption("PreferredPaymentMethod") || false;
        if (option && typeof option === "object") {
            const preferredPaymentMethodField = option.preferredPaymentMethodField || "";
            const defaultPaymentMethod = Array.isArray(option.defaultPaymentMethod)
                ? option.defaultPaymentMethod.filter((item) => !!item)
                : [];
            return {
                preferredPaymentMethodField,
                defaultPaymentMethod: defaultPaymentMethod.length > 0 ? defaultPaymentMethod : ["card"],
            };
        }
        return {
            preferredPaymentMethodField: "",
            defaultPaymentMethod: ["card"],
        };
    }
    buildCandidateList() {
        const candidates = [];
        const seen = new Set();
        const pushCandidate = (value) => {
            if (!value)
                return;
            const normalized = this.normalizePaymentValue(value);
            if (!normalized || seen.has(normalized))
                return;
            seen.add(normalized);
            candidates.push(normalized);
        };
        pushCandidate(this.getFieldPreference());
        pushCandidate(this.getUrlPreference());
        this.config.defaultPaymentMethod.forEach(pushCandidate);
        return candidates;
    }
    hasPreferredField() {
        if (!this.preferredFieldName)
            return false;
        const field = ENGrid.getField(this.preferredFieldName);
        return !!field;
    }
    attachGiveBySelectListeners() {
        if (this.listenersAttached)
            return;
        if (!this.preferredFieldName)
            return;
        if (!this.hasPreferredField()) {
            this.logger.log(`Preferred payment field "${this.preferredFieldName}" not found. Field sync disabled.`);
            return;
        }
        const inputs = this.getGiveBySelectInputs();
        inputs.forEach((input) => {
            input.addEventListener("change", () => {
                if (input.checked) {
                    this.syncPreferredField(input.value);
                }
            });
        });
        this.listenersAttached = true;
    }
    syncPreferredField(value) {
        if (!this.preferredFieldName)
            return;
        if (!this.hasPreferredField())
            return;
        ENGrid.setFieldValue(this.preferredFieldName, value, false, true);
    }
    getFieldPreference() {
        if (!this.preferredFieldName) {
            return null;
        }
        const fieldValue = ENGrid.getFieldValue(this.preferredFieldName);
        if (!fieldValue) {
            this.logger.log(`Preferred payment field "${this.preferredFieldName}" is empty. Moving on.`);
            return null;
        }
        this.logger.log(`Preferred payment from field "${this.preferredFieldName}" resolved to "${fieldValue}".`);
        return fieldValue;
    }
    getUrlPreference() {
        const urlValue = ENGrid.getUrlParameter("payment");
        if (typeof urlValue === "string" && urlValue.trim() !== "") {
            this.logger.log(`Preferred payment from URL parameter: "${urlValue}".`);
            return urlValue;
        }
        return null;
    }
    tryCandidateAtIndex(index, candidates) {
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
        this.logger.log(`Payment method "${method}" exists but is not available yet. Waiting up to ${this.availabilityTimeoutMs}ms.`);
        this.waitForAvailability(method, () => {
            if (this.selectionFinalized)
                return;
            if (this.isPaymentMethodAvailable(method)) {
                this.logger.success(`Selecting payment method "${method}" once it became available.`);
                this.applySelection(method);
            }
        }, () => {
            if (this.selectionFinalized)
                return;
            this.logger.log(`Payment method "${method}" still unavailable after waiting. Trying next option.`);
            this.tryCandidateAtIndex(index + 1, candidates);
        });
    }
    waitForAvailability(method, onAvailable, onTimeout) {
        const observers = [];
        const cleanup = () => {
            observers.forEach((observer) => observer.disconnect());
            observers.length = 0;
            this.cleanupHandlers = this.cleanupHandlers.filter((fn) => fn !== cleanup);
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
        const fieldContainer = this.getGiveBySelectContainer() || document.body;
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
    applySelection(method) {
        if (this.selectionFinalized) {
            return;
        }
        const input = this.findPaymentInput(method);
        if (!input) {
            this.logger.log(`Unable to locate give-by-select input for "${method}" during selection.`);
            return;
        }
        if (!this.isPaymentMethodAvailable(method)) {
            this.logger.log(`Payment method "${method}" is not available to select.`);
            return;
        }
        input.checked = true;
        input.dispatchEvent(new Event("change", { bubbles: true, cancelable: true }));
        ENGrid.setPaymentType(method);
        this.syncPreferredField(input.value);
        this.selectionFinalized = true;
        this.cleanupAllObservers();
    }
    paymentMethodExists(method) {
        return !!this.findPaymentInput(method);
    }
    isPaymentMethodAvailable(method) {
        const input = this.findPaymentInput(method);
        if (!input || input.disabled) {
            return false;
        }
        const container = this.getInputContainer(input);
        return container ? ENGrid.isVisible(container) : ENGrid.isVisible(input);
    }
    findPaymentInput(method) {
        const normalized = this.normalizePaymentValue(method);
        if (!normalized) {
            return null;
        }
        const inputs = this.getGiveBySelectInputs();
        return (Array.from(inputs).find((input) => input.value && this.normalizePaymentValue(input.value) === normalized) || null);
    }
    getGiveBySelectInputs() {
        return document.getElementsByName("transaction.giveBySelect");
    }
    getGiveBySelectContainer() {
        return document.querySelector(".en__field--give-by-select, .give-by-select");
    }
    getInputContainer(input) {
        return (input.closest(".en__field__item") ||
            input.closest(".en__field__element") ||
            input.parentElement);
    }
    findLabelForInput(input) {
        if (input.id) {
            const externalLabel = document.querySelector(`label[for="${input.id}"]`);
            if (externalLabel) {
                return externalLabel;
            }
        }
        return input.closest("label");
    }
    normalizePaymentValue(value) {
        return value.trim().toLowerCase();
    }
    getAvailabilityAttributeFilters(method) {
        const map = {
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
    cleanupAllObservers() {
        this.cleanupHandlers.forEach((cleanup) => cleanup());
        this.cleanupHandlers = [];
    }
}
