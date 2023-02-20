import { TranslateOptions } from "./translate-options";
import { Options } from "./options";
import { UpsellOptions } from "./upsell-options";

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
    EngridTranslate: TranslateOptions;
    EngridVersion: string;
    EngridLoader: {
      "repo-name"?: string;
      "repo-owner"?: string;
      assets?: string;
    };
    _NBSettings: object;
    _nb: any;
  }
}
