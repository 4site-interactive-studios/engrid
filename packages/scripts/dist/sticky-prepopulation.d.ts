export declare class StickyPrepopulation {
    private logger;
    private options;
    private cookieName;
    constructor();
    private shouldRun;
    private deleteCookieIfGiftProcessComplete;
    private createCookie;
    private applyPrepopulation;
    private getSupporterDetailsFromFields;
    private encryptSupporterDetails;
    private decryptSupporterDetails;
    private createEncryptionKey;
    private arrayBufferToBase64;
    private base64ToArrayBuffer;
    private getSeed;
}
