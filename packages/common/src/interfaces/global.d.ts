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
    _NBSettings: object;
    _nb: any;
  }
}
