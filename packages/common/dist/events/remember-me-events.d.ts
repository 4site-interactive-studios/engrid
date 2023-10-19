/**
 * This class is responsible for managing events related to the "Remember Me" functionality.
 * It uses the Singleton design pattern to ensure only one instance of this class exists.
 * It provides methods for dispatching load and clear events, and getters for accessing these events.
 */
export declare class RememberMeEvents {
    private logger;
    private _onLoad;
    private _onClear;
    hasData: boolean;
    private static instance;
    private constructor();
    static getInstance(): RememberMeEvents;
    dispatchLoad(hasData: boolean): void;
    dispatchClear(): void;
    get onLoad(): import("strongly-typed-events").ISimpleEvent<boolean>;
    get onClear(): import("strongly-typed-events").ISignal;
}
