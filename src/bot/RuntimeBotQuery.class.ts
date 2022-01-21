import { Codeblock } from './Codeblock.class'
import { RuntimeBotQuery as IRuntimeBotQuery } from '../abstracts/interfaces/RuntimeBotQuery.interface'

export class RuntimeBotQuery implements IRuntimeBotQuery {

  private readonly codeblocks: Codeblock[]

  constructor(codeblocks: Codeblock[]) {
    this.codeblocks = codeblocks
  }

  private _isUnlocked: boolean = false

  get isUnlocked(): boolean {
    return this._isUnlocked
  }

  get isQuery() {
    return this.codeblocks.length > 0
  }

  get getCodeblocks(): Codeblock[] {
    return this.codeblocks
  }

  unlock() {
    this._isUnlocked = true
  }

  setUnlocked(b: boolean) {
    this._isUnlocked = b
  }
}
