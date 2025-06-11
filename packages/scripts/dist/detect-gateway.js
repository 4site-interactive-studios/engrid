// This component will detect whether a test payment gateway is being used, and if so, add an alert to the .page-alert section of the page
import { EngridLogger } from ".";
export class detectGateway {
    constructor() {
        this.logger = new EngridLogger("Detect Gateway", "#f0f0f0", "#ff0000", "⛩️");
        this.gatewayDetection();
    }
    gatewayDetection() {
        var _a, _b;
        this.logger.log("Detecting payment gateway...");
        const env = (_b = (_a = window === null || window === void 0 ? void 0 : window.EngagingNetworks) === null || _a === void 0 ? void 0 : _a.vault) === null || _b === void 0 ? void 0 : _b.environment;
        if (env === "PRODUCTION") {
            this.logger.log("Live gateway in use.");
        }
        else if (env === "SANDBOX" || env === "TEST") {
            this.logger.log("Test gateway in use.");
        }
        else {
            this.logger.log("Unknown or undefined gateway environment:", env);
        }
    }
}
