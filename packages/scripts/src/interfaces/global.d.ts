import { TranslateOptions } from "./translate-options";
import { Options } from "./options";
import { UpsellOptions } from "./upsell-options";
import { ExitIntentOptions } from "./exit-intent-options";
import { EcardToTargetOptions } from "./ecard-to-target-options";
import { EmbeddedEcardOptions } from "./embedded-ecard-options";
import { FrequencyUpsellConfig } from "./frequency-upsell-options";

export {}; // this file needs to be a module
declare global {
  interface Window {
    pageJson: any;
    enOnSubmit: any;
    enOnError: any;
    enOnValidate: any;
    EngagingNetworks: any;
    EngridAmounts: any;
    EngridOptions: Options;
    EngridPageOptions: Options;
    EngridUpsell: UpsellOptions;
    EngridExitIntent: ExitIntentOptions;
    EngridTranslate: TranslateOptions;
    EngridEcardToTarget: EcardToTargetOptions;
    EngridEmbeddedEcard: EmbeddedEcardOptions;
    EngridFrequencyUpsell: FrequencyUpsellConfig;
    EngridVersion: string;
    EngridLoader: {
      "repo-name"?: string;
      "repo-owner"?: string;
      assets?: string;
      engridcss?: string;
      engridjs?: string;
    };
    _NBSettings: object;
    _nb: any;
    FreshAddress: any;
    FreshAddressStatus: string;
    enVGSFields: any;
    mobileCTAButtonLabel: string;
  }
}
