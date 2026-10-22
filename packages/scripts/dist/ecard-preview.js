/**
 * EcardPreview delegates the Engaging Networks ecard preview modal to the
 * parent window when an ecard page is embedded inside another ENgrid page.
 *
 * Embedded ecard page (child):
 * - Detects it is embedded (data-engrid-embedded-ecard / data-engrid-embedded)
 *   and performs a handshake with the parent to find out if it is an ENgrid
 *   page capable of displaying the preview modal.
 * - If the parent is capable, the preview button is kept visible and, when
 *   clicked, the preview URL built by EN is posted to the parent instead of
 *   opening the modal inside the iframe.
 * - If the parent does not respond, the preview button is hidden.
 *
 * Host page (parent):
 * - Listens for the handshake and the preview URL, builds a modal following
 *   the exact structure EN uses for their preview, and wires the close
 *   button and Escape key to close it.
 *
 * Both the delegated modal and EN's native modal on standalone ecard pages
 * are widened to fit the preview content when it scrolls horizontally and
 * the viewport is wide enough to display it all.
 */
import { ENGrid, EngridLogger, A11y } from ".";
export class EcardPreview {
    constructor() {
        this.logger = new EngridLogger("Ecard Preview", "#4B2682", "#FFFFFF", "🖼️");
        this.previewCapable = false;
        this.handshakeAttempts = 0;
        this.handshakeTimer = null;
        this.delegatedModal = null;
        this.requestingIframe = null;
        if (this.isEmbeddedEcardPage()) {
            this.setupEmbeddedEcardPage();
        }
        else if (ENGrid.getPageType() === "ECARD" && !this.inIframe()) {
            // Standalone ecard page - enhance EN's native preview modal
            this.setupNativePreviewEnhancements();
        }
        // The parent-side listener runs on every ENgrid page so any embedded
        // ENgrid ecard iframe (EmbeddedEcard or a generic embed) is supported
        this.setupParentPage();
    }
    isEmbeddedEcardPage() {
        return (ENGrid.getPageType() === "ECARD" &&
            this.inIframe() &&
            (ENGrid.hasBodyData("embedded-ecard") || ENGrid.hasBodyData("embedded")));
    }
    setupEmbeddedEcardPage() {
        const previewButton = document.querySelector(".en__ecarditems__showprev");
        if (!previewButton)
            return;
        // Hide the button until the parent confirms it can display the preview
        previewButton.style.display = "none";
        window.addEventListener("message", (e) => {
            var _a;
            if (e.origin !== location.origin || !((_a = e.data) === null || _a === void 0 ? void 0 : _a.action))
                return;
            if (e.data.action === "ecard_preview_available") {
                this.previewCapable = true;
                if (this.handshakeTimer) {
                    clearInterval(this.handshakeTimer);
                    this.handshakeTimer = null;
                }
                previewButton.style.display = "";
                // Keeps the native modal inside the iframe hidden when EN shows it
                document.body.classList.add("engrid-ecard-preview-delegated");
                this.logger.log("Parent page can display the ecard preview - delegating");
            }
        });
        // Handshake with the parent, retried to cover the parent still loading
        this.sendHandshake();
        this.handshakeTimer = setInterval(() => this.sendHandshake(), 250);
        // When the preview button is clicked, EN's own handler builds the preview
        // iframe src (with the current form values) and shows the modal. We watch
        // for that, grab the URL, hide the local modal and delegate to the parent.
        const previewModal = document.querySelector(".en__ecarditems__preview");
        if (!previewModal)
            return;
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === "attributes" &&
                    mutation.attributeName === "class" &&
                    this.previewCapable &&
                    previewModal.classList.contains("preview--show")) {
                    const iframe = previewModal.querySelector("iframe");
                    const previewUrl = iframe === null || iframe === void 0 ? void 0 : iframe.getAttribute("src");
                    previewModal.classList.remove("preview--show");
                    if (previewUrl) {
                        this.logger.log("Delegating ecard preview to parent", previewUrl);
                        window.parent.postMessage({ action: "show_ecard_preview", previewUrl }, location.origin);
                    }
                }
            });
        });
        observer.observe(previewModal, {
            attributes: true,
            attributeFilter: ["class"],
        });
    }
    /**
     * Enhances EN's native preview modal on standalone (non-embedded) ecard
     * pages: when the modal opens, widen it to fit the preview content if the
     * viewport is wide enough.
     */
    setupNativePreviewEnhancements() {
        const previewModal = document.querySelector(".en__ecarditems__preview");
        if (!previewModal)
            return;
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === "attributes" &&
                    mutation.attributeName === "class" &&
                    previewModal.classList.contains("preview--show")) {
                    this.fitPreviewToContent(previewModal);
                }
            });
        });
        observer.observe(previewModal, {
            attributes: true,
            attributeFilter: ["class"],
        });
    }
    sendHandshake() {
        window.parent.postMessage({ action: "ecard_preview_handshake" }, location.origin);
        this.handshakeAttempts++;
        if (this.handshakeAttempts >= 8 && this.handshakeTimer) {
            clearInterval(this.handshakeTimer);
            this.handshakeTimer = null;
            this.logger.log("Parent page cannot display the ecard preview - hiding the preview button");
        }
    }
    setupParentPage() {
        window.addEventListener("message", (e) => {
            var _a;
            if (e.origin !== location.origin || !((_a = e.data) === null || _a === void 0 ? void 0 : _a.action))
                return;
            const iframe = this.getIframeBySource(e.source);
            if (!iframe)
                return;
            switch (e.data.action) {
                case "ecard_preview_handshake":
                    this.logger.log("Received ecard preview handshake from iframe");
                    e.source.postMessage({ action: "ecard_preview_available" }, e.origin);
                    break;
                case "show_ecard_preview":
                    this.showDelegatedPreview(e.data.previewUrl, iframe);
                    break;
            }
        });
        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape" && this.delegatedModal) {
                this.closeDelegatedPreview();
            }
        });
    }
    showDelegatedPreview(previewUrl, iframe) {
        var _a, _b, _c;
        if (!previewUrl)
            return;
        // Only same-origin EN preview URLs are displayed in the modal
        try {
            if (new URL(previewUrl, location.origin).origin !== location.origin) {
                this.logger.log("Ignoring cross-origin ecard preview URL", previewUrl);
                return;
            }
        }
        catch (e) {
            return;
        }
        this.requestingIframe = iframe;
        if (this.delegatedModal) {
            (_a = this.delegatedModal
                .querySelector("iframe")) === null || _a === void 0 ? void 0 : _a.setAttribute("src", previewUrl);
            this.fitPreviewToContent(this.delegatedModal);
            return;
        }
        // Follows the exact structure EN uses for their ecard preview modal so
        // enPage.css styles apply on the parent page
        const modal = document.createElement("div");
        modal.classList.add("en__ecarditems__preview", "preview--show");
        modal.setAttribute("role", "dialog");
        modal.setAttribute("aria-modal", "true");
        modal.setAttribute("aria-label", "Ecard Preview Modal");
        modal.id = "ecard-preview";
        modal.innerHTML = `
      <div class="en__ecarditems__prevbg"></div>
      <div class="en__ecarditems__prevwrap">
        <iframe frameborder="0" scrolling="yes" title="Ecard Preview Frame"></iframe>
        <button type="button" class="en__ecarditems__prevclose" role="button" aria-label="Close Preview">✕</button>
      </div>`;
        const previewIframe = modal.querySelector("iframe");
        previewIframe.src = previewUrl;
        (_b = modal
            .querySelector(".en__ecarditems__prevclose")) === null || _b === void 0 ? void 0 : _b.addEventListener("click", () => this.closeDelegatedPreview());
        document.body.appendChild(modal);
        this.delegatedModal = modal;
        // Center like EN does and widen to fit the preview content once the
        // iframe has loaded
        this.fitPreviewToContent(modal);
        A11y.inertPage(true, modal);
        (_c = modal.querySelector(".en__ecarditems__prevclose")) === null || _c === void 0 ? void 0 : _c.focus();
        this.logger.log("Displaying delegated ecard preview", previewUrl);
    }
    /**
     * Centers the preview wrap like EN does (negative margins equal to half its
     * dimensions) and flags overflow when the viewport is smaller than the wrap.
     */
    centerPreviewWrap(modal) {
        const wrap = modal.querySelector(".en__ecarditems__prevwrap");
        if (!wrap)
            return;
        wrap.style.marginLeft = `-${wrap.offsetWidth / 2}px`;
        wrap.style.marginTop = `-${wrap.offsetHeight / 2}px`;
        modal.classList.toggle("overflow--width", wrap.offsetWidth >= window.innerWidth);
        modal.classList.toggle("overflow--height", wrap.offsetHeight > window.innerHeight);
    }
    /**
     * Widens the preview modal to fit the ecard content when the preview iframe
     * scrolls horizontally and the viewport is wide enough to display it all.
     * The preview URL is same-origin, so the iframe content can be measured.
     */
    fitPreviewToContent(modal) {
        var _a;
        this.centerPreviewWrap(modal);
        const wrap = modal.querySelector(".en__ecarditems__prevwrap");
        const iframe = modal.querySelector("iframe");
        if (!wrap || !iframe || iframe.dataset.engridFitBound)
            return;
        iframe.dataset.engridFitBound = "true";
        const widen = () => {
            var _a, _b, _c, _d;
            let contentWidth = 0;
            try {
                const iframeDoc = iframe.contentDocument;
                if (iframeDoc) {
                    contentWidth = Math.max((_b = (_a = iframeDoc.documentElement) === null || _a === void 0 ? void 0 : _a.scrollWidth) !== null && _b !== void 0 ? _b : 0, (_d = (_c = iframeDoc.body) === null || _c === void 0 ? void 0 : _c.scrollWidth) !== null && _d !== void 0 ? _d : 0);
                }
            }
            catch (e) {
                // Cross-origin preview - cannot measure the content
                return;
            }
            if (!contentWidth)
                return;
            // Never exceed 90vw (matches the CSS max-width on the wrap) and leave
            // a gutter so the modal never touches the viewport edges
            const maxWidth = Math.min(window.innerWidth * 0.9, window.innerWidth - 32);
            const targetWidth = Math.min(contentWidth, maxWidth);
            if (targetWidth > wrap.offsetWidth) {
                wrap.style.width = `${targetWidth}px`;
                this.logger.log(`Widened ecard preview to fit content (${contentWidth}px content, ${targetWidth}px applied)`);
            }
            this.centerPreviewWrap(modal);
        };
        try {
            if (((_a = iframe.contentDocument) === null || _a === void 0 ? void 0 : _a.readyState) === "complete") {
                widen();
            }
        }
        catch (e) { }
        iframe.addEventListener("load", widen);
    }
    closeDelegatedPreview() {
        var _a, _b, _c;
        (_a = this.delegatedModal) === null || _a === void 0 ? void 0 : _a.remove();
        this.delegatedModal = null;
        A11y.inertPage(false);
        // Return focus to the preview button inside the requesting iframe.
        // Same-origin is guaranteed by the origin checks on the messages.
        try {
            const iframeDoc = (_b = this.requestingIframe) === null || _b === void 0 ? void 0 : _b.contentDocument;
            (_c = iframeDoc === null || iframeDoc === void 0 ? void 0 : iframeDoc.querySelector(".en__ecarditems__showprev")) === null || _c === void 0 ? void 0 : _c.focus();
        }
        catch (e) { }
        this.requestingIframe = null;
        this.logger.log("Closed delegated ecard preview");
    }
    getIframeBySource(source) {
        return (Array.from(document.querySelectorAll("iframe")).find((iframe) => iframe.contentWindow === source) || null);
    }
    inIframe() {
        try {
            return window.self !== window.top;
        }
        catch (e) {
            return true;
        }
    }
}
