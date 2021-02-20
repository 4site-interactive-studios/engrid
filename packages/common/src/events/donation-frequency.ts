import { SimpleEventDispatcher } from "strongly-typed-events";
import { ENGrid } from "../engrid";

export class DonationFrequency extends ENGrid {
  private _onFrequencyChange = new SimpleEventDispatcher<string>();
  private _frequency: string = "once";
  private _recurring: string = "n";
  private static instance: DonationFrequency;

  private constructor() {
    super();
    // Watch the Radios for Changes
    document.addEventListener("change", (e: Event) => {
      const element = e.target as HTMLInputElement;
      if (element && element.name == "transaction.recurrpay") {
        this.recurring = element.value;
        // When this element is a radio, that means you're between once and monthly only
        if (element.type == 'radio') {
          this.frequency = element.value.toLowerCase() == 'n' ? 'once' : 'monthly';
          // This field is hidden when transaction.recurrpay is radio
          this.setFieldValue('transaction.recurrfreq', this.frequency.toUpperCase());
        }
      }
      if (element && element.name == "transaction.recurrfreq") {
        this.frequency = element.value;
      }
    });
  }

  public static getInstance(): DonationFrequency {
    if (!DonationFrequency.instance) {
      DonationFrequency.instance = new DonationFrequency();
    }

    return DonationFrequency.instance;
  }

  get frequency(): string {
    return this._frequency;
  }

  // Every time we set a frequency, trigger the onFrequencyChange event
  set frequency(value: string) {
    this._frequency = value.toLowerCase() || 'once';
    this._onFrequencyChange.dispatch(this._frequency);
    this.setBodyData('transaction-recurring-frequency', this._frequency);
  }

  get recurring(): string {
    return this._recurring;
  }

  set recurring(value: string) {
    this._recurring = value.toLowerCase() || 'n';
    this.setBodyData('transaction-recurring', this._recurring);
  }

  public get onFrequencyChange() {
    return this._onFrequencyChange.asEvent();
  }

  // Set amount var with currently selected amount
  public load() {
    this.frequency = this.getFieldValue('transaction.recurrfreq');
    this.recurring = this.getFieldValue('transaction.recurrpay');
  }
}
