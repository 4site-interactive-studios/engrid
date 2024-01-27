interface ModalOptions {
    onClickOutside: "close" | "bounce";
    addCloseButton: boolean;
    closeButtonLabel: string;
}
export declare abstract class Modal {
    modalContent: NodeListOf<Element> | HTMLElement | String;
    private modal;
    private defaultOptions;
    private options;
    protected constructor(options: ModalOptions);
    private createModal;
    private addEventListeners;
    private focusTrapHandler;
    open(): void;
    close(): void;
    getModalContent(): NodeListOf<Element> | HTMLElement | String;
}
export {};
