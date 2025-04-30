export interface EcardToTargetOptions {
    targetName: string;
    targetEmail: string;
    hideSendDate: boolean;
    hideTarget: boolean;
    hideMessage: boolean;
    addSupporterNameToMessage: boolean;
    targets: {
        targetName: string;
        targetEmail: string;
    }[];
}
export declare const EcardToTargetOptionsDefaults: EcardToTargetOptions;
