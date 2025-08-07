export declare class PageBackground {
    private pageBackground;
    private mutationObserver;
    private logger;
    constructor();
    /**
     * Initialize background image by finding and setting CSS custom property
     */
    private initializeBackgroundImage;
    /**
     * Set the background image URL as a CSS custom property
     */
    private setBackgroundImageUrl;
    /**
     * Processes attribution positioning for background images by moving positioning classes
     * and data attributes from images to their parent column containers.
     *
     * This function handles two attribution patterns:
     * 1. Class-based: <img class="attribution-bottomright" src="...">
     * 2. Data attribute-based: <img data-background-position="bottomright" src="...">
     *
     * Examples:
     *
     * Class-based attribution:
     * <img class="attribution-bottomright" src="background.jpg">
     * → Moves "attribution-bottomright" class to parent .en__component--column
     *
     * Data attribute-based attribution:
     * <img data-background-position="top" src="background.jpg">
     * → Converts to "attribution-top" class and moves to parent .en__component--column
     *
     * Supported positioning values:
     * - center
     * - top, topcenter (these result in the same positioning)
     * - right, rightcenter (these result in the same positioning)
     * - bottom, bottomcenter (these result in the same positioning)
     * - left, leftcenter (these result in the same positioning)
     * - topright
     * - bottomright
     * - bottomleft
     * - topleft
     */
    private processAttributionPositioning;
    /**
     * Process attribution for a single image
     */
    private processImageAttribution;
    /**
     * Handle class-based attribution positioning
     */
    private handleClassBasedAttribution;
    /**
     * Handle data attribute-based attribution positioning
     */
    private handleDataAttributeAttribution;
    private setupMutationObserver;
    reprocessAttributionPositioning(): void;
    /**
     * Clean up resources and observers
     */
    destroy(): void;
    private setDataAttributes;
    private hasVideoBackground;
    private hasImageBackground;
}
