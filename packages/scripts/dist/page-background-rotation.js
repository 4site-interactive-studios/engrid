// Within the page-backgroundImage block, if there is a parent div with a class of 'background-rotation', then the background image will rotate every 5 seconds
// The image rotates on a cross-fade transition, and the next image is randomly selected from the list of child elements with a class of 'background-image-item' within the 'background-rotation' div
// The random selection of the next image is done in a way that ensures that the same image is not displayed twice in a row, and that all images are displayed before any image is repeated
// On mobile, the background image will not rotate, and a random image in the list will be displayed as a static background image
// The background image will also not rotate if the user has set a preference for reduced motion in their system settings
// Figattributes/figcaptions, if included on the image, will also need to be updated to reflect the new image being displayed
// Each image item can include a data-theme="light" or data-theme="dark" (default) attribute, which switches the .body-title h1 text color so it stays visible over the current background image (>1200px layout only)
// Options block:
/**
 * Set via the default options, overridden by the options passed to the constructor, and overridden by a window-level variable called 'BackgroundRotationOptions' if it exists. The options are as follows:
 * enabled: Whether the background rotation is enabled (default: true)
 * interval: The interval in milliseconds between image rotations (default: 5000)
 * transitionDuration: The duration of the cross-fade transition in milliseconds (default: 500)
 * transitionClass: The CSS class to apply to the background image container during the transition (default: 'background-rotation-transition')
 * eachImageSelector: The CSS selector for each individual background image (default: '.background-image-item')
 * backgroundImageSelector: The CSS selector for the background image container (default: '.background-rotation')
 * slideOrder: The order in which the images are displayed (default: 'random' [random-bag], other options: 'sequential', 'true-random')
 * randomStart: Whether to start the rotation at a random image (default: true)
 * reducedMotion: Whether to respect the user's preference for reduced motion (default: true)
 * rotateOnMobile: Whether to rotate the background image on mobile devices (default: false)
 * controls: Whether to add back, pause, and forward buttons for the rotation (default: false)
 */
