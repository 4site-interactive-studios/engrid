export declare class SupporterHub {
    private logger;
    private _form;
    constructor();
    shoudRun(): boolean;
    watch(): void;
    pageAltsAndArias(): void;
    /**
     * The Supporter Hub login form shows success / failure / loading messages by
     * toggling the inline `display` on static `.en__hubgadget__response` divs.
     * Engaging Networks owns that behavior, and screen readers don't reliably
     * announce content that was already in the DOM and merely flipped to visible.
     *
     * We hide the originals from AT and mirror the active message into a polite
     * (`role="status"`) or assertive (`role="alert"`, for failures) live region.
     * On any display change we debounce, then announce whichever response is
     * currently visible, preferring a terminal result over the transient
     * "Loading" so an instant failure isn't preceded by a stray "Loading".
     */
    private announceLoginResponses;
    creditCardUpdate(overlay: HTMLDivElement): void;
    amountLabelUpdate(overlay: HTMLDivElement): void;
    dialogAltsAndArias(overlay: HTMLDivElement): void;
    private preventDuplicateSubmits;
}
