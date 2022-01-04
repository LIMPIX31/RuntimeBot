import { DefaultEnv, ENV } from '../types/EnvConfig.types'

export interface EnvConfig {
  defaults: DefaultEnv[]

  get(name: ENV | string, ifUndefined?: () => any): string | undefined

  setDefaultFor<T>(name: ENV, defaultValue: T): void
}
