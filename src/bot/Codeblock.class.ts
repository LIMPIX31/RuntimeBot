import { CodeblockTags, ProgrammingLanguage } from '../abstracts/types/Codeblock.types'
import { Patches } from '../VM/Patches'

export class Codeblock {
  private readonly lang: ProgrammingLanguage
  private readonly code: string
  private _patchedCode: string
  private readonly tags: CodeblockTags

  constructor(lang: ProgrammingLanguage, code: string, tags: CodeblockTags = {}) {
    this.lang = lang
    this.code = code
    this.tags = tags
    this._patchedCode = code
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

  get filename(): string {
    return this.tags['filename']
  }

  get isEntryPoint(): boolean {
    return this.tags['entry']
  }

  /**
   * @patcher
   */
  patchPrepend(code: string): Codeblock {
    this._patchedCode = code + '\n' + this.code
    return this
  }

  get patchedCode(): string {
    return this._patchedCode
  }

  /**
   * @patcher
   */
  suppressGlobalContext() {
    this.patchPrepend(Patches.SuppressGlobalContext)
  }

}
