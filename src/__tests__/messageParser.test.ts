import { MessageParser } from '../bot/MessageParser.class'
import { Codeblock } from '../bot/Codeblock.class'
import { RuntimeBotQuery } from '../bot/RuntimeBotQuery.class'


describe('MessageParser', () => {
  it('should parse (simple)', () => {
    const msgParser = new MessageParser()
    const parsed = msgParser.parse(`\`\`\`js
const singleCodeBlock = "test"
\`\`\``)
    expect(parsed).toEqual(new RuntimeBotQuery([
      new Codeblock('js', 'const singleCodeBlock = "test"')
    ]))
  })
  it('should parse (multiline)', () => {
    const msgParser = new MessageParser()
    const parsed = msgParser.parse(`Вот такой у меня код:
\`\`\`js
const singleCodeBlock = "test"
\`\`\`
А ещё:
\`\`\`ts
const imType: number = 101
\`\`\``)
    expect(parsed).toEqual(new RuntimeBotQuery([
      new Codeblock('js', 'const singleCodeBlock = "test"'),
      new Codeblock('ts', 'const imType: number = 101')
    ]))
  })
  it('should parse with invalid syntax', () => {
    const msgParser = new MessageParser()
    const parsed = msgParser.parse(`buwfhuie \`\`\`ghfuhuhfgudfhguhdfuh
    fdsfsdfsdfdfsdf
    ??????
    forsdf
    sdfsdf\`\`\``)
    expect(parsed).toEqual(new RuntimeBotQuery([]))
  })
  it('should parse with invalid lang', () => {
    const msgParser = new MessageParser()
    const parsed = msgParser.parse('```wronglang\nsomewronglangcode\n```')
    expect(parsed).toEqual(new RuntimeBotQuery([]))
  })
  it('should parse inline', () => {
    const msgParser = new MessageParser()
    const parsed = msgParser.parse('```ts inline code ```')
    expect(parsed).toEqual(new RuntimeBotQuery([]))
  })
})
