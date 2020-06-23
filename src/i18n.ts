import english from "./i18n/english.json5"
import russian from "./i18n/russian.json5"

import i18next from "i18next"
import { initReactI18next } from "react-i18next"

i18next
  .use(initReactI18next)
  .init({
    lng: "ru",
    debug: process.env.NODE_ENV === "development",
    resources: {
      en: english,
      ru: russian,
    }
  })
