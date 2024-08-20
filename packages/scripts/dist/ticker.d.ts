export declare class Ticker {
    private shuffleSeed;
    private items;
    private tickerElement;
    private logger;
    constructor();
    shouldRun(): boolean;
    getSeed(): any;
    getItems(): any;
    render(): void;
}
