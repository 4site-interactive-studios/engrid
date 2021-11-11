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
    EngridUpsell: UpsellOptions;
    EngridTranslate: TranslateOptions;
    EngridLoader: {
      "repo-name"?: string;
      "repo-owner"?: string;
      assets?: string;
      "en-assets-url"?: string;
    };
    _NBSettings: object;
    _nb: any;
  }
}
