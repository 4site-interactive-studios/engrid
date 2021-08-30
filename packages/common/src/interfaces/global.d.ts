import { Options } from "./options";
import { UpsellLightboxOptions } from "./upsell-lightbox-options";
import { UpsellPseudoSelectorOptions } from "./upsell-pseudoselector-options";

export { }; // this file needs to be a module
declare global {
    interface Window {
        pageJson: any;
        enOnSubmit: any;
        enOnError: any;
        enOnValidate: any;
        EngagingNetworks: any;
        EngridAmounts: any;
        EngridOptions: Options,
        EngridUpsell: UpsellLightboxOptions,
        EngridPseudoSelectorUpsell: UpsellPseudoSelectorOptions,
        _NBSettings: object,
        _nb: any
    }
}