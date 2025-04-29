import type { Locale } from "@/types/i18n"
import { dictionary as enDictionary } from "./en"
import { dictionary as ptDictionary } from "./pt"

const dictionaries = {
  en: enDictionary,
  pt: ptDictionary,
}

export const getDictionary = (locale: Locale) => {
  return dictionaries[locale]
}
