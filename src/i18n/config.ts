import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import enTranslations from "./locales/en_US.json";
import esTranslations from "./locales/es_ES.json";

i18n.use(initReactI18next).init({
  resources: {
    en_US: { translation: enTranslations },
    es_ES: { translation: esTranslations },
  },
  lng: "en_US",
  fallbackLng: "en_US",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
