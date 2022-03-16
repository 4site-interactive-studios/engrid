export declare class ShowHideRadioCheckboxes {
    elements: NodeList;
    classes: string;
    private logger;
    hideAll(): void;
    hide(item: HTMLInputElement): void;
    show(item: HTMLInputElement): void;
    constructor(elements: string, classes: string);
}
