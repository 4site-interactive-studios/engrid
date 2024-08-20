export interface ExitIntentOptions {
    enabled: boolean;
    title: string;
    text: string;
    buttonText: string;
    buttonLink: string;
    cookieName: string;
    cookieDuration: number;
    triggers: {
        [key: string]: boolean;
    };
}
export declare const ExitIntentOptionsDefaults: ExitIntentOptions;
