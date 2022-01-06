import { CodeblockTags, ProgrammingLanguage } from '../abstracts/types/Codeblock.types'

export class Codeblock {
  private readonly lang: ProgrammingLanguage
  private readonly code: string
  private readonly tags: CodeblockTags

  constructor(lang: ProgrammingLanguage, code: string, tags: CodeblockTags = {}) {
    this.lang = lang
    this.code = code
    this.tags = tags
  }

  get getLang(): ProgrammingLanguage {
    return this.lang
  }

  get getCode(): string {
    return this.code
  }

  get getTags(): CodeblockTags {
    return this.tags
  }
}
