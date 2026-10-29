import { ENGrid, EngridLogger } from ".";
import { Options } from "./interfaces/options";

type TidyContactEmailOptions = Exclude<
  Options["TidyContactEmail"],
  false | undefined
>;

// Same selector the TC Email bundle uses to find its own tag (script-config.ts)
const TC_EMAIL_SCRIPT =
  "script[src*='raisemore-email'], script[data-raisemore-email]";
const DEFAULT_RELAY_URL = "https://email-validator.4sitestudios.com";
const DEFAULT_VERSION = "v1";

export class TidyContactEmail {
  private logger: EngridLogger = new EngridLogger(
    "TidyContactEmail",
    "#FFFFFF",
    "#4d9068",
    "📧"
  );
  private options: TidyContactEmailOptions | null = null;

  constructor() {
    const options = ENGrid.getOption(
      "TidyContactEmail"
    ) as Options["TidyContactEmail"];
    if (!options) return;
    this.options = options;
    if (!this.shouldRun()) return;
    this.loadScript();
  }

  private shouldRun(): boolean {
    if (!this.options?.clientKey) {
      this.logger.danger("clientKey not set. TidyContact Email will not load.");
      return false;
    }
    const searchParams = new URLSearchParams(window.location.search);
    if (searchParams.has("bypassemailvalidation")) {
      this.logger.log(
        "Bypass Email Validation Enabled - not loading TidyContact Email"
      );
      return false;
    }
    const pageTypes = this.options.pageTypes ?? [];
    if (
      pageTypes.length > 0 &&
      pageTypes.indexOf(ENGrid.getPageType()) === -1
    ) {
      this.logger.log("TidyContact Email is disabled on this page type");
      return false;
    }
    if (!ENGrid.getField("supporter.emailAddress")) {
      this.logger.log("E-mail Field Not Found");
      return false;
    }
    if (
      ENGrid.getOption("NeverBounceAPI") ||
      ENGrid.getOption("FreshAddress")
    ) {
      this.logger.danger(
        "NeverBounce or FreshAddress is also enabled. Two email validators on one field is not supported, so TidyContact Email will not load."
      );
      return false;
    }
    if (document.querySelector(TC_EMAIL_SCRIPT)) {
      this.logger.log(
        "TidyContact Email script already on the page (manual install). Not loading it again."
      );
      return false;
    }
    return true;
  }

  private loadScript() {
    const options = this.options as TidyContactEmailOptions;
    const relayUrl = (options.relayUrl || DEFAULT_RELAY_URL).replace(
      /\/+$/,
      ""
    );
    const script = document.createElement("script");
    script.src =
      options.scriptUrl ||
      `${relayUrl}/embed/engrid/${
        options.version || DEFAULT_VERSION
      }/raisemore-email.js`;
    script.setAttribute("data-raisemore-email", "");
    script.setAttribute("data-relay-url", relayUrl);
    script.setAttribute("data-client-key", options.clientKey);
    // Only what the client set; everything else keeps TC Email's own defaults
    const optional: [string, number | boolean | undefined][] = [
      ["timeout-ms", options.timeoutMs],
      ["hard-block", options.hardBlock],
      ["prefill-skip", options.prefillSkip],
      ["en-recognition", options.enRecognition],
    ];
    optional.forEach(([name, value]) => {
      if (value !== undefined && value !== null) {
        script.setAttribute(`data-${name}`, String(value));
      }
    });
    script.onload = () => {
      ENGrid.setBodyData("tidycontact-email", "loaded");
      this.logger.success(`Loaded ${script.src}`);
    };
    script.onerror = () => {
      ENGrid.setBodyData("tidycontact-email", "error");
      this.logger.danger(
        `Could not load ${script.src}. The form keeps working without email validation.`
      );
    };
    ENGrid.setBodyData("tidycontact-email", "loading");
    document.body.appendChild(script);
  }
}
