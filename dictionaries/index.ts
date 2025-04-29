import type { Locale } from "@/types/i18n"
import { dictionary as enDictionary } from "./en"
import { dictionary as ptDictionary } from "./pt"

const dictionaries = {
  en: enDictionary,
  pt: ptDictionary,
}

export const getDictionary = async (locale: Locale) => {
  return dictionaries[locale] as typeof dictionaries[keyof typeof dictionaries]
}
