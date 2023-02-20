import { EnForm } from "./events";
export declare class NeverBounce {
    private apiKey;
    dateField: string | null;
    statusField: string | null;
    dateFormat: string | undefined;
    form: EnForm;
    emailField: HTMLInputElement | null;
    emailWrapper: HTMLDivElement;
    nbDate: HTMLInputElement | null;
    nbStatus: HTMLInputElement | null;
    private logger;
    private shouldRun;
    private nbLoaded;
    constructor(apiKey: string, dateField: string | null, statusField: string | null, dateFormat: string | undefined);
    private init;
    private clearStatus;
    private deleteENFieldError;
    private setEmailStatus;
    private insertAfter;
    private wrap;
    private validate;
}
