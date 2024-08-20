export declare class ENValidators {
    private _form;
    private _enElements;
    private logger;
    constructor();
    loadValidators(): boolean;
    shouldRun(): boolean | null | undefined;
    enOnValidate(): void;
    liveValidate(container: HTMLDivElement, field: Element, regex: string, message: string): boolean;
}
