import { Client, Guild, TextChannel, GuildChannel } from "discord.js";
import Moment = require("moment");

export async function GetGuild(discordClient: Client, guildId: string) {
  const guild = await discordClient.guilds.get(guildId)!;
  return guild;
}

export async function GetChannel(guild: Guild, channelName: string) {
  const channel = await guild.channels.find((chan) => chan.name === channelName);
  return channel as TextChannel;
}

export function SendChannelMessage(channel: TextChannel, message: string) {
  channel.send(message);
  const timestamp = Moment().format("MMMM Do YYYY, h:mm:ss a");
  console.log(`${timestamp}: ${message}`);
}

export async function SameLastMessage(channel: TextChannel, message: string) {
  if (channel.lastMessage.content && message === channel.lastMessage.content)
    return true;
  return false;
}
