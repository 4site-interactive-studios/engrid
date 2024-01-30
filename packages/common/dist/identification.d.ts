export interface EngridIdentData {
    type: string;
    payload: string;
}
export declare class Identification {
    private generateFP;
    private generateIP;
    private defaultFPRemoteURL;
    private _fp;
    private _ip;
    constructor(options: {
        enableFP?: boolean;
        enableIP?: boolean;
        generateFP?: Function;
        generateIP?: Function;
        defaultFPRemoteURL?: string;
    });
    dispatchEvent(type: string, value: string): void;
    createIframe(id: string, url: string): void;
}
