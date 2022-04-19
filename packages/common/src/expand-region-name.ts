// Populates hidden supporter field "Region Long Format" with expanded name (e.g FL becomes Florida)

import { ENGrid } from "./";
import { EnForm } from "./events";

export class ExpandRegionName {
  public _form: EnForm = EnForm.getInstance();

  constructor() {
    if(this.shouldRun()) {
        this._form.onSubmit.subscribe(() => this.expandRegion());
    }
  }
  
  private shouldRun() {
    const region = document.querySelector('[name="supporter.NOT_TAGGED_132"]');
    return region !== null;
  }

  private expandRegion() {
    const userRegion: HTMLSelectElement | HTMLInputElement | null = document.querySelector('[name="supporter.region"]'); // User entered region on the page
    const hiddenRegion: HTMLInputElement | null = document.querySelector('[name="supporter.NOT_TAGGED_132"]'); // Hidden region long form field

    if(!userRegion) {
        if(ENGrid.debug) console.log("No region field to populate the hidden region field with");
        return; // Don't populate hidden region field if user region field isn't on page
    }

    if(userRegion.tagName === "SELECT" && "options" in userRegion && hiddenRegion) {
        const regionValue = userRegion.options[userRegion.selectedIndex].innerText;
        hiddenRegion.value = regionValue;

        if(ENGrid.debug) console.log("Populated 'Region Long Format' field", hiddenRegion.value);
    }

    else if(userRegion.tagName === "INPUT" && hiddenRegion) {
        const regionValue = userRegion.value;
        hiddenRegion.value = regionValue;
        
        if(ENGrid.debug) console.log("Populated 'Region Long Format' field", hiddenRegion.value);
    }

    return;
  }
}