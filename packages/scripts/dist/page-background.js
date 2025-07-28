import { ENGrid } from "./engrid";
export class PageBackground {
    constructor() {
        var _a;
        // @TODO: Change page-backgroundImage to page-background
        this.pageBackground = document.querySelector(".page-backgroundImage");
        this.mutationObserver = null;
        // Finds any <img> added to the "backgroundImage" ENGRid section and sets it as the "--engrid__page-backgroundImage_url" CSS Custom Property
        const pageBackgroundImg = (_a = this.pageBackground) === null || _a === void 0 ? void 0 : _a.querySelector("img");
        if (this.pageBackground) {
            let pageBackgroundImgDataSrc = pageBackgroundImg === null || pageBackgroundImg === void 0 ? void 0 : pageBackgroundImg.getAttribute("data-src");
            let pageBackgroundImgSrc = pageBackgroundImg === null || pageBackgroundImg === void 0 ? void 0 : pageBackgroundImg.src;
            if (this.pageBackground && pageBackgroundImgDataSrc) {
                if (ENGrid.debug)
                    console.log("A background image set in the page was found with a data-src value, setting it as --engrid__page-backgroundImage_url", pageBackgroundImgDataSrc);
                pageBackgroundImgDataSrc = "url('" + pageBackgroundImgDataSrc + "')";
                this.pageBackground.style.setProperty("--engrid__page-backgroundImage_url", pageBackgroundImgDataSrc);
            }
            else if (this.pageBackground && pageBackgroundImgSrc) {
                if (ENGrid.debug)
                    console.log("A background image set in the page was found with a src value, setting it as --engrid__page-backgroundImage_url", pageBackgroundImgSrc);
                pageBackgroundImgSrc = "url('" + pageBackgroundImgSrc + "')";
                this.pageBackground.style.setProperty("--engrid__page-backgroundImage_url", pageBackgroundImgSrc);
            }
            else if (pageBackgroundImg) {
                if (ENGrid.debug)
                    console.log("A background image set in the page was found but without a data-src or src value, no action taken", pageBackgroundImg);
            }
            else {
                if (ENGrid.debug)
                    console.log("A background image set in the page was not found, any default image set in the theme on --engrid__page-backgroundImage_url will be used");
            }
        }
        else {
            if (ENGrid.debug)
                console.log("A background image set in the page was not found, any default image set in the theme on --engrid__page-backgroundImage_url will be used");
        }
        this.setDataAttributes();
        // Move attribution classes and data attributes from background image to parent column
        this.processAttributionPositioning();
        // Set up mutation observer to watch for DOM changes
        this.setupMutationObserver();
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
    processAttributionPositioning() {
        if (this.pageBackground) {
            if (ENGrid.debug)
                console.log("Processing attribution positioning for background section:", this.pageBackground);
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
            ];
            // Find all images in the background section (after any DOM transformations)
            const images = this.pageBackground.querySelectorAll("img");
            if (ENGrid.debug)
                console.log("Found images in background section:", images.length);
            images.forEach((img) => {
                // Pattern 1: Check for class-based attribution positioning
                // Example: <img class="attribution-bottomright" src="...">
                const matchedClass = allowedClasses.find((cls) => img.classList.contains(cls));
                // Pattern 2: Check for data attribute-based attribution positioning
                // Example: <img data-background-position="bottomright" src="...">
                const dataPosition = img.getAttribute("data-background-position");
                if (matchedClass) {
                    // Handle class-based attribution positioning
                    if (ENGrid.debug)
                        console.log("Found attribution class on image:", matchedClass, img);
                    const parentDiv = img.closest(".en__component--column");
                    if (parentDiv) {
                        // Move the class from image to parent column
                        img.classList.remove(matchedClass);
                        parentDiv.classList.add(matchedClass);
                        if (ENGrid.debug)
                            console.log("Moved attribution class from image to parent column:", matchedClass, parentDiv);
                    }
                    else {
                        if (ENGrid.debug)
                            console.log("No parent .en__component--column found for image:", img);
                    }
                }
                else if (dataPosition) {
                    // Handle data attribute-based attribution positioning
                    // Convert data attribute value to attribution class format
                    const attributionClass = `attribution-${dataPosition}`;
                    if (ENGrid.debug)
                        console.log("Found data-background-position on image:", dataPosition, "->", attributionClass, img);
                    const parentDiv = img.closest(".en__component--column");
                    if (parentDiv) {
                        // Remove data attribute from image and add class to parent column
                        img.removeAttribute("data-background-position");
                        parentDiv.classList.add(attributionClass);
                        if (ENGrid.debug)
                            console.log("Moved data-background-position from image to parent column as class:", attributionClass, parentDiv);
                    }
                    else {
                        if (ENGrid.debug)
                            console.log("No parent .en__component--column found for image:", img);
                    }
                }
            });
        }
        else {
            if (ENGrid.debug)
                console.log("No background section found for attribution positioning processing");
        }
    }
    setupMutationObserver() {
        if (this.pageBackground && window.MutationObserver) {
            this.mutationObserver = new MutationObserver((mutations) => {
                let shouldReprocess = false;
                mutations.forEach((mutation) => {
                    // Check if nodes were added or attributes changed
                    if (mutation.type === "childList" || mutation.type === "attributes") {
                        shouldReprocess = true;
                    }
                });
                if (shouldReprocess) {
                    if (ENGrid.debug)
                        console.log("DOM changes detected in background section, reprocessing attribution classes");
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
            if (ENGrid.debug)
                console.log("MutationObserver set up for background section");
        }
    }
    // Public method to manually trigger reprocessing
    reprocessAttributionPositioning() {
        if (ENGrid.debug)
            console.log("Manually reprocessing attribution positioning");
        this.processAttributionPositioning();
    }
    setDataAttributes() {
        if (this.hasVideoBackground())
            return ENGrid.setBodyData("page-background", "video");
        if (this.hasImageBackground())
            return ENGrid.setBodyData("page-background", "image");
        return ENGrid.setBodyData("page-background", "empty");
    }
    hasVideoBackground() {
        if (this.pageBackground) {
            return !!this.pageBackground.querySelector("video");
        }
    }
    hasImageBackground() {
        if (this.pageBackground) {
            return (!this.hasVideoBackground() && !!this.pageBackground.querySelector("img"));
        }
    }
}
