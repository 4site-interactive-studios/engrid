import { ENGrid, EngridLogger } from ".";
import { DonationAmount, ProcessingFees } from "./events";

export class ProgressBar {
  private logger = new EngridLogger("ProgressBar");
  private progressIndicator: HTMLElement | null = null;
  private progressBar: HTMLElement | null = null;
  private percentageEl: HTMLElement | null = null;
  private raisedEl: HTMLElement | null = null;
  private goalEl: HTMLElement | null = null;
  private _amount!: DonationAmount;
  private _fees!: ProcessingFees;
  private goal: number = 0;
  private raised: number = 0;

  constructor() {
    this.progressIndicator = document.querySelector(
      "span[data-engrid-progress-indicator]"
    ) as HTMLElement;

    if (!this.progressIndicator) {
      return;
    }

    const goalAttr = this.progressIndicator.getAttribute("goal");
    if (goalAttr && parseFloat(goalAttr) > 0) {
      this.goal = parseFloat(goalAttr);
      this.initThermometer();
    } else {
      this.initPageStep();
    }
  }

  // Existing page-step progress bar logic — unchanged
  private initPageStep(): void {
    const progressIndicator = this.progressIndicator!;
    const pageCount = ENGrid.getPageCount();
    const pageNumber = ENGrid.getPageNumber();

    if (!pageCount || !pageNumber) {
      return;
    }

    let maxValue: string | number =
      progressIndicator.getAttribute("max") ?? 100;
    if (typeof maxValue === "string") maxValue = parseInt(maxValue);

    let amountValue: string | number =
      progressIndicator.getAttribute("amount") ?? 0;
    if (typeof amountValue === "string") amountValue = parseInt(amountValue);

    const prevPercentage =
      pageNumber === 1
        ? 0
        : Math.ceil(((pageNumber - 1) / pageCount) * maxValue);
    let percentage =
      pageNumber === 1 ? 0 : Math.ceil((pageNumber / pageCount) * maxValue);

    const scalePrev = prevPercentage / 100;
    let scale = percentage / 100;

    if (amountValue) {
      percentage =
        Math.ceil(amountValue) > Math.ceil(maxValue) ? maxValue : amountValue;
      scale = percentage / 100;
    }

    progressIndicator.innerHTML = `
			<div class="indicator__wrap">
				<span class="indicator__progress" style="transform: scaleX(${scalePrev});"></span>
				<span class="indicator__percentage">${percentage}<span class="indicator__percentage-sign">%</span></span>
			</div>`;

    if (percentage !== prevPercentage) {
      const progress = document.querySelector(
        ".indicator__progress"
      ) as HTMLElement;
      requestAnimationFrame(function () {
        progress.style.transform = `scaleX(${scale})`;
      });
    }
  }

  // Fundraising thermometer mode — fetches campaign total and updates live
  private initThermometer(): void {
    this._amount = DonationAmount.getInstance();
    this._fees = ProcessingFees.getInstance();

    const currencySymbol = ENGrid.getCurrencySymbol();
    const formattedGoal = this.formatCurrency(this.goal);

    this.progressIndicator!.innerHTML = `
			<div class="indicator__wrap indicator__wrap--thermometer">
				<span class="indicator__progress" style="transform: scaleX(0);"></span>
				<span class="indicator__amounts">
					<span class="indicator__raised">${currencySymbol}0</span> raised of
					<span class="indicator__goal">${currencySymbol}${formattedGoal}</span> goal
				</span>
				<span class="indicator__percentage">0<span class="indicator__percentage-sign">%</span></span>
			</div>`;

    this.progressBar = document.querySelector(
      ".indicator__progress"
    ) as HTMLElement;
    this.percentageEl = document.querySelector(
      ".indicator__percentage"
    ) as HTMLElement;
    this.raisedEl = document.querySelector(
      ".indicator__raised"
    ) as HTMLElement;
    this.goalEl = document.querySelector(".indicator__goal") as HTMLElement;

    // Check for a static "raised" attribute as a fallback / initial value
    const raisedAttr = this.progressIndicator!.getAttribute("raised");
    if (raisedAttr) {
      const parsed = ENGrid.cleanAmount(raisedAttr);
      if (!isNaN(parsed) && parsed > 0) {
        this.raised = parsed;
      }
    }

    // Fetch campaign total from EN public data API
    this.fetchRaised();

    // Subscribe to live donation amount and fee changes
    this._amount.onAmountChange.subscribe(() => this.updateThermometer());
    this._fees.onFeeChange.subscribe(() => this.updateThermometer());

    // Initial render
    this.updateThermometer();
  }

