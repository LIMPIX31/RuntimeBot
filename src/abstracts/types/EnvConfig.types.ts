export enum ENV {
  DISCORD_BOT_TOKEN = 'DISCORD_BOT_TOKEN'
}

export type DefaultEnv = {
  name: ENV | string,
  defaultValue: any
}
