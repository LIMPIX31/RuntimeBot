import { ENV } from '../abstracts/types/EnvConfig.types'

export abstract class TemplateMessage {
  static envNotDefined(name: ENV) {
    return `Env ${name} is not defined`
  }
}
