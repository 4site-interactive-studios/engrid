import { ENGrid } from ".";
/**
 * A better logger. It only works if debug is enabled.
 */
export class EngridLogger {
  public prefix = "";
  public color = "black";
  public background = "white";
  public emoji = "";

  constructor(
    prefix?: string,
    color?: string,
    background?: string,
    emoji?: string
  ) {
    if (emoji) {
      this.emoji = emoji;
    } else {
      switch (color) {
        case "red":
          this.emoji = "🔴";
          break;
        case "green":
          this.emoji = "🟢";
          break;
        case "blue":
          this.emoji = "🔵";
          break;
        case "yellow":
          this.emoji = "🟡";
          this.background = "black";
          break;
        case "purple":
          this.emoji = "🟣";
          break;
        case "black":
        default:
          this.emoji = "⚫";
          break;
      }
    }
    if (prefix) {
      this.prefix = `[ENgrid ${prefix}]`;
    }
    if (color) {
      this.color = color;
    }
    if (background) {
      this.background = background;
    }
  }

  get log(): Function {
    if (!ENGrid.debug && ENGrid.getUrlParameter("debug") !== "log") {
      return () => {};
    }
    return console.log.bind(
      window.console,
      "%c" + this.emoji + " " + this.prefix + " %s",
      `color: ${this.color}; background-color: ${this.background}; font-size: 1.2em; padding: 4px; border-radius: 2px; font-family: monospace;`
    );
  }
  get success(): Function {
    if (!ENGrid.debug) {
      return () => {};
    }
    return console.log.bind(
      window.console,
      "%c ✅ " + this.prefix + " %s",
      `color: green; background-color: white; font-size: 1.2em; padding: 4px; border-radius: 2px; font-family: monospace;`
    );
  }
  get danger(): Function {
    if (!ENGrid.debug) {
      return () => {};
    }
    return console.log.bind(
      window.console,
      "%c ⛔️ " + this.prefix + " %s",
      `color: red; background-color: white; font-size: 1.2em; padding: 4px; border-radius: 2px; font-family: monospace;`
    );
  }

  get warn(): Function {
    if (!ENGrid.debug) {
      return () => {};
    }
    return console.warn.bind(
      window.console,
      "%c" + this.emoji + " " + this.prefix + " %s",
      `color: ${this.color}; background-color: ${this.background}; font-size: 1.2em; padding: 4px; border-radius: 2px; font-family: monospace;`
    );
  }

  get dir(): Function {
    if (!ENGrid.debug) {
      return () => {};
    }
    return console.dir.bind(
      window.console,
      "%c" + this.emoji + " " + this.prefix + " %s",
      `color: ${this.color}; background-color: ${this.background}; font-size: 1.2em; padding: 4px; border-radius: 2px; font-family: monospace;`
    );
  }

  get error(): Function {
    if (!ENGrid.debug) {
      return () => {};
    }
    return console.error.bind(
      window.console,
      "%c" + this.emoji + " " + this.prefix + " %s",
      `color: ${this.color}; background-color: ${this.background}; font-size: 1.2em; padding: 4px; border-radius: 2px; font-family: monospace;`
    );
  }
}
