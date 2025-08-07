import { ENGrid, EngridLogger } from ".";

export class PageBackground {
  // @TODO: Change page-backgroundImage to page-background
  private pageBackground: HTMLElement | null = document.querySelector(
    ".page-backgroundImage"
  );
  private mutationObserver: MutationObserver | null = null;
  private logger: EngridLogger = new EngridLogger(
    "PageBackground",
    "lightblue",
    "darkblue",
    "🖼️"
  );

  constructor() {
    if (!this.pageBackground) {
      this.logger.log(
        "A background image set in the page was not found, any default image set in the theme on --engrid__page-backgroundImage_url will be used"
      );
      return;
    }

    this.initializeBackgroundImage();
    this.setDataAttributes();
    this.processAttributionPositioning();
    this.setupMutationObserver();
  }

  /**
   * Initialize background image by finding and setting CSS custom property
   */
  private initializeBackgroundImage(): void {
    if (!this.pageBackground) return;

    const pageBackgroundImg = this.pageBackground.querySelector(
      "img"
    ) as HTMLImageElement | null;

    if (!pageBackgroundImg) {
      this.logger.log(
        "A background image set in the page was not found, any default image set in the theme on --engrid__page-backgroundImage_url will be used"
      );
      return;
    }

    const dataSrc = pageBackgroundImg.getAttribute("data-src");
    const src = pageBackgroundImg.src;

    if (dataSrc) {
      this.setBackgroundImageUrl(dataSrc, "data-src");
    } else if (src) {
      this.setBackgroundImageUrl(src, "src");
    } else {
      this.logger.log(
        "A background image set in the page was found but without a data-src or src value, no action taken",
        pageBackgroundImg
      );
    }
  }

  /**
   * Set the background image URL as a CSS custom property
   */
  private setBackgroundImageUrl(imageUrl: string, sourceType: string): void {
    if (!this.pageBackground || !imageUrl) return;

    try {
      const cssUrl = `url('${imageUrl}')`;
      this.pageBackground.style.setProperty(
        "--engrid__page-backgroundImage_url",
        cssUrl
      );

      this.logger.log(
        `A background image set in the page was found with a ${sourceType} value, setting it as --engrid__page-backgroundImage_url`,
        imageUrl
      );
    } catch (error) {
      this.logger.error("Error setting background image URL:", error);
    }
  }

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
  private processAttributionPositioning(): void {
    if (!this.pageBackground) {
      this.logger.log(
        "No background section found for attribution positioning processing"
      );
      return;
    }

    this.logger.log(
      "Processing attribution positioning for background section:",
      this.pageBackground
    );

    // Define all supported attribution positioning classes
    const allowedClasses = [
      "attribution-center",
      "attribution-bottom",
      "attribution-bottomcenter",
      "attribution-bottomright",
      "attribution-bottomleft",
      "attribution-top",
      "attribution-topcenter",
      "attribution-topright",
      "attribution-topleft",
      "attribution-left",
      "attribution-leftcenter",
      "attribution-right",
      "attribution-rightcenter",
    ] as const;

    try {
      // Find all images in the background section (after any DOM transformations)
      const images = this.pageBackground.querySelectorAll("img");
      this.logger.log("Found images in background section:", images.length);

      images.forEach((img) => {
        this.processImageAttribution(img, allowedClasses);
      });
    } catch (error) {
      this.logger.error("Error processing attribution positioning:", error);
    }
  }

  /**
   * Process attribution for a single image
   */
  private processImageAttribution(
    img: HTMLImageElement,
    allowedClasses: readonly string[]
  ): void {
    // Pattern 1: Check for class-based attribution positioning
    // Example: <img class="attribution-bottomright" src="...">
    const matchedClass = allowedClasses.find((cls) =>
      img.classList.contains(cls)
    );

    // Pattern 2: Check for data attribute-based attribution positioning
    // Example: <img data-background-position="bottomright" src="...">
    const dataPosition = img.getAttribute("data-background-position");

    if (matchedClass) {
      this.handleClassBasedAttribution(img, matchedClass);
    } else if (dataPosition) {
      this.handleDataAttributeAttribution(img, dataPosition);
    }
  }

