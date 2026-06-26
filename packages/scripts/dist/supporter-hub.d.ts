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
     * Wire the login body up to the shared response announcer.
     */
    private announceLoginResponses;
    /**
     * Mirror `.en__hubgadget__response` messages within `container` into screen
     * reader live regions. Engaging Networks owns these responses, and assistive
     * tech doesn't reliably announce content that was already in the DOM and
     * merely flipped to visible — and in hub overlays the responses don't even
     * exist until a submit injects them.
     *
     * We append a polite (`role="status"`) and an assertive (`role="alert"`) live
     * region, hide the originals from AT, then on any childList / display / class
     * change we debounce and announce whichever response is currently visible,
     * preferring a terminal result over the transient "Loading" so an instant
     * failure isn't preceded by a stray "Loading". Failures (and, for overlays,
     * all messages) use the assertive region; everything else uses the polite one.
     *
     * This is a form-agnostic engine: callers supply their own side effects via
     * `onResult` rather than this method knowing about any specific form.
     *
     * @param container The element that holds (or will hold) the responses.
     * @param options   `preferAssertive` announces success assertively too —
     *                  overlays redraw their content (and shift focus) on success,
     *                  which makes screen readers drop polite announcements, so
     *                  assertive ones are used to survive that. `onResult` is fired
     *                  with each settled result (and the assertive region's id) so
     *                  callers can react — e.g. the login form flags its email
     *                  field invalid — without baking that into the engine.
     */
    private announceHubResponses;
    /**
     * Run the field-level accessibility scan and response announcer against a
     * freshly opened overlay. EN injects overlay markup (and its fields) when the
     * gadget is clicked, so A11y's constructor-time sweep never sees them. The
     * scan is idempotent and the announcer guards against double-wiring, so a
     * delayed pass — matching the timing of the other overlay handlers — is safe.
     */
    private accessibilityScan;
    creditCardUpdate(overlay: HTMLDivElement): void;
    amountLabelUpdate(overlay: HTMLDivElement): void;
    dialogAltsAndArias(overlay: HTMLDivElement): void;
    private preventDuplicateSubmits;
}
