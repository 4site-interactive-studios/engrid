import { SimpleEventDispatcher } from "strongly-typed-events";
import { ENGrid } from "../engrid";

export class Country {
  private _onCountryChange = new SimpleEventDispatcher<string>();
  private _country: string = "";
  private _field: HTMLElement | null = null;

  private static instance: Country;

  constructor() {
    // Run only if it is a Page with a Country field
    this._field = document.getElementById("en__field_supporter_country");
    if (!this._field) {
      return;
    }
    document.addEventListener("change", (e: Event) => {
      const element = e.target as HTMLInputElement;
      if (element && element.name == "supporter.country") {
        this.country = element.value;
      }
    });
    // Set the country to the current value on the field
    this.country = ENGrid.getFieldValue("supporter.country");
  }
  public static getInstance(): Country {
    if (!Country.instance) {
      Country.instance = new Country();
    }
    return Country.instance;
  }
  public get countryField(): HTMLElement | null {
    return this._field;
  }
  public get onCountryChange() {
    return this._onCountryChange.asEvent();
  }
  public get country(): string {
    return this._country;
  }
  // Every time we set a country, trigger the onCountryChange event
  public set country(value: string) {
    this._country = value;
    this._onCountryChange.dispatch(this._country);
  }
}
