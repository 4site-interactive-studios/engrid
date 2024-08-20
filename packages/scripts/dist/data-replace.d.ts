export declare class DataReplace {
    private logger;
    private enElements;
    constructor();
    /**
     * Searches for HTML elements containing the data to be replaced.
     */
    searchElements(): void;
    /**
     * Checks if there are elements to be replaced.
     * @returns True if there are elements to be replaced, false otherwise.
     */
    shouldRun(): boolean;
    /**
     * Replaces all occurrences of data in the HTML elements.
     */
    replaceAll(): void;
    /**
     * Replaces a specific data item in the given HTML element.
     * @param where The HTML element where the replacement should occur.
     * @param item The matched data item.
     * @param key The key of the data item.
     * @param defaultValue The default value to use if the data item is not found.
     */
    replaceItem(where: HTMLElement, [item, key, defaultValue]: RegExpMatchArray): void;
}
