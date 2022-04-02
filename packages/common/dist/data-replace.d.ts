export declare class DataReplace {
    private logger;
    private enElements;
    constructor();
    searchElements(): void;
    shouldRun(): boolean;
    replaceAll(): void;
    replaceItem(where: HTMLElement, [item, key, defaultValue]: RegExpMatchArray): void;
}
