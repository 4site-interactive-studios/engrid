import { ENGrid } from "./";

export class ProgressBar {
  constructor() {
    const progressIndicator = document.querySelector(
      "span[data-engrid-progress-indicator]"
    ) as HTMLElement;
    const pageCount = ENGrid.getPageCount();
    const pageNumber = ENGrid.getPageNumber();

    if (!progressIndicator || !pageCount || !pageNumber) {
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
}
