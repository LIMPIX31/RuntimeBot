import { I18N as II18N } from '../abstracts/interfaces/I18N.interface'
import { inject, injectable } from 'inversify'
import 'reflect-metadata'
import { Locale } from '../abstracts/types/I18N.types'
import { EnvConfig } from '../abstracts/interfaces/EnvConfig.interface'
import { TYPES } from '../IoC/types'
import { ENV } from '../abstracts/types/EnvConfig.types'
import { TemplateMessage } from '../utils/TemplateMessage.class'
import { Logger } from '../utils/Logger'

@injectable()
export class I18N implements II18N {
  currentLocale: Locale

  constructor(@inject(TYPES.EnvConfig) env: EnvConfig) {
    this.currentLocale = env.get(ENV.LOCALE, () => {
      Logger.warn(TemplateMessage.envNotDefined(ENV.LOCALE))
    }) as Locale
  }

  setLocale(locale: Locale): void {
    this.currentLocale = locale
  }

  translate(path: string): string {
    const translated = require(`../locales/${this.currentLocale}.json`)[path]
    return translated ? translated : path
  }

}
