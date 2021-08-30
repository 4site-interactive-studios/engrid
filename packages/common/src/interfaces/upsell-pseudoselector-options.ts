export interface UpsellPseudoSelectorOptions {
    upsellOriginalGiftAmountFieldName: string,
    pseudoSelectorFieldName: string,
    label: string,
    siblingFieldSelector: string,
    siblingFieldInsertPosition: string
}

export const UpsellPseudoSelectorOptionsDefaults: UpsellPseudoSelectorOptions = {
    upsellOriginalGiftAmountFieldName: '',
    pseudoSelectorFieldName: '',
    label: '',
    siblingFieldSelector: '',
    siblingFieldInsertPosition: 'after'
}