export interface EmbeddedEcardOptions {
  pageUrl: string;
  headerText: string;
  checkboxText: string;
  anchor: string;
  placement: string;
}

export const EmbeddedEcardOptionsDefaults: EmbeddedEcardOptions = {
  pageUrl: "",
  headerText: "Send an Ecard notification of your gift",
  checkboxText: "Yes, I would like to send an ecard to announce my gift.",
  anchor: ".en__field--donationAmt",
  placement: "afterend",
};