  /**
   * Handle class-based attribution positioning
   */
  private handleClassBasedAttribution(
    img: HTMLImageElement,
    matchedClass: string
  ): void {
    this.logger.log("Found attribution class on image:", matchedClass, img);

    const parentDiv = img.closest(".en__component--column");
    if (parentDiv) {
      // Move the class from image to parent column
      img.classList.remove(matchedClass);
      parentDiv.classList.add(matchedClass);
      this.logger.log(
        "Moved attribution class from image to parent column:",
        matchedClass,
        parentDiv
      );
    } else {
      this.logger.log("No parent .en__component--column found for image:", img);
    }
  }

  /**
   * Handle data attribute-based attribution positioning
   */
  private handleDataAttributeAttribution(
    img: HTMLImageElement,
    dataPosition: string
  ): void {
    // Convert data attribute value to attribution class format
    const attributionClass = `attribution-${dataPosition}`;

    this.logger.log(
      "Found data-background-position on image:",
      dataPosition,
      "->",
      attributionClass,
      img
    );

    const parentDiv = img.closest(".en__component--column");
    if (parentDiv) {
      // Remove data attribute from image and add class to parent column
      img.removeAttribute("data-background-position");
      parentDiv.classList.add(attributionClass);
      this.logger.log(
        "Moved data-background-position from image to parent column as class:",
        attributionClass,
        parentDiv
      );
    } else {
      this.logger.log("No parent .en__component--column found for image:", img);
    }
  }

  private setupMutationObserver(): void {
    if (!this.pageBackground || !window.MutationObserver) {
      if (!window.MutationObserver) {
        this.logger.log("MutationObserver not supported in this browser");
      }
      return;
    }

    try {
      this.mutationObserver = new MutationObserver((mutations) => {
        let shouldReprocess = false;

        mutations.forEach((mutation) => {
          // Check if nodes were added or attributes changed
          if (mutation.type === "childList" || mutation.type === "attributes") {
            shouldReprocess = true;
          }
        });

        if (shouldReprocess) {
          this.logger.log(
            "DOM changes detected in background section, reprocessing attribution classes"
          );

          // Use a small delay to ensure all changes are complete
          setTimeout(() => {
            this.processAttributionPositioning();
          }, 100);
        }
      });

      // Start observing the background section
      this.mutationObserver.observe(this.pageBackground, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ["class"],
      });

      this.logger.log("MutationObserver set up for background section");
    } catch (error) {
      this.logger.error("Error setting up MutationObserver:", error);
    }
  }

  // Public method to manually trigger reprocessing
  public reprocessAttributionPositioning(): void {
    this.logger.log("Manually reprocessing attribution positioning");
    this.processAttributionPositioning();
  }

  /**
   * Clean up resources and observers
   */
  public destroy(): void {
    if (this.mutationObserver) {
      this.mutationObserver.disconnect();
      this.mutationObserver = null;
      this.logger.log("MutationObserver disconnected");
    }
  }

  private setDataAttributes(): void {
    if (this.hasVideoBackground()) {
      return ENGrid.setBodyData("page-background", "video");
    }
    if (this.hasImageBackground()) {
      return ENGrid.setBodyData("page-background", "image");
    }
    return ENGrid.setBodyData("page-background", "empty");
  }

  private hasVideoBackground(): boolean {
    if (!this.pageBackground) {
      return false;
    }
    return !!this.pageBackground.querySelector("video");
  }

  private hasImageBackground(): boolean {
    if (!this.pageBackground) {
      return false;
    }
    return (
      !this.hasVideoBackground() && !!this.pageBackground.querySelector("img")
    );
  }
}
