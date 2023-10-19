/**
 * This class is responsible for managing events related to the "Remember Me" functionality.
 * It uses the Singleton design pattern to ensure only one instance of this class exists.
 * It provides methods for dispatching load and clear events, and getters for accessing these events.
 */
import { SignalDispatcher, SimpleEventDispatcher } from "strongly-typed-events";
import { EngridLogger } from "../";
export class RememberMeEvents {
    constructor() {
        this.logger = new EngridLogger("RememberMeEvents");
        this._onLoad = new SimpleEventDispatcher();
        this._onClear = new SignalDispatcher();
        this.hasData = false;
    }
    static getInstance() {
        if (!RememberMeEvents.instance) {
            RememberMeEvents.instance = new RememberMeEvents();
        }
        return RememberMeEvents.instance;
    }
    dispatchLoad(hasData) {
        this.hasData = hasData;
        this._onLoad.dispatch(hasData);
        this.logger.log(`dispatchLoad: ${hasData}`);
    }
    dispatchClear() {
        this._onClear.dispatch();
        this.logger.log("dispatchClear");
    }
    get onLoad() {
        return this._onLoad.asEvent();
    }
    get onClear() {
        return this._onClear.asEvent();
    }
}
