import { ENGrid } from "./engrid";
export class Modal {
    constructor(options) {
        this.modal = null;
        this.defaultOptions = {
            onClickOutside: "close",
            addCloseButton: false,
            closeButtonLabel: "Okay!",
        };
        this.focusTrapHandler = (e) => {
            const modalElement = this.modal;
            const focusableElements = [
                ...modalElement.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'),
            ];
            const firstFocusable = focusableElements[0];
            const lastFocusable = focusableElements[focusableElements.length - 1];
            const isTabPressed = e.key === "Tab";
            if (!isTabPressed) {
                return;
            }
            if (e.shiftKey) {
                if (document.activeElement === firstFocusable) {
                    e.preventDefault();
                    lastFocusable.focus();
                }
            }
            else {
                if (document.activeElement === lastFocusable) {
                    e.preventDefault();
                    firstFocusable.focus();
                }
            }
        };
        this.options = Object.assign(Object.assign({}, this.defaultOptions), options);
        this.modalContent = this.getModalContent();
        this.createModal();
    }
    createModal() {
        var _a;
        this.modal = document.createElement("div");
        this.modal.classList.add("engrid-modal", "modal--hidden");
        this.modal.setAttribute("aria-hidden", "true");
        this.modal.setAttribute("role", "dialog");
        this.modal.setAttribute("aria-modal", "true");
        this.modal.setAttribute("tabindex", "-1");
        this.modal.innerHTML = `
      <div class="engrid-modal__overlay" tabindex="-1">
        <div class="engrid-modal__container" tabindex="0">
          <div class="engrid-modal__close" role="button" tabindex="0" aria-label="Close">
            X
          </div>
          <div class="engrid-modal__body"></div>
        </div>
      </div>
    `;
        (_a = document.getElementById("engrid")) === null || _a === void 0 ? void 0 : _a.appendChild(this.modal);
        const modalBody = this.modal.querySelector(".engrid-modal__body");
        if (this.modalContent instanceof NodeList) {
            this.modalContent.forEach((content) => {
                modalBody === null || modalBody === void 0 ? void 0 : modalBody.appendChild(content);
            });
        }
        else if (typeof this.modalContent === "string") {
            modalBody === null || modalBody === void 0 ? void 0 : modalBody.insertAdjacentHTML("beforeend", this.modalContent);
        }
        else {
            modalBody === null || modalBody === void 0 ? void 0 : modalBody.appendChild(this.modalContent);
        }
        if (this.options.addCloseButton) {
            const button = document.createElement("button");
            button.classList.add("engrid-modal__button");
            button.textContent = this.options.closeButtonLabel;
            button.addEventListener("click", () => {
                this.close();
            });
            modalBody === null || modalBody === void 0 ? void 0 : modalBody.appendChild(button);
        }
        this.addEventListeners();
    }
    addEventListeners() {
        var _a, _b, _c, _d, _e;
        // Close event on top X
        (_b = (_a = this.modal) === null || _a === void 0 ? void 0 : _a.querySelector(".engrid-modal__close")) === null || _b === void 0 ? void 0 : _b.addEventListener("click", () => {
            this.close();
        });
        // Bounce scale when clicking outside of modal
        (_d = (_c = this.modal) === null || _c === void 0 ? void 0 : _c.querySelector(".engrid-modal__overlay")) === null || _d === void 0 ? void 0 : _d.addEventListener("click", (event) => {
            if (event.target === event.currentTarget) {
                if (this.options.onClickOutside === "close") {
                    this.close();
                }
                else if (this.options.onClickOutside === "bounce") {
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
        const closeEls = (_e = this.modal) === null || _e === void 0 ? void 0 : _e.querySelectorAll(".modal__close");
        closeEls === null || closeEls === void 0 ? void 0 : closeEls.forEach((el) => {
            el.addEventListener("click", () => {
                this.close();
            });
        });
    }
    open() {
        var _a, _b, _c, _d;
        ENGrid.setBodyData("has-lightbox", "true");
        (_a = this.modal) === null || _a === void 0 ? void 0 : _a.classList.remove("modal--hidden");
        (_b = this.modal) === null || _b === void 0 ? void 0 : _b.removeAttribute("aria-hidden");
        const container = (_c = this.modal) === null || _c === void 0 ? void 0 : _c.querySelector(".engrid-modal__container");
        container === null || container === void 0 ? void 0 : container.focus({ preventScroll: true });
        (_d = this.modal) === null || _d === void 0 ? void 0 : _d.addEventListener("keydown", this.focusTrapHandler);
    }
    close() {
        var _a, _b, _c;
        ENGrid.setBodyData("has-lightbox", false);
        (_a = this.modal) === null || _a === void 0 ? void 0 : _a.classList.add("modal--hidden");
        (_b = this.modal) === null || _b === void 0 ? void 0 : _b.setAttribute("aria-hidden", "true");
        (_c = this.modal) === null || _c === void 0 ? void 0 : _c.removeEventListener("keydown", this.focusTrapHandler);
    }
    getModalContent() {
        return "<h1>Default Modal Content</h1>";
    }
}
