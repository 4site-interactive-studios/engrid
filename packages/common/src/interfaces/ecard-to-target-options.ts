export interface EcardToTargetOptions {
  targetName: string;
  targetEmail: string;
  hideEcardSendDate: boolean;
  hideTarget: boolean;
  hideMessage: boolean;
  addSupporterNameToMessage: boolean;
}

export const EcardToTargetOptionsDefaults: EcardToTargetOptions = {
  targetName: "",
  targetEmail: "",
  hideEcardSendDate: true,
  hideTarget: true,
  hideMessage: true,
  addSupporterNameToMessage: false,
};
