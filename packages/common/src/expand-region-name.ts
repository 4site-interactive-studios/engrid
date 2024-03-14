// Populates hidden supporter field "Region Long Format" with expanded name (e.g FL becomes Florida)

import { ENGrid, EngridLogger } from "./";
import { EnForm } from "./events";

export class ExpandRegionName {
  private _form: EnForm = EnForm.getInstance();
  private logger: EngridLogger = new EngridLogger(
    "ExpandRegionName",
    "#333333",
    "#00eb65",
    "🌍"
  );

  constructor() {
    if (this.shouldRun()) {
      const expandedRegionField = ENGrid.getOption(
        "RegionLongFormat"
      ) as string;
      console.log("expandedRegionField", expandedRegionField);
      const hiddenRegion = document.querySelector(
        `[name="${expandedRegionField}"]`
      );
      if (!hiddenRegion) {
        this.logger.log(`CREATED field ${expandedRegionField}`);
        ENGrid.createHiddenInput(expandedRegionField);
      }

      this._form.onValidate.subscribe(() => this.expandRegion());
    }
  }

  private shouldRun() {
    return !!ENGrid.getOption("RegionLongFormat");
  }

  private expandRegion() {
    if (!this._form.validate) return;
    const userRegion: HTMLSelectElement | HTMLInputElement | null =
      document.querySelector('[name="supporter.region"]'); // User entered region on the page
    const expandedRegionField = ENGrid.getOption("RegionLongFormat") as string;
    const hiddenRegion = document.querySelector(
      `[name="${expandedRegionField}"]`
    ) as HTMLInputElement; // Hidden region long form field

    if (!userRegion) {
      this.logger.log(
        "No region field to populate the hidden region field with"
      );
      return; // Don't populate hidden region field if user region field isn't on page
    }

    if (userRegion.tagName === "SELECT" && "options" in userRegion) {
      const regionValue =
        userRegion.options[userRegion.selectedIndex].innerText;
      hiddenRegion.value = regionValue;

      this.logger.log("Populated field", hiddenRegion.value);
    } else if (userRegion.tagName === "INPUT") {
      const regionValue = userRegion.value;
      hiddenRegion.value = regionValue;

      this.logger.log("Populated field", hiddenRegion.value);
    }
    return true;
  }
}
