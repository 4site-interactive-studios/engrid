/**
 * This component improves EN's implementation of Stripe Financial Connections.
 * Enhancements:
 *  - When the modal is closed, it re-enables the submit button.
 */
export declare class StripeFinancialConnections {
    private stripeModalOpen;
    private logger;
    constructor();
    isStripeModalNode(node: Node): boolean;
    isStripeModalNodeWIthIframe(node: Node): boolean;
    onStripeModalOpen(): void;
    onStripeModalClose(): void;
}
