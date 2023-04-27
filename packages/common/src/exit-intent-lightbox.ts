import {
  ENGrid,
  EngridLogger,
  ExitIntentOptions,
  ExitIntentOptionsDefaults,
} from "./";
import { get as getCookie, set as setCookie } from "./cookie";

export class ExitIntentLightbox {
  private options: ExitIntentOptions;
  private opened: boolean = false;
  private dataLayer = (window as any).dataLayer || [];

  private logger: EngridLogger = new EngridLogger(
    "ExitIntentLightbox",
    "yellow",
    "black",
    "🚪"
  );

  constructor() {
    let options = "EngridExitIntent" in window ? window.EngridExitIntent : {};
    this.options = { ...ExitIntentOptionsDefaults, ...options };

    if (!this.options.enabled) {
      this.logger.log("ExitIntentLightbox not enabled");
      return;
    }

    if (getCookie(this.options.cookieName)) {
      this.logger.log("ExitIntentLightbox not showing - cookie found.");
      return;
    }

    this.logger.log("ExitIntentLightbox enabled, waiting for trigger..");

    this.watchForTrigger();
  }

  private watchForTrigger() {
    this.watchMouse();
  }

  private watchMouse() {
    document.addEventListener("mouseout", (e: MouseEvent) => {
      // If this is an autocomplete element.
      if ((e.target as HTMLElement).tagName.toLowerCase() == "input") return;

      // Get the current viewport width.
      const vpWidth = Math.max(
        document.documentElement.clientWidth,
        window.innerWidth || 0
      );

      // If the current mouse X position is within 50px of the right edge
      // of the viewport, return.
      if (e.clientX >= vpWidth - 50) return;

      // If the current mouse Y position is not within 50px of the top
      // edge of the viewport, return.
      if (e.clientY >= 50) return;

      // Reliable, works on mouse exiting window and
      // user switching active program
      const from = e.relatedTarget;

      if (!from) {
        this.logger.log("ExitIntentLightbox triggered by mouse position");
        this.open();
      }
    });
  }

  private open() {
    if (this.opened) return;

    ENGrid.setBodyData("exit-intent-lightbox", "open");

    setCookie(this.options.cookieName, "1", {
      expires: this.options.cookieDuration,
    });

    document.body.insertAdjacentHTML(
      "beforeend",
      `
        <div class="ExitIntent">
          <div class="ExitIntent__overlay">
            <div class="ExitIntent__container">
              <div class="ExitIntent__close">X</div>
              <div class="ExitIntent__body">
                <h2>${this.options.title}</h2>
                <p>${this.options.text}</p>
                <a class="ExitIntent__button" href="${this.options.buttonLink}">
                  ${this.options.buttonText}
                </a>
              </div>
            </div>
          </div>
        </div>
      `
    );

    this.opened = true;
    this.dataLayer.push({ event: "exit_intent_lightbox_shown" });

    document
      .querySelector(".ExitIntent__close")
      ?.addEventListener("click", () => {
        document.querySelector(".ExitIntent")?.remove();
        ENGrid.setBodyData("exit-intent-lightbox", "closed");
        this.dataLayer.push({ event: "exit_intent_lightbox_closed" });
      });

    document
      .querySelector(".ExitIntent__overlay")
      ?.addEventListener("click", (event) => {
        if (event.target === event.currentTarget) {
          document.querySelector(".ExitIntent")?.remove();
          ENGrid.setBodyData("exit-intent-lightbox", "closed");
          this.dataLayer.push({ event: "exit_intent_lightbox_closed" });
        }
      });
  }
}
