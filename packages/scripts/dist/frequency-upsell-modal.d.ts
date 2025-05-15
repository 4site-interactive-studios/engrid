import { FrequencyUpsellOptions, Modal } from ".";
export declare class FrequencyUpsellModal extends Modal {
    private readonly upsellOptions;
    private _amountWithFees;
    private _upsellAmountWithFees;
    constructor(upsellOptions: FrequencyUpsellOptions);
    set amountWithFees(value: number);
    set upsellAmountWithFees(value: number);
    updateModalContent(): void;
    getModalContent(): NodeListOf<Element> | HTMLElement | string;
    replaceAmountTokens(string: string): string;
}
