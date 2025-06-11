// This component will detect whether a test payment gateway is being used, and if so, add an alert to the .page-alert section of the page
import { EngridLogger } from ".";
export class detectGateway {
    constructor() {
        this.logger = new EngridLogger("Detect Gateway", "#f0f0f0", "#ff0000", "⛩️");
        this.gatewayDetection();
    }
    gatewayDetection() {
        var _a, _b;
        const alertBox = document.querySelector('.page-alert');
        const env = (_b = (_a = window === null || window === void 0 ? void 0 : window.EngagingNetworks) === null || _a === void 0 ? void 0 : _a.vault) === null || _b === void 0 ? void 0 : _b.environment;
        this.logger.log("Gateway is: ", env);
        if (env === "live" || env === "production") {
            this.logger.log("Live gateway in use.");
        }
        else if (env === "sandbox" || env === "test") {
            if (alertBox) {
                alertBox.setAttribute("style", "display: block !important;");
                alertBox.innerHTML = `<div class="alert alert-warning" role="alert" style="padding: 5px; background-color: #f7e6ed;
border-radius: 4px; color: #c60060; text-align: center; width: 100%;"><p><strong>Warning:</strong> You are currently using a test payment gateway.</p><p>Please ensure you switch to the live gateway before going live.</p></div>`;
            }
        }
        else {
            this.logger.log("Gateway is unknown.");
        }
    }
}
