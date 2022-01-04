import { Container } from 'inversify'
import { EnvConfig as IEnvConfig } from '../abstracts/interfaces/EnvConfig.interface'
import { BotClient as IBotClient } from '../abstracts/interfaces/BotClient.interface'
import { I18N as II18N } from '../abstracts/interfaces/I18N.interface'
import { MessageParser as IMessageParser } from '../abstracts/interfaces/MessageParser.interface'
import { TYPES } from './types'
import { EnvConfig } from '../config/EnvConfig.class'
import { BotClient } from '../bot/BotClient.class'
import { I18N } from '../i18n/I18N.class'
import { MessageParser } from '../bot/MessageParser.class'

const AppContainer = new Container()
AppContainer.bind<IEnvConfig>(TYPES.EnvConfig).to(EnvConfig).inSingletonScope()
AppContainer.bind<IBotClient>(TYPES.BotClient).to(BotClient).inSingletonScope()
AppContainer.bind<II18N>(TYPES.I18N).to(I18N).inSingletonScope()
AppContainer.bind<IMessageParser>(TYPES.MessageParser).to(MessageParser).inSingletonScope()
export { AppContainer }
