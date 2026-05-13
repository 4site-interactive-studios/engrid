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
import { SignalDispatcher, SimpleEventDispatcher } from "strongly-typed-events";
import { EngridLogger } from "..";
export class IframeQueueEvents {
    constructor() {
        this.logger = new EngridLogger("IframeQueueEvents", "white", "#1f6feb", "🚂");
        this._onChainComplete = new SignalDispatcher();
        this._onChainError = new SimpleEventDispatcher();
        this._onItemStart = new SimpleEventDispatcher();
        this._onItemComplete = new SimpleEventDispatcher();
        this._onItemError = new SimpleEventDispatcher();
    }
    /** Returns the shared IframeQueueEvents singleton. */
    static getInstance() {
        if (!IframeQueueEvents.instance) {
            IframeQueueEvents.instance = new IframeQueueEvents();
        }
        return IframeQueueEvents.instance;
    }
    /**
     * Fires once when the entire queue completes successfully.
     * Use to trigger work that must wait for all chained iframe submits
     * (e.g. opening a bequest lightbox after QCB opt-ins are recorded).
     */
    get onChainComplete() {
        return this._onChainComplete.asEvent();
    }
    /**
     * Fires when the queue aborts due to an error (timeout, iframe load
     * error, or error message from an embedded page). Carries the failed
     * item (if known) and the underlying error.
     */
    get onChainError() {
        return this._onChainError.asEvent();
    }
    /** Fires immediately before an item begins processing. */
    get onItemStart() {
        return this._onItemStart.asEvent();
    }
    /** Fires when an item completes (its iframe reached its Thank You page). */
    get onItemComplete() {
        return this._onItemComplete.asEvent();
    }
    /** Fires when an item fails. The queue aborts after this event. */
    get onItemError() {
        return this._onItemError.asEvent();
    }
    /** Internal — called by IframeQueue when the queue drains successfully. */
    dispatchChainComplete() {
        this.logger.log("dispatchChainComplete");
        this._onChainComplete.dispatch();
    }
    /** Internal — called by IframeQueue when the queue aborts on error. */
    dispatchChainError(payload) {
        this.logger.log(`dispatchChainError: ${payload.message}`);
        this._onChainError.dispatch(payload);
    }
    /** Internal — called by IframeQueue immediately before an item starts. */
    dispatchItemStart(item) {
        this.logger.log(`dispatchItemStart: ${item.url}`);
        this._onItemStart.dispatch(item);
    }
    /** Internal — called by IframeQueue when an item finishes successfully. */
    dispatchItemComplete(item) {
        this.logger.log(`dispatchItemComplete: ${item.url}`);
        this._onItemComplete.dispatch(item);
    }
    /** Internal — called by IframeQueue when an item errors. */
    dispatchItemError(item, error) {
        this.logger.log(`dispatchItemError: ${item.url} - ${error.message}`);
        this._onItemError.dispatch({ item, error });
    }
}
