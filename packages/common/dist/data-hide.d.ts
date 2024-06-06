export declare class DataHide {
    private logger;
    private enElements;
    constructor();
    /**
     * Hides all the elements based on the URL arguments.
     */
    hideAll(): void;
    /**
     * Hides a specific element based on the item and type.
     * @param item - The item to hide (ID or class name).
     * @param type - The type of the item (either "id" or "class").
     */
    hideItem(item: string, type: "id" | "class"): void;
}
