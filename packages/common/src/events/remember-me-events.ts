/**
 * This class is responsible for managing events related to the "Remember Me" functionality.
 * It uses the Singleton design pattern to ensure only one instance of this class exists.
 * It provides methods for dispatching load and clear events, and getters for accessing these events.
 */

import { SignalDispatcher, SimpleEventDispatcher } from "strongly-typed-events";
import { EngridLogger } from "../";

export class RememberMeEvents {
  private logger: EngridLogger = new EngridLogger("RememberMeEvents");
  private _onLoad = new SimpleEventDispatcher<boolean>();
  private _onClear = new SignalDispatcher();
  public hasData: boolean = false;

  private static instance: RememberMeEvents;

  private constructor() {}

  public static getInstance(): RememberMeEvents {
    if (!RememberMeEvents.instance) {
      RememberMeEvents.instance = new RememberMeEvents();
    }

    return RememberMeEvents.instance;
  }

  public dispatchLoad(hasData: boolean) {
    this.hasData = hasData;
    this._onLoad.dispatch(hasData);
    this.logger.log(`dispatchLoad: ${hasData}`);
  }

  public dispatchClear() {
    this._onClear.dispatch();
    this.logger.log("dispatchClear");
  }

  public get onLoad() {
    return this._onLoad.asEvent();
  }

  public get onClear() {
    return this._onClear.asEvent();
  }
}
