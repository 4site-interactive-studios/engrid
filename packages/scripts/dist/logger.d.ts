/**
 * A better logger. It only works if debug is enabled.
 */
export declare class EngridLogger {
    prefix: string;
    color: string;
    background: string;
    emoji: string;
    constructor(prefix?: string, color?: string, background?: string, emoji?: string);
    get log(): Function;
    get success(): Function;
    get danger(): Function;
    get warn(): Function;
    get dir(): Function;
    get error(): Function;
}
