import { Codeblock } from '../../bot/Codeblock.class'

export interface RuntimeBotQuery {
  get isQuery(): boolean

  get isUnlocked(): boolean

  get getCodeblocks(): Codeblock[]

  unlock(): void

  setUnlocked(b: boolean): void
}
