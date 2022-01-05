import { RuntimeBotQuery } from './RuntimeBotQuery.class'
import { injectable } from 'inversify'
import 'reflect-metadata'
import { MessageParser as IMessageParser } from '../abstracts/interfaces/MessageParser.interface'
import { Codeblock } from './Codeblock.class'
import {
  ProgrammingLanguage,
  ProgrammingLanguages
} from '../abstracts/types/Codeblock.types'

@injectable()
export class MessageParser implements IMessageParser {
  private static findCodeblocks(s: string): string[] {
    return s.match(/(?<!\\)(\`\`\`)(\w+\n)([^]*?)(?<!\\)(\`\`\`)/g) || []
  }

  parse(message: string): RuntimeBotQuery {
    const rawCodeblocks = MessageParser.findCodeblocks(message)
    const parsedCodeblocks = rawCodeblocks
      .map(v => this.parseCodeblock(v))
      .map(v => {
        if (ProgrammingLanguages.includes(v.lang as any)) {
          return new Codeblock(v.lang as ProgrammingLanguage, v.code)
        } else {
          return
        }
      })
      .filter(v => v) as Codeblock[]
    return new RuntimeBotQuery(parsedCodeblocks)
  }

  parseCodeblock(codeblock: string): {
    lang: string
    code: string
  } {
    const res = codeblock.match(
      /(?<!\\)(\`\`\`)(\w+\n)([^]*?)(?<!\\)(\`\`\`)/
    )
    return { lang: (res || [])[2], code: (res || [])[3] }
  }
}
