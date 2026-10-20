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
 */
import { ENGrid, EngridLogger, A11y } from ".";

export class EcardPreview {
  private logger: EngridLogger = new EngridLogger(
    "Ecard Preview",
    "#4B2682",
    "#FFFFFF",
    "🖼️"
  );

  private previewCapable = false;
  private handshakeAttempts = 0;
  private handshakeTimer: ReturnType<typeof setInterval> | null = null;
  private delegatedModal: HTMLElement | null = null;
  private requestingIframe: HTMLIFrameElement | null = null;

  constructor() {
    if (this.isEmbeddedEcardPage()) {
      this.setupEmbeddedEcardPage();
    }
    // The parent-side listener runs on every ENgrid page so any embedded
    // ENgrid ecard iframe (EmbeddedEcard or a generic embed) is supported
    this.setupParentPage();
  }

  private isEmbeddedEcardPage(): boolean {
    return (
      ENGrid.getPageType() === "ECARD" &&
      this.inIframe() &&
      (ENGrid.hasBodyData("embedded-ecard") || ENGrid.hasBodyData("embedded"))
    );
  }

  private setupEmbeddedEcardPage() {
    const previewButton = document.querySelector(
      ".en__ecarditems__showprev"
    ) as HTMLElement;
    if (!previewButton) return;

    // Hide the button until the parent confirms it can display the preview
    previewButton.style.display = "none";

    window.addEventListener("message", (e) => {
      if (e.origin !== location.origin || !e.data?.action) return;
      if (e.data.action === "ecard_preview_available") {
        this.previewCapable = true;
        if (this.handshakeTimer) {
          clearInterval(this.handshakeTimer);
          this.handshakeTimer = null;
        }
        previewButton.style.display = "";
        // Keeps the native modal inside the iframe hidden when EN shows it
        document.body.classList.add("engrid-ecard-preview-delegated");
        this.logger.log(
          "Parent page can display the ecard preview - delegating"
        );
      }
    });

    // Handshake with the parent, retried to cover the parent still loading
    this.sendHandshake();
    this.handshakeTimer = setInterval(() => this.sendHandshake(), 250);

    // When the preview button is clicked, EN's own handler builds the preview
    // iframe src (with the current form values) and shows the modal. We watch
    // for that, grab the URL, hide the local modal and delegate to the parent.
    const previewModal = document.querySelector(
      ".en__ecarditems__preview"
    ) as HTMLElement;
    if (!previewModal) return;
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (
          mutation.type === "attributes" &&
          mutation.attributeName === "class" &&
          this.previewCapable &&
          previewModal.classList.contains("preview--show")
        ) {
          const iframe = previewModal.querySelector("iframe");
          const previewUrl = iframe?.getAttribute("src");
          previewModal.classList.remove("preview--show");
          if (previewUrl) {
            this.logger.log("Delegating ecard preview to parent", previewUrl);
            window.parent.postMessage(
              { action: "show_ecard_preview", previewUrl },
              location.origin
            );
          }
        }
      });
    });
    observer.observe(previewModal, {
      attributes: true,
      attributeFilter: ["class"],
    });
  }

  private sendHandshake() {
    window.parent.postMessage(
      { action: "ecard_preview_handshake" },
      location.origin
    );
    this.handshakeAttempts++;
    if (this.handshakeAttempts >= 8 && this.handshakeTimer) {
      clearInterval(this.handshakeTimer);
      this.handshakeTimer = null;
      this.logger.log(
        "Parent page cannot display the ecard preview - hiding the preview button"
      );
    }
  }

  private setupParentPage() {
    window.addEventListener("message", (e) => {
      if (e.origin !== location.origin || !e.data?.action) return;
      const iframe = this.getIframeBySource(e.source);
      if (!iframe) return;

      switch (e.data.action) {
        case "ecard_preview_handshake":
          this.logger.log("Received ecard preview handshake from iframe");
          (e.source as Window).postMessage(
            { action: "ecard_preview_available" },
            e.origin
          );
          break;
        case "show_ecard_preview":
          this.showDelegatedPreview(e.data.previewUrl, iframe);
          break;
      }
    });

    document.addEventListener("keydown", (e: KeyboardEvent) => {
      if (e.key === "Escape" && this.delegatedModal) {
        this.closeDelegatedPreview();
      }
    });
  }

  private showDelegatedPreview(
    previewUrl: string,
    iframe: HTMLIFrameElement
  ) {
    if (!previewUrl) return;
    // Only same-origin EN preview URLs are displayed in the modal
    try {
      if (new URL(previewUrl, location.origin).origin !== location.origin) {
        this.logger.log("Ignoring cross-origin ecard preview URL", previewUrl);
        return;
      }
    } catch (e) {
      return;
    }

    this.requestingIframe = iframe;

    if (this.delegatedModal) {
      this.delegatedModal
        .querySelector("iframe")
        ?.setAttribute("src", previewUrl);
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

    const previewIframe = modal.querySelector(
      "iframe"
    ) as HTMLIFrameElement;
    previewIframe.src = previewUrl;

    modal
      .querySelector(".en__ecarditems__prevclose")
      ?.addEventListener("click", () => this.closeDelegatedPreview());

    document.body.appendChild(modal);
    this.delegatedModal = modal;

    // Center the wrap like EN does, with negative margins equal to half its
    // dimensions, and flag overflow when the viewport is smaller than the wrap
    const wrap = modal.querySelector(
      ".en__ecarditems__prevwrap"
    ) as HTMLElement;
    wrap.style.marginLeft = `-${wrap.offsetWidth / 2}px`;
    wrap.style.marginTop = `-${wrap.offsetHeight / 2}px`;
    if (wrap.offsetWidth > window.innerWidth) {
      modal.classList.add("overflow--width");
    }
    if (wrap.offsetHeight > window.innerHeight) {
      modal.classList.add("overflow--height");
    }

    A11y.inertPage(true, modal);
    (
      modal.querySelector(".en__ecarditems__prevclose") as HTMLElement
    )?.focus();

    this.logger.log("Displaying delegated ecard preview", previewUrl);
  }

  private closeDelegatedPreview() {
    this.delegatedModal?.remove();
    this.delegatedModal = null;
    A11y.inertPage(false);
    // Return focus to the preview button inside the requesting iframe.
    // Same-origin is guaranteed by the origin checks on the messages.
    try {
      const iframeDoc = this.requestingIframe?.contentDocument;
      (
        iframeDoc?.querySelector(".en__ecarditems__showprev") as HTMLElement
      )?.focus();
    } catch (e) {}
    this.requestingIframe = null;
    this.logger.log("Closed delegated ecard preview");
  }

  private getIframeBySource(source: MessageEventSource | null) {
    return (
      Array.from(document.querySelectorAll("iframe")).find(
        (iframe) => iframe.contentWindow === source
      ) || null
    );
  }

  private inIframe() {
    try {
      return window.self !== window.top;
    } catch (e) {
      return true;
    }
  }
}
