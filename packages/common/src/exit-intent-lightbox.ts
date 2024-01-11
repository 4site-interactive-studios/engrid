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
      this.logger.log("Not enabled");
      return;
    }

    if (getCookie(this.options.cookieName)) {
      this.logger.log("Not showing - cookie found.");
      return;
    }

    const activeTriggers = Object.keys(this.options.triggers)
      .filter((t) => this.options.triggers[t])
      .join(", ");

    this.logger.log(
      "Enabled, waiting for trigger. Active triggers: " + activeTriggers
    );

    this.watchForTriggers();
  }

  private watchForTriggers() {
    window.addEventListener("load", () => {
      setTimeout(() => {
        if (this.options.triggers.mousePosition) {
          this.watchMouse();
        }

        if (this.options.triggers.visibilityState) {
          this.watchDocumentVisibility();
        }
      }, this.triggerDelay); // Delay activation of triggers
    });
  }

  private triggerDelay = 1000; // Don't run the exit intent lightbox until at least 1 second has passed after page load
  private triggerTimeout: number | null = null;

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
        this.logger.log("Triggered by mouse position");
        this.open();
      }

      if (!this.triggerTimeout) {
        this.triggerTimeout = window.setTimeout(() => {
          if (!from) {
            this.logger.log("Triggered by mouse position");
            this.open();
          }
          this.triggerTimeout = null;
        }, this.triggerDelay);
      }
    });
  }

  private watchDocumentVisibility() {
    const visibilityListener = () => {
      if (document.visibilityState === "hidden") {
        if (!this.triggerTimeout) {
          this.triggerTimeout = window.setTimeout(() => {
            this.logger.log("Triggered by visibilityState is hidden");
            this.open();
            document.removeEventListener(
              "visibilitychange",
              visibilityListener
            );
            this.triggerTimeout = null;
          }, this.triggerDelay);
        }
      }
    };

    document.addEventListener("visibilitychange", visibilityListener);
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
                <button type="button" class="ExitIntent__button">
                  ${this.options.buttonText}
                </button>
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
        this.dataLayer.push({ event: "exit_intent_lightbox_closed" });
        this.close();
      });

    document
      .querySelector(".ExitIntent__overlay")
      ?.addEventListener("click", (event) => {
        if (event.target === event.currentTarget) {
          this.dataLayer.push({ event: "exit_intent_lightbox_closed" });
          this.close();
        }
      });

    document
      .querySelector(".ExitIntent__button")
      ?.addEventListener("click", () => {
        this.dataLayer.push({ event: "exit_intent_lightbox_cta_clicked" });
        this.close();
        const target = this.options.buttonLink;
        if (target.startsWith(".") || target.startsWith("#")) {
          const targetEl = document.querySelector(target);
          if (targetEl) {
            targetEl.scrollIntoView({ behavior: "smooth" });
          }
        } else {
          window.open(target, "_blank");
        }
      });
  }

  private close() {
    document.querySelector(".ExitIntent")?.remove();
    ENGrid.setBodyData("exit-intent-lightbox", "closed");
  }
}
