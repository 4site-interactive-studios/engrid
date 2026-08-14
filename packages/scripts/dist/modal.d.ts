interface ModalOptions {
    onClickOutside?: "close" | "bounce";
    addCloseButton?: boolean;
    closeButtonLabel?: string;
    customClass?: string;
    showCloseX?: boolean;
    closeOnEsc?: boolean;
    onDismiss?: () => void;
}
export declare abstract class Modal {
    modalContent: NodeListOf<Element> | HTMLElement | String;
    modal: HTMLDivElement | null;
    private defaultOptions;
    private options;
    protected constructor(options: ModalOptions);
    private createModal;
    private addEventListeners;
    /**
     * Generic entry point for dismissing the modal.
     * Fires the onDismiss callback before closing, so consumers can react to the modal being
     * dismissed rather than closed via their own explicit button logic.
     */
    private dismiss;
    private focusTrapHandler;
    private escKeyHandler;
    open(): void;
    close(): void;
    getModalContent(): NodeListOf<Element> | HTMLElement | String;
}
export {};
