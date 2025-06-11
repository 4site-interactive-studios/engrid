// This component will detect whether a test payment gateway is being used, and if so, add an alert to the .page-alert section of the page

import { EngridLogger } from ".";

export class detectGateway {
  private logger: EngridLogger = new EngridLogger(
    "Detect Gateway",
    "#f0f0f0",
    "#ff0000",
    "⛩️"
  );

  constructor() {
    this.gatewayDetection();
  }

  private gatewayDetection() {
    this.logger.log("Detecting payment gateway...");
    const env = window?.EngagingNetworks?.vault?.environment;

    if (env === "PRODUCTION") {
      this.logger.log("Live gateway in use.");
    } else if (env === "SANDBOX" || env === "TEST") {
      this.logger.log("Test gateway in use.");
    } else {
      this.logger.log("Unknown or undefined gateway environment:", env); 
    }
  }
}
