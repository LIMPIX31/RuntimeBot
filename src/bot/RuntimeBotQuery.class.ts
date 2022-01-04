import { Codeblock } from './Codeblock.class'

export class RuntimeBotQuery {

  private readonly codeblocks: Codeblock[]

  constructor(codeblocks: Codeblock[]) {
    this.codeblocks = codeblocks
  }

  get isQuery() {
    return this.codeblocks.length > 0
  }

}
