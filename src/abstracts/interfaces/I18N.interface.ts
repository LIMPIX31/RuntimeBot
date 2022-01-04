import { Locale } from '../types/I18N.types'

export interface I18N {
  currentLocale: Locale

  translate(path: string): string

  setLocale(locale: Locale): void
}
