import { RuntimeBotQuery } from './RuntimeBotQuery.class'
import { injectable } from 'inversify'
import 'reflect-metadata'
import { MessageParser as IMessageParser } from '../abstracts/interfaces/MessageParser.interface'
import { Codeblock } from './Codeblock.class'
import { ProgrammingLanguage, ProgrammingLanguages } from '../abstracts/types/Codeblock.types'

@injectable()
export class MessageParser implements IMessageParser {
  private static findCodeblocks(s: string): string[] {
    const lines = s.split('\n')
    let codeblocks: string[] = []
    let codeblock = ''
    let isCodeblock = false
    for (const line of lines) {
      if (isCodeblock) {
        if (line.match(/^```\w*/) !== null) {
          codeblock += line
          isCodeblock = false
          codeblocks.push(codeblock)
          codeblock = ''
        } else {
          codeblock += line + '\n'
        }
      } else {
        if (line.match(/^```\w*/) !== null) {
          codeblock += line + '\n'
          isCodeblock = true
        }
      }
    }
    return codeblocks.filter(v =>
      v.split('\n')[0].match(/^```\w*/) !== null &&
      v.split('\n')[v.split('\n').length - 1].match(/^```\w*/) !== null
    )
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
      }).filter(v => v) as Codeblock[]
    return new RuntimeBotQuery(parsedCodeblocks)
  }

  parseCodeblock(codeblock: string): {
    lang: string,
    code: string
  } {
    const lines = codeblock.split('\n')
    const lang = lines[0].replaceAll('```', '')
    const code = lines.slice(1, lines.length - 1).join('\n')
    return { lang, code }
  }

}