export declare class ShowHideRadioCheckboxes {
    elements: NodeList;
    classes: string;
    private logger;
    createDataAttributes(): void;
    hideAll(): void;
    hide(item: HTMLInputElement): void;
    show(item: HTMLInputElement): void;
    private toggleValue;
    getSessionState(): any;
    storeSessionState(): void;
    constructor(elements: string, classes: string);
}
