import {Client} from "discord.js";

export interface BotClient {
  client: Client
  get getClient(): Client
}
