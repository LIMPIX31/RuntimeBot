import { RuntimeBotQuery } from '../abstracts/interfaces/RuntimeBotQuery.interface'
import { Codeblock } from './Codeblock.class'
import { RuntimeEnvironment as IRuntimeEnvironment } from '../abstracts/interfaces/RuntimeEnvironment.interface'
import * as fs from 'fs'
import path from 'path'
import { v4 as UUIDv4 } from 'uuid'
import { ColorResolvable, Message, MessageActionRow, MessageButton, MessageEmbed, ThreadChannel } from 'discord.js'
import { I18N } from '../abstracts/interfaces/I18N.interface'
import { GlobalStages, RunStatus } from '../abstracts/types/RuntimeEnvironment.types'
import { StageRanker } from '../utils/StageRanker'
import { init, parse } from 'es-module-lexer'

export class RuntimeEnvironment implements IRuntimeEnvironment {

  codeblocks: Codeblock[]
  queryIsPublic: boolean
  initialized: boolean = false
  envUUID: string | undefined
  i18n: I18N
  thread: ThreadChannel
  runStatus: RunStatus = 'idle'
  trackingMessage: Message | undefined
  globalStage: StageRanker = new StageRanker(GlobalStages.VALIDATING)
  errorMsg: string = ''
  envPath: string = ''

  constructor(originalQuery: RuntimeBotQuery, i18n: I18N, thread: ThreadChannel) {
    this.codeblocks = originalQuery.getCodeblocks
    this.queryIsPublic = originalQuery.isUnlocked
    this.i18n = i18n
    this.thread = thread
  }

  async init() {
    await this.updateTrackingMessage()
    await this.validateAndWrap()
    await this.initEnv()
  }

  async updateTrackingMessage() {
    const payload = {
      embeds: [this.buildTrackingEmbed()],
      components: [this.getDiscordControlButtons()]
    }
    this.trackingMessage ?
      this.trackingMessage = await this.trackingMessage.edit(payload) :
      this.trackingMessage = await this.thread.send(payload)
  }

  private async validateAndWrap() {
    if (this.runStatus === 'error') return
    if (await this.hasIllegalImports()) {
      this.globalStage.crash()
      this.runStatus = 'error'
      this.errorMsg = this.i18n.translate('bot.environment.tracker.errorMsg.illegalImport')
      await this.updateTrackingMessage()
      //TODO: close
      return
    }
    this.suppressGlobalContext()
    this.globalStage.updateStage(GlobalStages.SETTING_UP_ENVIRONMENT)
  }

  private suppressGlobalContext() {
    for (const cb of this.codeblocks) {
      cb.suppressGlobalContext()
    }
  }

  private async hasIllegalImports(): Promise<boolean> {
    await init
    let illegal = false
    for (const cb of this.codeblocks) {
      const [imports] = parse(cb.getCode)
      for (const $import of imports) {
        illegal = ($import?.n?.includes('..') || false)
          || $import?.n?.match(/fs|fetch|http|axios|https|child_process|rimraf/) !== null
      }
    }
    return illegal
  }

  private async initEnv() {
    if (this.runStatus === 'error') return
    const uuid = () => UUIDv4().toString().replaceAll('-', '')
    this.envUUID = uuid()
    this.envPath = path.join(process.cwd(), 'userenvs', this.envUUID)
    try {
      fs.mkdir(this.envPath, () => {
      })
      for (const cb of this.codeblocks) {
        fs.writeFile(path.join(this.envPath, cb.filename || `${uuid()}.${cb.getLang}`), cb.patchedCode, {
          encoding: 'utf8'
        }, () => {
        })
      }
      this.globalStage.updateStage(GlobalStages.INSTALLING_DEPENDENCIES)
      await this.updateTrackingMessage()
    } catch (e) {

    }
  }

  private getDiscordControlButtons() {
    return new MessageActionRow().addComponents(
      new MessageButton()
        .setCustomId('runCode')
        .setLabel(this.i18n.translate('bot.environment.tracker.control.run'))
        .setStyle('PRIMARY')
        .setDisabled(this.globalStage.stage !== GlobalStages.IDLING_RUN)
    )
  }

  private buildTrackingEmbed() {
    const envi18n = 'bot.environment.tracker.'
    let color = '#000'
    let statusTranslated = this.i18n.translate(`${envi18n}status.unknown`)
    switch (this.runStatus) {
      case 'success':
        color = '#7bff00'
        statusTranslated = this.i18n.translate(`${envi18n}status.success`)
        break
      case 'warn':
        color = '#ff4d00'
        statusTranslated = this.i18n.translate(`${envi18n}status.warning`)
        break
      case 'error':
        color = '#ff0033'
        statusTranslated = this.i18n.translate(`${envi18n}status.error`)
        break
      case 'idle':
        color = '#5e00ff'
        statusTranslated = this.i18n.translate(`${envi18n}status.idling`)
        break
      case 'inProgress':
        color = '#a8ffe0'
        statusTranslated = this.i18n.translate(`${envi18n}status.inProgress`)
        break
    }
    const embed = new MessageEmbed()
      .setTitle(this.i18n.translate('bot.environment.tracker.title'))
      .setColor(color as ColorResolvable)
      .setDescription(`\`\`\`${this.getLogsFromStages().join('\n')}\`\`\``)
      .addField(this.i18n.translate('bot.environment.tracker.status'), statusTranslated, true)
    this.runStatus === 'error' && (embed.addField(this.i18n.translate('bot.environment.tracker.fields.error'), this.errorMsg))
    return embed
  }

  private getLogsFromStages() {
    const i18nstagepath = 'bot.environment.tracker.stage.'
    return this.globalStage.history.map(v => {
      let out = ''
      switch (v.stage) {
        case GlobalStages.SETTING_UP_ENVIRONMENT:
          out += `⚙️ ${this.i18n.translate(i18nstagepath + 'settingUpEnv')}`
          break
        case GlobalStages.VALIDATING:
          out += `🏁 ${this.i18n.translate(i18nstagepath + 'validating')}`
          break
        case GlobalStages.INSTALLING_DEPENDENCIES:
          out += `⏬ ${this.i18n.translate(i18nstagepath + 'installingDeps')}`
          break
        case GlobalStages.COMPILING:
          out += `🗳️ ${this.i18n.translate(i18nstagepath + 'compiling')}`
          break
        case GlobalStages.RUNNING:
          out += `🔃 ${this.i18n.translate(i18nstagepath + 'running')}`
          break
        case GlobalStages.CLEARING:
          out += `♻️ ${this.i18n.translate(i18nstagepath + 'clearing')}`
          break
        case GlobalStages.CLOSED:
          out += `📕 ${this.i18n.translate(i18nstagepath + 'closed')}`
          break
      }
      out += ` ${v.emoji}`
      return out
    })
  }

}
