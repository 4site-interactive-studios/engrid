/**
 * This component improves EN's implementation of Stripe Financial Connections.
 * Enhancements:
 *  - When the modal is closed, it re-enables the submit button.
 */

import { ENGrid, EngridLogger } from ".";

export class StripeFinancialConnections {
  private stripeModalOpen: boolean = false;
  private logger: EngridLogger = new EngridLogger(
    "Stripe Financial Connections",
    "black",
    "pink",
    "🏛️"
  );

  constructor() {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (!this.stripeModalOpen && this.isStripeModalNodeWIthIframe(node)) {
            this.logger.log("Stripe Financial Connections modal opened.");
            this.onStripeModalOpen();
          }
        });

        mutation.removedNodes.forEach((node) => {
          if (this.stripeModalOpen && this.isStripeModalNode(node)) {
            this.logger.log("Stripe Financial Connections modal closed.");
            this.onStripeModalClose();
          }
        });
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  }

  isStripeModalNode(node: Node): boolean {
    return (
      node instanceof HTMLElement &&
      node.hasAttribute("data-react-aria-top-layer")
    );
  }

  isStripeModalNodeWIthIframe(node: Node): boolean {
    return !!(
      this.isStripeModalNode(node) &&
      node instanceof HTMLElement &&
      node.querySelector('iframe[src*="js.stripe.com"]')
    );
  }

  onStripeModalOpen() {
    this.stripeModalOpen = true;
  }

  onStripeModalClose() {
    this.stripeModalOpen = false;
    ENGrid.enableSubmit();
  }
}
