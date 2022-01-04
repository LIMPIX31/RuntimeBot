import { RuntimeBotQuery } from '../../bot/RuntimeBotQuery.class'

export interface MessageParser {
  parse(message: string): RuntimeBotQuery
}