import { ENGrid } from "./engrid";
import { EngridLogger } from "./logger";
export class PageBackgroundRotation {
    constructor(options = {}) {
        var _a;
        this.logger = new EngridLogger("PageBackgroundRotation", "white", "rebeccapurple", "🌄");
        this.defaultOptions = {
            enabled: true,
            interval: 5000,
            transitionDuration: 500,
            transitionClass: "background-rotation-transition",
            eachImageSelector: ".page-background-image-item",
            backgroundImageSelector: ".page-background-rotation",
            slideOrder: "random",
            randomStart: true,
            reducedMotion: true,
            rotateOnMobile: false,
            mobileBreakpoint: "(max-width: 499px)",
            controls: false,
        };
        this.container = null;
        this.items = [];
        this.layers = [];
        this.imageUrls = [];
        this.imagesWarmed = false;
        this.currentIndex = -1;
        this.randomBag = [];
        this.history = [];
        this.isPaused = false;
        this.pausedForReducedMotion = false;
        this.interactionPauses = new Set();
        this.previousButton = null;
        this.pauseButton = null;
        this.liveRegion = null;
        this.rotationTimer = null;
        this.transitionTimer = null;
        this.reducedMotionMediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
        this.options = Object.assign(Object.assign(Object.assign({}, this.defaultOptions), options), ((_a = window.EngridPageBackgroundRotationOptions) !== null && _a !== void 0 ? _a : {}));
        this.mobileMediaQuery = window.matchMedia(this.options.mobileBreakpoint);
        if (!this.shouldRun())
            return;
        this.container = document.querySelector(`.page-backgroundImage ${this.options.backgroundImageSelector}`);
        this.items = Array.from(this.container.querySelectorAll(this.options.eachImageSelector));
        this.container.style.setProperty("--background-rotation-transition-duration", `${this.options.transitionDuration}ms`);
        document.body.style.setProperty("--background-rotation-transition-duration", `${this.options.transitionDuration}ms`);
        this.prepareItems();
        if (this.items.length === 1) {
            this.showStaticImage();
            return;
        }
        this.updateMode();
        if (!this.options.rotateOnMobile) {
            this.mobileMediaQuery.addEventListener("change", () => this.updateMode());
        }
        if (this.options.reducedMotion) {
            this.reducedMotionMediaQuery.addEventListener("change", () => this.updateMode());
        }
        if (this.options.controls) {
            this.createControls();
        }
    }
    shouldRun() {
        if (!this.options.enabled) {
            this.logger.log("Background rotation is disabled");
            return false;
        }
        const container = document.querySelector(`.page-backgroundImage ${this.options.backgroundImageSelector}`);
        if (!container)
            return false;
        if (!container.querySelector(this.options.eachImageSelector)) {
            this.logger.log("No background image items found to rotate");
            return false;
        }
        return true;
    }
    prepareItems() {
        this.items.forEach((item, index) => {
            const layer = this.getItemLayer(item);
            const imageUrl = this.getItemImageUrl(item);
            if (!imageUrl) {
                this.logger.log("Background image item has no image source", item);
            }
            this.imageUrls[index] = imageUrl;
            layer.classList.add("background-rotation-layer");
            layer.setAttribute("aria-hidden", "true");
            this.layers[index] = layer;
        });
    }
    // The inline background-image is what makes a layer fetch its image, so it is
    // applied when the layer is first shown rather than for every layer up front
    applyLayerImage(index) {
        const layer = this.layers[index];
        const imageUrl = this.imageUrls[index];
        if (!layer || !imageUrl || layer.style.backgroundImage)
            return;
        layer.style.backgroundImage = `url('${imageUrl}')`;
    }
    // The remaining layers are applied once the page has settled, so a full set of
    // viewport-sized images isn't competing with the form's own assets during load.
    // They are still applied ahead of the first rotation, so cross-fades don't
    // start against an image that hasn't been fetched yet.
    warmRemainingImages() {
        if (this.imagesWarmed)
            return;
        this.imagesWarmed = true;
        const warm = () => this.items.forEach((_, index) => this.applyLayerImage(index));
        const requestIdle = window.requestIdleCallback;
        if (requestIdle) {
            requestIdle.call(window, warm, { timeout: 3000 });
        }
        else {
            window.setTimeout(warm, 1000);
        }
    }
    // The item is typically the <img> tag itself. If MediaAttribution has wrapped
    // it in a <figure class="media-with-attribution">, the figure becomes the fade
    // layer so its figattribution cross-fades in sync with the image
    getItemLayer(item) {
        var _a;
        if (item instanceof HTMLImageElement &&
            ((_a = item.parentElement) === null || _a === void 0 ? void 0 : _a.matches("figure.media-with-attribution"))) {
            return item.parentElement;
        }
        return item;
    }
    getItemImage(item) {
        if (item instanceof HTMLImageElement)
            return item;
        return item.querySelector("img");
    }
    getItemImageUrl(item) {
        const img = this.getItemImage(item);
        if (!img)
            return null;
        return img.getAttribute("data-src") || img.getAttribute("src");
    }
    isStaticMode() {
        // With controls enabled a reduced-motion user can still advance the
        // images on their own, so only treat reduced motion as static mode
        // when there are no controls
        if (this.reducedMotionPreferred() && !this.options.controls) {
            return true;
        }
        if (!this.options.rotateOnMobile && this.mobileMediaQuery.matches) {
            return true;
        }
        return false;
    }
    reducedMotionPreferred() {
        return (this.options.reducedMotion && this.reducedMotionMediaQuery.matches);
    }
    // Starts or stops the rotation based on the current viewport and motion
    // preferences, called on page load and whenever they change
    updateMode() {
        if (this.isStaticMode()) {
            this.stopRotation();
            if (this.currentIndex === -1) {
                this.showStaticImage();
            }
            else {
                ENGrid.setBodyData("background-rotation", "static");
            }
            this.logger.log("Static background image mode");
            return;
        }
        // A reduced-motion preference (with controls enabled) starts paused so
        // the user can advance the images on their own; if the preference is
        // removed again, only auto-resume when the pause wasn't user-initiated
        if (this.reducedMotionPreferred()) {
            this.stopRotationTimer();
            this.isPaused = true;
            this.pausedForReducedMotion = true;
            this.updatePauseButton();
            this.logger.log("Auto-rotation paused for reduced motion preference");
        }
        else if (this.pausedForReducedMotion) {
            this.pausedForReducedMotion = false;
            this.isPaused = false;
            this.updatePauseButton();
        }
        if (this.rotationTimer !== null)
            return;
        const startIndex = this.currentIndex !== -1
            ? this.currentIndex
            : this.options.randomStart
                ? this.getRandomIndex()
                : 0;
        this.setActiveItem(startIndex);
        this.warmRemainingImages();
        ENGrid.setBodyData("background-rotation", "active");
        if (this.canRotate())
            this.startRotationTimer();
        this.logger.log(`Rotating ${this.items.length} background images every ${this.options.interval}ms`);
    }
    startRotationTimer() {
        this.stopRotationTimer();
        this.rotationTimer = window.setInterval(() => this.rotateToNextImage(), this.options.interval);
    }
    stopRotationTimer() {
        if (this.rotationTimer !== null) {
            window.clearInterval(this.rotationTimer);
            this.rotationTimer = null;
        }
    }
    stopRotation() {
        this.stopRotationTimer();
        this.finishTransition();
    }
    // Settles a cross-fade: only the current image keeps the class that makes it
    // visible, and the in-flow layer moves to it. Runs when a transition ends, and
    // again if the next transition starts first, so an interrupted fade can never
    // leave a stale layer stacked on top of the current one
    finishTransition() {
        var _a;
        if (this.transitionTimer !== null) {
            window.clearTimeout(this.transitionTimer);
            this.transitionTimer = null;
        }
        this.layers.forEach((layer, index) => {
            layer.classList.remove("background-rotation-outgoing");
            if (index === this.currentIndex)
                return;
            layer.classList.remove("active");
            layer.setAttribute("aria-hidden", "true");
        });
        if (this.currentIndex !== -1) {
            this.setFlowLayer(this.layers[this.currentIndex]);
        }
        (_a = this.container) === null || _a === void 0 ? void 0 : _a.classList.remove(this.options.transitionClass);
    }
    showStaticImage() {
        const index = this.options.randomStart ? this.getRandomIndex() : 0;
        this.setActiveItem(index);
        ENGrid.setBodyData("background-rotation", "static");
    }
    setActiveItem(index, moveFlow = true) {
        var _a;
        const layer = this.layers[index];
        if (!layer)
            return;
        this.applyLayerImage(index);
        layer.classList.add("active");
        layer.removeAttribute("aria-hidden");
        this.currentIndex = index;
        if (moveFlow)
            this.setFlowLayer(layer);
        const imageUrl = this.imageUrls[index];
        if (imageUrl) {
            document.body.style.setProperty("--background-rotation-image", `url('${imageUrl}')`);
        }
        setTimeout(() => {
            ENGrid.setBodyData("background-rotation-theme", this.getItemTheme(this.items[index]));
        }, 300);
        this.logger.log("Active background image", index + 1, "of", this.items.length, (_a = this.getItemAttribution(this.items[index])) !== null && _a !== void 0 ? _a : "");
    }
    // Marks the single layer that stays in-flow to give the container its height
    // at the <=499px breakpoint. Kept on the outgoing layer during a cross-fade
    // so two in-flow layers never stack, and moved to the incoming layer once
    // the transition ends (see finishTransition)
    setFlowLayer(layer) {
        this.layers.forEach((item) => item.classList.remove("background-rotation-flow"));
        layer.classList.add("background-rotation-flow");
    }
    rotateToNextImage() {
        this.goToImage(this.getNextIndex());
    }
    goToImage(nextIndex, addToHistory = true) {
        if (nextIndex === this.currentIndex)
            return;
        if (addToHistory && this.currentIndex !== -1) {
            this.history.push(this.currentIndex);
            if (this.history.length > this.items.length * 2)
                this.history.shift();
        }
        this.updatePreviousButtonState();
        // Settle a fade that is still running before starting the next one
        this.finishTransition();
        const outgoingLayer = this.layers[this.currentIndex];
        outgoingLayer === null || outgoingLayer === void 0 ? void 0 : outgoingLayer.classList.remove("active");
        outgoingLayer === null || outgoingLayer === void 0 ? void 0 : outgoingLayer.classList.add("background-rotation-outgoing");
        outgoingLayer === null || outgoingLayer === void 0 ? void 0 : outgoingLayer.setAttribute("aria-hidden", "true");
        this.container.classList.add(this.options.transitionClass);
        this.setActiveItem(nextIndex, false);
        this.transitionTimer = window.setTimeout(() => this.finishTransition(), this.options.transitionDuration);
    }
    goToNextImage() {
        this.goToImage(this.getNextIndex());
        this.announceImage();
        if (this.canRotate())
            this.startRotationTimer();
    }
    goToPreviousImage() {
        const previousIndex = this.history.pop();
        if (previousIndex === undefined) {
            this.logger.log("No previous background image in the history");
            return;
        }
        this.goToImage(previousIndex, false);
        this.announceImage();
        if (this.canRotate())
            this.startRotationTimer();
    }
    togglePause() {
        this.isPaused = !this.isPaused;
        // Once the user touches the pause control the pause is theirs, so a later
        // reduced-motion change no longer auto-resumes the rotation
        this.pausedForReducedMotion = false;
        if (this.isPaused) {
            this.stopRotationTimer();
            this.logger.log("Background rotation paused");
        }
        else {
            if (this.canRotate())
                this.startRotationTimer();
            this.logger.log("Background rotation resumed");
        }
        this.updatePauseButton();
    }
    createControls() {
        const controls = document.createElement("div");
        controls.className = "background-rotation-controls";
        controls.setAttribute("role", "group");
        controls.setAttribute("aria-label", "Background image rotation controls");
        // Pause the auto-rotation while the user is hovering or tabbing through the
        // controls, so nobody has to chase a moving target
        controls.addEventListener("mouseenter", () => this.pauseForInteraction("hover"));
        controls.addEventListener("mouseleave", () => this.resumeFromInteraction("hover"));
        controls.addEventListener("focusin", () => this.pauseForInteraction("focus"));
        controls.addEventListener("focusout", (event) => {
            if (!controls.contains(event.relatedTarget)) {
                this.resumeFromInteraction("focus");
            }
        });
        this.previousButton = this.createControlButton("background-rotation-prev", "Previous background image", '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 18l-6-6 6-6"/></svg>');
        this.previousButton.addEventListener("click", () => this.goToPreviousImage());
        this.pauseButton = this.createControlButton("background-rotation-pause", "Pause background rotation", this.pauseIcon());
        this.pauseButton.setAttribute("aria-pressed", "false");
        this.pauseButton.addEventListener("click", () => this.togglePause());
        const nextButton = this.createControlButton("background-rotation-next", "Next background image", '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 18l6-6-6-6"/></svg>');
        nextButton.addEventListener("click", () => this.goToNextImage());
        this.liveRegion = document.createElement("div");
        this.liveRegion.className = "sr-only";
        this.liveRegion.setAttribute("aria-live", "polite");
        this.liveRegion.setAttribute("aria-atomic", "true");
        controls.append(this.previousButton, this.pauseButton, nextButton, this.liveRegion);
        document.body.appendChild(controls);
        this.updatePreviousButtonState();
        // Reflect a pause that happened before the controls existed (e.g. the
        // reduced-motion auto-pause in updateMode)
        this.updatePauseButton();
    }
    // Auto-rotation pauses while the user interacts with the controls, separately
    // from a user-initiated pause, and resumes when the interaction ends
    pauseForInteraction(kind) {
        this.interactionPauses.add(kind);
        if (!this.isPaused)
            this.stopRotationTimer();
    }
    resumeFromInteraction(kind) {
        this.interactionPauses.delete(kind);
        if (this.canRotate() &&
            this.rotationTimer === null &&
            !this.isStaticMode()) {
            this.startRotationTimer();
        }
    }
    // Auto-rotation only runs when nothing is holding it: no user-initiated pause,
    // and no hover or focus on the controls. Using a control implies one of those
    // interactions, so the timer can't be restarted out from under the user
    canRotate() {
        return !this.isPaused && this.interactionPauses.size === 0;
    }
    updatePreviousButtonState() {
        if (this.previousButton) {
            this.previousButton.disabled = this.history.length === 0;
        }
    }
    // Announce user-initiated image changes to screen readers. Auto-rotation is
    // intentionally not announced to avoid interrupting every few seconds.
    announceImage() {
        var _a;
        if (!this.liveRegion)
            return;
        const item = this.items[this.currentIndex];
        const description = ((_a = this.getItemImage(item)) === null || _a === void 0 ? void 0 : _a.getAttribute("alt")) ||
            this.getItemAttribution(item);
        this.liveRegion.textContent = `Background image ${this.currentIndex + 1} of ${this.items.length}${description ? `: ${description}` : ""}`;
    }
    createControlButton(className, ariaLabel, icon) {
        const button = document.createElement("button");
        button.type = "button";
        button.className = className;
        button.setAttribute("aria-label", ariaLabel);
        button.innerHTML = icon;
        return button;
    }
    updatePauseButton() {
        if (!this.pauseButton)
            return;
        this.pauseButton.innerHTML = this.isPaused
            ? this.playIcon()
            : this.pauseIcon();
        this.pauseButton.setAttribute("aria-label", this.isPaused ? "Play background rotation" : "Pause background rotation");
        this.pauseButton.setAttribute("aria-pressed", String(this.isPaused));
    }
    pauseIcon() {
        return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></svg>';
    }
    playIcon() {
        return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>';
    }
    getNextIndex() {
        switch (this.options.slideOrder) {
            case "sequential":
                return (this.currentIndex + 1) % this.items.length;
            case "true-random":
                return this.getRandomIndex(this.currentIndex);
            case "random":
            default:
                return this.getNextFromRandomBag();
        }
    }
    // "Random bag" selection: every image is displayed once before any image is
    // repeated, and the current image is never repeated back-to-back
    getNextFromRandomBag() {
        if (this.randomBag.length === 0) {
            this.randomBag = this.items
                .map((_, index) => index)
                .filter((index) => index !== this.currentIndex);
            for (let i = this.randomBag.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [this.randomBag[i], this.randomBag[j]] = [
                    this.randomBag[j],
                    this.randomBag[i],
                ];
            }
        }
        return this.randomBag.pop();
    }
    getRandomIndex(excludeIndex = -1) {
        if (this.items.length <= 1)
            return 0;
        let index = excludeIndex;
        while (index === excludeIndex) {
            index = Math.floor(Math.random() * this.items.length);
        }
        return index;
    }
    // Each item can set a data-theme="light" or data-theme="dark" (default)
    // attribute to control the .body-title h1 text color shown over its image
    getItemTheme(item) {
        var _a;
        return ((_a = item.getAttribute("data-theme")) === null || _a === void 0 ? void 0 : _a.toLowerCase()) === "light"
            ? "light"
            : "dark";
    }
    // Each item carries its own figattribution/figcaption (added by the MediaAttribution
    // component or authored directly), so it cross-fades in sync with its image
    getItemAttribution(item) {
        var _a;
        const attribution = item.matches("img")
            ? (_a = item.parentElement) === null || _a === void 0 ? void 0 : _a.querySelector("figattribution, figcaption")
            : item.querySelector("figattribution, figcaption");
        return attribution ? attribution.textContent : null;
    }
}
