/**
 * Singleton event hub for the Iframe Queue component.
 *
 * Mirrors the structure of RememberMeEvents: private constructor,
 * static `getInstance()`, internal dispatchers exposed via `.asEvent()`
 * getters, and `dispatch*` methods called by the IframeQueue class.
 *
 * External code subscribes to these events to react to queue
 * lifecycle without holding a reference to the IframeQueue itself.
 * The TNC Bequest Lightbox, for example, will subscribe to
 * `onChainComplete` so it only opens after the QCB opt-in chain has
 * finished submitting.
 *
 * @example
 *   IframeQueueEvents.getInstance().onChainComplete.subscribe(() => {
 *     openBequestLightbox();
 *   });
 */
import { IframeQueueItem, IframeQueueErrorPayload } from "../interfaces/iframe-queue-options";
export declare class IframeQueueEvents {
    private logger;
    private _onChainComplete;
    private _onChainError;
    private _onItemStart;
    private _onItemComplete;
    private _onItemError;
    private static instance;
    private constructor();
    /** Returns the shared IframeQueueEvents singleton. */
    static getInstance(): IframeQueueEvents;
    /**
     * Fires once when the entire queue completes successfully.
     * Use to trigger work that must wait for all chained iframe submits
     * (e.g. opening a bequest lightbox after QCB opt-ins are recorded).
     */
    get onChainComplete(): import("strongly-typed-events").ISignal;
    /**
     * Fires when the queue aborts due to an error (timeout, iframe load
     * error, or error message from an embedded page). Carries the failed
     * item (if known) and the underlying error.
     */
    get onChainError(): import("strongly-typed-events").ISimpleEvent<IframeQueueErrorPayload>;
    /** Fires immediately before an item begins processing. */
    get onItemStart(): import("strongly-typed-events").ISimpleEvent<IframeQueueItem>;
    /** Fires when an item completes (its iframe reached its Thank You page). */
    get onItemComplete(): import("strongly-typed-events").ISimpleEvent<IframeQueueItem>;
    /** Fires when an item fails. The queue aborts after this event. */
    get onItemError(): import("strongly-typed-events").ISimpleEvent<{
        item: IframeQueueItem;
        error: Error;
    }>;
    /** Internal — called by IframeQueue when the queue drains successfully. */
    dispatchChainComplete(): void;
    /** Internal — called by IframeQueue when the queue aborts on error. */
    dispatchChainError(payload: IframeQueueErrorPayload): void;
    /** Internal — called by IframeQueue immediately before an item starts. */
    dispatchItemStart(item: IframeQueueItem): void;
    /** Internal — called by IframeQueue when an item finishes successfully. */
    dispatchItemComplete(item: IframeQueueItem): void;
    /** Internal — called by IframeQueue when an item errors. */
    dispatchItemError(item: IframeQueueItem, error: Error): void;
}
