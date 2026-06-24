export declare class SupporterHub {
    private logger;
    private _form;
    constructor();
    shoudRun(): boolean;
    watch(): void;
    pageAltsAndArias(): void;
    creditCardUpdate(overlay: HTMLDivElement): void;
    amountLabelUpdate(overlay: HTMLDivElement): void;
    dialogAltsAndArias(overlay: HTMLDivElement): void;
    private preventDuplicateSubmits;
}
