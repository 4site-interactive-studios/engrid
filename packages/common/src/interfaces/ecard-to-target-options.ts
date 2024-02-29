export interface EcardToTargetOptions {
  targetName: string;
  targetEmail: string;
  hideSendDate: boolean;
  hideTarget: boolean;
  hideMessage: boolean;
  addSupporterNameToMessage: boolean;
}

export const EcardToTargetOptionsDefaults: EcardToTargetOptions = {
  targetName: "",
  targetEmail: "",
  hideSendDate: true,
  hideTarget: true,
  hideMessage: true,
  addSupporterNameToMessage: false,
};
