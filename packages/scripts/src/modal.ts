import { ENGrid } from "./engrid";

interface ModalOptions {
  onClickOutside?: "close" | "bounce";
  addCloseButton?: boolean;
  closeButtonLabel?: string;
  customClass?: string;
  showCloseX?: boolean;
  closeOnEsc?: boolean;
  onDismiss?: () => void;
}

export abstract class Modal {
  public modalContent: NodeListOf<Element> | HTMLElement | String;
  public modal: HTMLDivElement | null = null;
  private defaultOptions: ModalOptions = {
    onClickOutside: "close",
    addCloseButton: false,
    closeButtonLabel: "Okay!",
    customClass: "",
    showCloseX: true,
    closeOnEsc: true,
    onDismiss: () => {},
  };
  private options: ModalOptions;

  protected constructor(options: ModalOptions) {
    this.options = { ...this.defaultOptions, ...options };
    this.modalContent = this.getModalContent();
    this.createModal();
  }

  private createModal(): void {
    this.modal = document.createElement("div");
    this.modal.classList.add("engrid-modal", "modal--hidden");
    if (this.options.customClass && this.options.customClass !== "") {
      this.options.customClass.split(" ").forEach((customClass) => {
        if (!customClass) return;
        this.modal!.classList.add(customClass);
      });
    }
    if (this.options.showCloseX) {
      this.modal.classList.add("engrid-modal--close-x");
    }
    this.modal.setAttribute("aria-hidden", "true");
    this.modal.setAttribute("role", "dialog");
    this.modal.setAttribute("aria-modal", "true");
    this.modal.setAttribute("tabindex", "-1");
    this.modal.innerHTML = `
      <div class="engrid-modal__overlay" tabindex="-1">
        <div class="engrid-modal__container" tabindex="0">
          <div class="engrid-modal__close engrid-modal__close-x" role="button" tabindex="0" aria-label="Close">
            X
          </div>
          <div class="engrid-modal__body"></div>
        </div>
      </div>
    `;

    document.getElementById("engrid")?.appendChild(this.modal);

    const modalBody = this.modal.querySelector(".engrid-modal__body");

    if (this.modalContent instanceof NodeList) {
      this.modalContent.forEach((content) => {
        modalBody?.appendChild(content);
      });
    } else if (typeof this.modalContent === "string") {
      modalBody?.insertAdjacentHTML("beforeend", this.modalContent);
    } else {
      modalBody?.appendChild(<Node>this.modalContent);
    }

    if (this.options.addCloseButton) {
      const button = document.createElement("button");
      button.classList.add("engrid-modal__button");
      button.textContent = this.options.closeButtonLabel as string;
      button.addEventListener("click", () => {
        this.dismiss();
      });
      modalBody?.appendChild(button);
    }

    this.addEventListeners();
  }

  private addEventListeners(): void {
    // Close event on top X
    this.modal
      ?.querySelector(".engrid-modal__close")
      ?.addEventListener("click", () => {
        this.dismiss();
      });

    // Bounce scale when clicking outside of modal
    this.modal
      ?.querySelector(".engrid-modal__overlay")
      ?.addEventListener("click", (event) => {
        if (event.target === event.currentTarget) {
          if (this.options.onClickOutside === "close") {
            this.dismiss();
          } else if (this.options.onClickOutside === "bounce") {
            const modal = document.querySelector(".engrid-modal");
            if (modal) {
              modal.classList.remove("engrid-modal--scale");
              void modal.clientWidth;
              modal.classList.add("engrid-modal--scale");
            }
          }
        }
      });

    // Close on "modal__close" click
    const closeEls = this.modal?.querySelectorAll(".modal__close");
    closeEls?.forEach((el) => {
      el.addEventListener("click", () => {
        this.dismiss();
      });
    });
  }

  /**
   * Generic entry point for dismissing the modal.
   * Fires the onDismiss callback before closing, so consumers can react to the modal being
   * dismissed rather than closed via their own explicit button logic.
   */
  private dismiss(): void {
    this.options.onDismiss?.();
    this.close();
  }

  private focusTrapHandler = (e: KeyboardEvent) => {
    const modalElement = this.modal as HTMLElement;

    const focusableElements: Array<HTMLElement> = [
      ...(modalElement.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      ) as NodeListOf<HTMLElement>),
    ];

    const firstFocusable = focusableElements[0] as HTMLElement;
    const lastFocusable = focusableElements[
      focusableElements.length - 1
    ] as HTMLElement;

    const isTabPressed = e.key === "Tab";

    if (!isTabPressed) {
      return;
    }

    if (e.shiftKey) {
      if (document.activeElement === firstFocusable) {
        e.preventDefault();
        lastFocusable.focus();
      }
    } else {
      if (document.activeElement === lastFocusable) {
        e.preventDefault();
        firstFocusable.focus();
      }
    }
  };

  private escKeyHandler = (e: KeyboardEvent) => {
    if (e.key === "Escape" && this.options.closeOnEsc) {
      this.dismiss();
    }
  };

  public open(): void {
    ENGrid.setBodyData("has-lightbox", "true");
    this.modal?.classList.remove("modal--hidden");
    this.modal?.removeAttribute("aria-hidden");
    const container = this.modal?.querySelector(
      ".engrid-modal__container"
    ) as HTMLElement;
    container?.focus({ preventScroll: true });
    this.modal?.addEventListener("keydown", this.focusTrapHandler);
    this.modal?.addEventListener("keydown", this.escKeyHandler);
  }

  public close(): void {
    ENGrid.setBodyData("has-lightbox", false);
    this.modal?.classList.add("modal--hidden");
    this.modal?.setAttribute("aria-hidden", "true");
    this.modal?.removeEventListener("keydown", this.focusTrapHandler);
    this.modal?.removeEventListener("keydown", this.escKeyHandler);
  }

  public getModalContent(): NodeListOf<Element> | HTMLElement | String {
    return "<h1>Default Modal Content</h1>";
  }
}
