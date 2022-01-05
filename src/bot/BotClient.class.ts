import { BotClient as IBotClient } from '../abstracts/interfaces/BotClient.interface'
import {
  Client,
  Intents,
  Message,
  MessageEmbed,
  MessageReaction,
  PartialMessageReaction,
  PartialUser,
  User
} from 'discord.js'
import { inject, injectable } from 'inversify'
import { Logger } from '../utils/Logger'
import { TYPES } from '../IoC/types'
import { EnvConfig } from '../abstracts/interfaces/EnvConfig.interface'
import { ENV } from '../abstracts/types/EnvConfig.types'
import { TemplateMessage } from '../utils/TemplateMessage.class'
import 'reflect-metadata'
import { I18N } from '../abstracts/interfaces/I18N.interface'
import { MessageParser } from '../abstracts/interfaces/MessageParser.interface'

const runEmoji = '▶️'
const unlockEmoji = '🔓'

@injectable()
export class BotClient implements IBotClient {
  client: Client

  constructor(
    @inject(TYPES.EnvConfig) private env: EnvConfig,
    @inject(TYPES.I18N) private i18n: I18N,
    @inject(TYPES.MessageParser) private messageParser: MessageParser
  ) {
    Logger.info('Starting runtime bot')
    this.client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.DIRECT_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS] })
    this.client.on('ready', () => {
      Logger.success('Runtime bot started')
    })
    this.client.login(this.env.get(ENV.DISCORD_BOT_TOKEN, () => {
      Logger.fatal(TemplateMessage.envNotDefined(ENV.DISCORD_BOT_TOKEN))
    })).catch((e) => {
      Logger.fatal('Discord bot login error')
      console.error(e)
    })
    this.messageHandler()
    this.reactionHandler()
  }

  get getClient(): Client {
    return this.client
  }

  private messageHandler() {
    this.client.on('messageCreate', async (message: Message) => {
      if (message.author.bot) return
      if (this.messageParser.parse(message.content).isQuery) {
        await message.react(runEmoji)
      }
    })
  }

  private reactionHandler() {
    this.client.on('messageReactionAdd', async (reaction, user) => {
      if (await this.prepareReaction(reaction)) return
      if (this.shouldRunCode(reaction, user)) {
        if (this.codeExecutionIsAllowed(reaction, user)) {
          await this.startCodeThreadAtReaction(reaction)
        } else {
          await this.cancelCodeExecutionAttempt(reaction, user)
        }
      }
    })
  }

  private shouldRunCode(reaction: MessageReaction | PartialMessageReaction, user: User | PartialUser): boolean {
    return !!(reaction.message.author !== null && !user.bot && reaction.emoji.name === runEmoji && reaction.users.cache.find(v => v.id === this.client.user?.id))
  }

  private codeExecutionIsAllowed(reaction: MessageReaction | PartialMessageReaction, user: User | PartialUser): boolean {
    return !!(user.id === reaction.message.author?.id || reaction.message.reactions.cache.find(v => v.emoji.name === unlockEmoji))
  }

  private async startCodeThreadAtReaction(reaction: MessageReaction | PartialMessageReaction) {
    await reaction.users.remove(this.client.user as User)
    await reaction.message.startThread({
      autoArchiveDuration: 60,
      name: `${this.i18n.translate('bot.newCodeThread.name')} [${reaction.message.author?.username}]`
    })
  }

  private async cancelCodeExecutionAttempt(reaction: MessageReaction | PartialMessageReaction, user: User | PartialUser) {
    await user.send({
      embeds: [new MessageEmbed()
        .setTitle(this.i18n.translate('bot.tryRunSomeoneCode'))
        .setColor('#FF0000')
        .setDescription(this.i18n.translate('bot.tryRunSomeoneCode.description'))
      ]
    })
    await reaction.users.remove(user as User)
  }

  private async prepareReaction(reaction: MessageReaction | PartialMessageReaction): Promise<boolean> {
    if (reaction.partial) {
      try {
        await reaction.fetch()
        return false
      } catch (error) {
        return true
      }
    } else {
      return true
    }
  }

}
