const ptbrTranslation = [
    { field: "supporter.firstName", translation: "Nome" },
    { field: "supporter.lastName", translation: "Sobrenome" },
    { field: "supporter.phoneNumber", translation: "Celular" },
    { field: "supporter.address1", translation: "Endereço" },
    { field: "supporter.address2", translation: "Complemento" },
    { field: "supporter.postcode", translation: "CEP" },
    { field: "supporter.city", translation: "Cidade" },
    { field: "supporter.region", translation: "Estado" },
    { field: "supporter.country", translation: "País" },
];
const deTranslation = [
    { field: "supporter.address1", translation: "Straße, Hausnummer" },
    { field: "supporter.postcode", translation: "Postleitzahl" },
    { field: "supporter.city", translation: "Ort" },
    { field: "supporter.region", translation: "Bundesland" },
    { field: "supporter.country", translation: "Land" },
];
const frTranslation = [
    { field: "supporter.address1", translation: "Adresse" },
    { field: "supporter.postcode", translation: "Code Postal" },
    { field: "supporter.city", translation: "Ville" },
    { field: "supporter.region", translation: "Région" },
    { field: "supporter.country", translation: "Country" },
];
const nlTranslation = [
    { field: "supporter.address1", translation: "Adres" },
    { field: "supporter.postcode", translation: "Postcode" },
    { field: "supporter.city", translation: "Woonplaats" },
    { field: "supporter.region", translation: "Provincie" },
    { field: "supporter.country", translation: "Country" },
];
// Page-language layer: keyed by lowercase 2-letter language code
// (see ENGrid.getPageLanguage()), applied as the base translation layer
// before any country-specific translations.
const esTranslation = [
    { field: "supporter.firstName", translation: "Nombre" },
    { field: "supporter.lastName", translation: "Apellidos" },
    { field: "supporter.emailAddress", translation: "Correo electrónico" },
    { field: "supporter.phoneNumber", translation: "Teléfono" },
    { field: "supporter.address1", translation: "Dirección" },
    { field: "supporter.address2", translation: "Complemento" },
    { field: "supporter.postcode", translation: "Código Postal" },
    { field: "supporter.city", translation: "Ciudad" },
    { field: "supporter.region", translation: "Provincia/Estado" },
    { field: "supporter.country", translation: "País" },
];
export const TranslateOptionsDefaults = {
    BR: ptbrTranslation,
    BRA: ptbrTranslation,
    DE: deTranslation,
    DEU: deTranslation,
    FR: frTranslation,
    FRA: frTranslation,
    NL: nlTranslation,
    NLD: nlTranslation,
    es: esTranslation,
};
