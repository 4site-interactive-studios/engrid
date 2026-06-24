export declare class SupporterHub {
    private logger;
    private _form;
    private closeListener;
    constructor();
    shoudRun(): boolean;
    watch(): void;
    pageAltsAndArias(): void;
    creditCardUpdate(overlay: HTMLDivElement): void;
    amountLabelUpdate(overlay: HTMLDivElement): void;
    dialogAltsAndArias(overlay: HTMLDivElement): void;
    private preventDuplicateSubmits;
}
