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
  private static findCodeblocks(s: string): {
    lang: string
    code: string
  }[] {
    return Array.from(
      s.matchAll(/(?<!\\)```(\w+)\n([^]*?)\n(?<!\\)```/g)
    ).map(v => {
      return { lang: v[1], code: v[2] }
    })
  }

  parse(message: string): RuntimeBotQuery {
    const rawCodeblocks = MessageParser.findCodeblocks(message)
    const parsedCodeblocks = rawCodeblocks
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
}
