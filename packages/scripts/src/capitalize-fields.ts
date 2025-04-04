// CapitalizeFields is a class that capitalizes the first letter of the fields passed to it.
// It subscribes to the onSubmit event of the EnForm class and capitalizes the fields on submit.

import { ENGrid } from ".";
import { EnForm } from "./events";

export class CapitalizeFields {
  public _form: EnForm = EnForm.getInstance();

  constructor() {
    this._form.onSubmit.subscribe(() =>
      this.capitalizeFields(
        "en__field_supporter_firstName",
        "en__field_supporter_lastName",
        "en__field_supporter_address1",
        "en__field_supporter_city"
      )
    );
  }

  private capitalizeFields(...fields: string[]) {
    fields.forEach((f) => this.capitalize(f));
  }

  private capitalize(f: string) {
    let field: HTMLInputElement = document.getElementById(
      f
    ) as HTMLInputElement;
    if (field) {
      field.value = field.value.replace(/\w\S*/g, (w) =>
        w.replace(/^\w/, (c) => c.toUpperCase())
      );
      if (ENGrid.debug) console.log("Capitalized", field.value);
    }
    return true;
  }
}
