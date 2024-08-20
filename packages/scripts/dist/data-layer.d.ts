export declare class DataLayer {
    private logger;
    private dataLayer;
    private _form;
    private static instance;
    private endOfGiftProcessStorageKey;
    private excludedFields;
    private hashedFields;
    constructor();
    static getInstance(): DataLayer;
    private transformJSON;
    private onLoad;
    private onSubmit;
    private attachEventListeners;
    private handleFieldValueChange;
    private hash;
    private getFieldLabel;
    addEndOfGiftProcessEvent(eventName: string, eventProperties?: object): void;
    addEndOfGiftProcessVariable(variableName: string, variableValue?: any): void;
    private storeEndOfGiftProcessData;
    private addEndOfGiftProcessEventsToDataLayer;
    private getEndOfGiftProcessData;
}