  private async fetchRaised(): Promise<void> {
    const token = ENGrid.getOption("ProgressBarToken") as string | null;
    if (!token) {
      this.logger.log("No ProgressBarToken configured — skipping API fetch");
      return;
    }

    const dataCenter = ENGrid.getDataCenter();
    const campaignId = ENGrid.getPageID();
    if (!campaignId) {
      this.logger.log("No campaign page ID found — skipping API fetch");
      return;
    }

    const currency =
      this.progressIndicator!.getAttribute("currency") ||
      (ENGrid.getOption("CurrencyCode") as string) ||
      "USD";

    const url =
      `https://${dataCenter}.engagingnetworks.app/ea-dataservice/data.service` +
      `?service=EaDataCapture&token=${encodeURIComponent(token)}` +
      `&campaignId=${encodeURIComponent(campaignId)}` +
      `&contentType=json&resultType=summary`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      const data = await response.json();
      this.logger.log("API response:", data);

      // The EN API returns an object or array with campaign summary data.
      // Look for totalAmountDonated in the response, matching the requested currency.
      const raised = this.extractRaisedAmount(data, currency);
      if (raised > 0) {
        this.raised = raised;
        this.updateThermometer();
      }
    } catch (error) {
      this.logger.log("Failed to fetch campaign total:", error);
    }
  }

  private extractRaisedAmount(data: any, currency: string): number {
    // The EN public data API can return data in different shapes.
    // Handle array of per-currency rows: [{ currency: "USD", totalAmountDonated: 12345 }, ...]
    if (Array.isArray(data)) {
      for (const row of data) {
        if (row.totalAmountDonated !== undefined) {
          // If there's a currency field, match it; otherwise take the first row
          if (
            !row.currency ||
            row.currency.toUpperCase() === currency.toUpperCase()
          ) {
            return ENGrid.cleanAmount(String(row.totalAmountDonated));
          }
        }
        // Some endpoints use "total" instead
        if (row.total !== undefined) {
          return ENGrid.cleanAmount(String(row.total));
        }
      }
      return 0;
    }

    // Handle single object response
    if (data && typeof data === "object") {
      if (data.totalAmountDonated !== undefined) {
        return ENGrid.cleanAmount(String(data.totalAmountDonated));
      }
      if (data.total !== undefined) {
        return ENGrid.cleanAmount(String(data.total));
      }
    }

    return 0;
  }

  private updateThermometer(): void {
    if (!this.progressBar || !this.percentageEl) return;

    const donorAmount = this._amount.amount + this._fees.fee;
    const rawTotal = this.raised + (isNaN(donorAmount) ? 0 : donorAmount);
    const total = Math.max(0, rawTotal);
    const percentage =
      this.goal > 0
        ? Math.min(Math.round((total / this.goal) * 100), 100)
        : 0;
    const scale = percentage / 100;

    this.logger.log(
      `Thermometer: raised=${this.raised} + donor=${donorAmount} = ${total} / ${this.goal} (${percentage}%)`
    );

    requestAnimationFrame(() => {
      if (this.progressBar) {
        this.progressBar.style.transform = `scaleX(${scale})`;
      }
    });

    this.percentageEl.innerHTML = `${percentage}<span class="indicator__percentage-sign">%</span>`;

    const currencySymbol = ENGrid.getCurrencySymbol();
    if (this.raisedEl) {
      this.raisedEl.textContent = `${currencySymbol}${this.formatCurrency(total)}`;
    }
    if (this.goalEl) {
      this.goalEl.textContent = `${currencySymbol}${this.formatCurrency(this.goal)}`;
    }
  }

  private formatCurrency(value: number): string {
    const thousandsSep =
      (ENGrid.getOption("ThousandsSeparator") as string) || ",";
    const decimalSep =
      (ENGrid.getOption("DecimalSeparator") as string) || ".";
    // Show whole numbers without decimals, others with 2 decimal places
    const decimals = value % 1 === 0 ? 0 : 2;
    return ENGrid.formatNumber(value, decimals, decimalSep, thousandsSep);
  }
}
