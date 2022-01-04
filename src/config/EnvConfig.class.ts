import { EnvConfig as IEnvConfig } from '../abstracts/interfaces/EnvConfig.interface'
import { injectable } from 'inversify'
import { config } from 'dotenv'
import { DefaultEnv, ENV } from '../abstracts/types/EnvConfig.types'
import 'reflect-metadata'

@injectable()
export class EnvConfig implements IEnvConfig {
  defaults: DefaultEnv[] = []

  constructor() {
    config()
  }

  get(name: ENV | string, ifUndefined?: () => any): string | undefined {
    const env = process.env[name]
    const defaultValue: DefaultEnv | undefined = this.defaults.find(v => v.name === name)
    if (env) {
      return env
    } else {
      if (ifUndefined) {
        return ifUndefined()
      } else if (defaultValue) {
        return defaultValue.defaultValue
      } else {
        return undefined
      }
    }
  }

  setDefaultFor<T>(name: ENV, defaultValue: T): void {
    this.defaults.push({ name, defaultValue })
  }

}
