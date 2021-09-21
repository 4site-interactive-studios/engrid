import { ENGrid } from "./";
export class ProgressBar {
    constructor() {
        var _a, _b;
        const progressIndicator = document.querySelector("span[data-engrid-progress-indicator]");
        const pageCount = ENGrid.getPageCount();
        const pageNumber = ENGrid.getPageNumber();
        if (!progressIndicator || !pageCount || !pageNumber) {
            return;
        }
        let maxValue = (_a = progressIndicator.getAttribute("max")) !== null && _a !== void 0 ? _a : 100;
        if (typeof maxValue === "string")
            maxValue = parseInt(maxValue);
        let amountValue = (_b = progressIndicator.getAttribute("amount")) !== null && _b !== void 0 ? _b : 0;
        if (typeof amountValue === "string")
            amountValue = parseInt(amountValue);
        const prevPercentage = pageNumber === 1
            ? 0
            : Math.ceil(((pageNumber - 1) / pageCount) * maxValue);
        let percentage = pageNumber === 1 ? 0 : Math.ceil((pageNumber / pageCount) * maxValue);
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
            const progress = document.querySelector(".indicator__progress");
            requestAnimationFrame(function () {
                progress.style.transform = `scaleX(${scale})`;
            });
        }
    }
}
