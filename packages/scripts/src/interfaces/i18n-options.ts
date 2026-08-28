// i18n dictionary for engrid-scripts UI strings.
// Keys are flat, dot-notation. Language buckets are keyed by the 2-letter
// page language (see ENGrid.getPageLanguage()). Clients can override or extend
// any string via the window.EngridI18n global, which is merged over these
// defaults key-by-key, per language.
export interface I18nOptions {
  [lang: string]: { [key: string]: string };
}
export const I18nDefaults: I18nOptions = {
  en: {
    "rememberMe.label": "Remember Me",
    "rememberMe.clearLabel": "(clear autofill)",
    "rememberMe.tooltip":
      "Check “{label}” to complete forms on this device faster. While your financial information won’t be stored, you should only check this box from a personal device. Click “{clearLabel}” to remove the information from your device at any time.",
    "rememberMe.iframeTitle": "Remember Me iframe",
    "translateFields.state": "State",
    "translateFields.stateGeneric": "Province / State",
    "translateFields.stateRegion": "State/Region",
    "translateFields.provinceTerritory": "Province / Territory",
    "translateFields.selectState": "Select State",
    "translateFields.select": "Select",
    "translateFields.recipientTo": "To:",
    "a11y.errorSummary": "There are {count} errors: {messages}.",
    // InputPlaceholders component defaults
    "placeholders.firstName": "First Name",
    "placeholders.lastName": "Last Name",
    "placeholders.emailAddress": "Email Address",
    "placeholders.phoneNumber": "Phone Number",
    "placeholders.phoneNumberOptional": "Phone Number (Optional)",
    "placeholders.country": "Country",
    "placeholders.address1": "Street Address",
    "placeholders.address2": "Apt., Ste., Bldg.",
    "placeholders.city": "City",
    "placeholders.region": "Region",
    "placeholders.postcode": "ZIP Code",
  },
  es: {
    "rememberMe.label": "Recuérdame",
    "rememberMe.clearLabel": "(borrar autocompletado)",
    "rememberMe.tooltip":
      "Marque “{label}” para completar los formularios en este dispositivo más rápido. Aunque su información financiera no se almacenará, solo debe marcar esta casilla desde un dispositivo personal. Haga clic en “{clearLabel}” para eliminar la información de su dispositivo en cualquier momento.",
    "rememberMe.iframeTitle": "iframe de Recuérdame",
    "translateFields.state": "Estado",
    "translateFields.stateGeneric": "Provincia/Estado",
    "translateFields.stateRegion": "Estado/Región",
    "translateFields.provinceTerritory": "Provincia/Territorio",
    "translateFields.selectState": "Seleccione Estado",
    "translateFields.select": "Seleccione",
    "translateFields.recipientTo": "Para:",
    "a11y.errorSummary": "Hay {count} errores: {messages}.",
    // InputPlaceholders component defaults
    "placeholders.firstName": "Nombre",
    "placeholders.lastName": "Apellidos",
    "placeholders.emailAddress": "Correo electrónico",
    "placeholders.phoneNumber": "Teléfono",
    "placeholders.phoneNumberOptional": "Teléfono (opcional)",
    "placeholders.country": "País",
    "placeholders.address1": "Calle y número",
    "placeholders.address2": "Depto., Piso, Edif.",
    "placeholders.city": "Ciudad",
    "placeholders.region": "Provincia/Estado",
    "placeholders.postcode": "Código Postal",
  },
};
