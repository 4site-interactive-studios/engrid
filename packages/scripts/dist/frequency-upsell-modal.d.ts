import { FrequencyUpsellOptions, Modal } from ".";
export declare class FrequencyUpsellModal extends Modal {
    private readonly upsellOptions;
    private _amount;
    private _upsellAmount;
    constructor(upsellOptions: FrequencyUpsellOptions);
    set amount(value: number);
    set upsellAmount(value: number);
    updateModalContent(): void;
    getModalContent(): NodeListOf<Element> | HTMLElement | string;
    replaceAmountTokens(string: string): string;
}
