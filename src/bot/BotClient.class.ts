import { BotClient as IBotClient } from '../abstracts/interfaces/BotClient.interface'
import { Client, Intents } from 'discord.js'
import { inject, injectable } from 'inversify'
import { Logger } from '../utils/Logger'
import { TYPES } from '../IoC/types'
import { EnvConfig } from '../abstracts/interfaces/EnvConfig.interface'
import { ENV } from '../abstracts/types/EnvConfig.types'
import { TemplateMessage } from '../utils/TemplateMessage.class'
import 'reflect-metadata'

@injectable()
export class BotClient implements IBotClient {
  client: Client

  constructor(@inject(TYPES.EnvConfig) private env: EnvConfig) {
    Logger.info('Starting runtime bot')
    this.client = new Client({ intents: [Intents.FLAGS.GUILDS] })
    this.client.on('ready', () => {
      Logger.success('Runtime bot started')
    })
    this.client.login(this.env.get(ENV.DISCORD_BOT_TOKEN, () => {
      Logger.fatal(TemplateMessage.envNotDefined(ENV.DISCORD_BOT_TOKEN))
    })).catch((e) => {
      Logger.fatal('Discord bot login error')
      console.error(e)
    })
  }

  get getClient(): Client {
    return this.client
  }

}
