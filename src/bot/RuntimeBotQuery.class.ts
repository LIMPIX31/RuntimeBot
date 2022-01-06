import { Codeblock } from './Codeblock.class'

export class RuntimeBotQuery {

  private readonly codeblocks: Codeblock[]
  private _isUnlocked: boolean = false

  constructor(codeblocks: Codeblock[]) {
    this.codeblocks = codeblocks
  }

  get isQuery() {
    return this.codeblocks.length > 0
  }

  get getCodeblocks(): Codeblock[] {
    return this.codeblocks
  }

  unlock(){
    this._isUnlocked = true
  }

  setUnlocked(b:boolean){
    this._isUnlocked = b
  }

  get isUnlocked(): boolean {
    return this._isUnlocked
  }
}
