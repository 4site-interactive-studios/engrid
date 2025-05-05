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

export const EcardToTargetOptionsDefaults: EcardToTargetOptions = {
  targetName: "",
  targetEmail: "",
  hideSendDate: true,
  hideTarget: true,
  hideMessage: true,
  addSupporterNameToMessage: false,
  targets: [],
};
