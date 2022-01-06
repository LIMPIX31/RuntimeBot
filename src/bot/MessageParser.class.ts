import { injectable } from 'inversify'
import 'reflect-metadata'
import { MessageParser as IMessageParser } from '../abstracts/interfaces/MessageParser.interface'
import {
  CodeblockTags, ProgrammingLanguage,
  ProgrammingLanguages
} from '../abstracts/types/Codeblock.types'
import { Codeblock } from './Codeblock.class'
import { RuntimeBotQuery } from './RuntimeBotQuery.class'

@injectable()
export class MessageParser implements IMessageParser {
  private static findCodeblocks(s: string): {
    lang: string
    code: string
    tags: CodeblockTags
  }[] {
    return Array.from(
      s.matchAll(/(?<!\\)```(?<lang>\w+)\n(?<tags>(?:\/\/\/ *#(?:[A-Z]+)(?:(?<!:): *(?:[^]*?) *)? *\n)*)?(?<code>[^]*?)\n(?<!\\)```/g)
    ).map(a => {
      const lang = a[1]
      const code = a[3]
      const tags: CodeblockTags = {}
      if (a[2]) Array.from(
        a[2].matchAll(/\/\/\/\s*#(?<name>[A-Z]+)(?:(?<!:): *(?<val>[^]*?) *)? *\n/g)
      ).forEach(b => {
        tags[b[1].toLowerCase()] = b[2] ? b[2] : true
        if (typeof tags.filename === 'string' && !tags.filename.endsWith(`.${lang}`)) tags.filename = `${tags.filename}.${lang}`
      })

      return { lang, code, tags }
    })
  }

  parse(message: string): RuntimeBotQuery {
    const rawCodeblocks = MessageParser.findCodeblocks(message)
    const parsedCodeblocks = rawCodeblocks
      .map(v => {
        if (ProgrammingLanguages.includes(v.lang as any)) {
          return new Codeblock(v.lang as ProgrammingLanguage, v.code, v.tags)
        } else {
          return
        }
      })
      .filter(v => v) as Codeblock[]
    return new RuntimeBotQuery(parsedCodeblocks)
  }
}
