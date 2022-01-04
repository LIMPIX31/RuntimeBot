import { ProgrammingLanguage } from '../abstracts/types/Codeblock.types'

export class Codeblock {
  private readonly lang: ProgrammingLanguage
  private readonly code: string

  constructor(lang: ProgrammingLanguage, code: string) {
    this.lang = lang
    this.code = code
  }

  get getLang(): ProgrammingLanguage {
    return this.lang
  }

  get getCode(): string {
    return this.code
  }

}
