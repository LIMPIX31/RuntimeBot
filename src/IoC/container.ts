import { Container } from 'inversify'
import { EnvConfig as IEnvConfig } from '../abstracts/interfaces/EnvConfig.interface'
import { BotClient as IBotClient } from '../abstracts/interfaces/BotClient.interface'
import { TYPES } from './types'
import { EnvConfig } from '../config/EnvConfig.class'
import { BotClient } from '../bot/BotClient.class'

const AppContainer = new Container()
AppContainer.bind<IEnvConfig>(TYPES.EnvConfig).to(EnvConfig).inSingletonScope()
AppContainer.bind<IBotClient>(TYPES.BotClient).to(BotClient).inSingletonScope()
export { AppContainer }
