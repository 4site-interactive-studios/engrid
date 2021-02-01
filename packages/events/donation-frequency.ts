import { SimpleEventDispatcher } from "strongly-typed-events";

export default class DonationFrequency {
  private _onFrequencyChange = new SimpleEventDispatcher<string>();
  private _frequency: string = "single";
  private _radios: string = "";
  private static instance: DonationFrequency;

  private constructor(radios = "transaction.recurrpay") {
    this._radios = radios;
    // Watch the Radios for Changes
    document.addEventListener("change", (e: Event) => {
      const element = e.target as HTMLInputElement;
      if (element && element.name == radios) {
        this.frequency = element.value;
      }
    });
  }

  public static getInstance(radios = "transaction.recurrpay"): DonationFrequency {
    if (!DonationFrequency.instance) {
      DonationFrequency.instance = new DonationFrequency(radios);
    }

    return DonationFrequency.instance;
  }

  get frequency(): string {
    return this._frequency;
  }

  // Every time we set a frequency, trigger the onFrequencyChange event
  set frequency(value: string) {
    this._frequency = value == "Y" ? "monthly" : "single";
    this._onFrequencyChange.dispatch(this._frequency);
  }

  public get onFrequencyChange() {
    return this._onFrequencyChange.asEvent();
  }

  // Set amount var with currently selected amount
  public load() {
    const currentFrequencyField = document.querySelector(
      'input[name="' + this._radios + '"]:checked'
    ) as HTMLInputElement;
    if (currentFrequencyField && currentFrequencyField.value) {
      this.frequency = currentFrequencyField.value;
    }
  }
}
