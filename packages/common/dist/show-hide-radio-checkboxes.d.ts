export declare class ShowHideRadioCheckboxes {
    elements: NodeList;
    classes: string;
    private logger;
    hideAll(): void;
    hide(item: HTMLInputElement): void;
    show(item: HTMLInputElement): void;
    private toggleValue;
    constructor(elements: string, classes: string);
}
