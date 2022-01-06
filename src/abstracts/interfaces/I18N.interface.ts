import { Locale } from '../types/I18N.types'

export interface I18N {
  currentLocale: Locale

  translate(path: string): string

  set locale(locale: Locale)

  get locale(): Locale
}
