import { EnForm } from "./events";
export declare class NeverBounce {
    private apiKey;
    dateField: string | null;
    statusField: string | null;
    form: EnForm;
    emailField: HTMLInputElement | null;
    emailWrapper: HTMLDivElement;
    nbDate: HTMLInputElement | null;
    nbStatus: HTMLInputElement | null;
    constructor(apiKey: string, dateField?: string | null, statusField?: string | null);
    private init;
    private clearStatus;
    private deleteENFieldError;
    private setEmailStatus;
    private insertAfter;
    private insertBefore;
    private wrap;
    private validate;
}
