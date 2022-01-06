import { I18N } from '../i18n/I18N.class'
import { EnvConfig as IEnvConfig } from '../abstracts/interfaces/EnvConfig.interface'
import { DefaultEnv, ENV } from '../abstracts/types/EnvConfig.types'

class FakeEnvConfigForI18NTest implements IEnvConfig {
  defaults: DefaultEnv[] = []
  locale: string

  constructor(locale: string) {
    this.locale = locale
  }


  get(name: ENV | string, ifUndefined?: () => any): string | undefined {
    return this.locale
  }

  setDefaultFor<T>(name: ENV, defaultValue: T): void {
  }
}

const fakeRequire = (path: string) => {
  if (path === '../locales/non_NON.json') throw new Error()
  return {
    'existing.text': 'Существующий текст'
  }
}

describe('i18n', () => {
  it('i18n should translate existing text into an existing language', () => {
    const i18n = new I18N(new FakeEnvConfigForI18NTest('ru_RU'))
    expect(i18n.translate('existing.text', fakeRequire)).toEqual('Существующий текст')
  })
  it('i18n should translate non-existent text into an existing language', () => {
    const i18n = new I18N(new FakeEnvConfigForI18NTest('ru_RU'))
    expect(i18n.translate('non.exiting.text', fakeRequire)).toEqual('non.exiting.text')
  })
  it('i18n should translate existing text into an non-existent language', () => {
    const i18n = new I18N(new FakeEnvConfigForI18NTest('non_NON'))
    expect(i18n.translate('non.exiting.text', fakeRequire)).toEqual('non.exiting.text')
  })
  it('setLocale should work', () => {
    const i18n = new I18N(new FakeEnvConfigForI18NTest('en_US'))
    i18n.locale = 'ru_RU'
    expect(i18n.locale).toEqual('ru_RU')
  })
})
