import { Client, Guild, TextChannel } from "discord.js";
import Moment = require("moment");

export async function GetGuild(discordClient: Client, guildId: string) {
  const guild = await discordClient.guilds.get(guildId)!;
  return guild;
}

export async function GetChannel(guild: Guild, channelName: string) {
  const channel = await guild.channels.find((chan) => chan.name === channelName);
  return channel as TextChannel;
}

export async function SendChannelMessage(channel: TextChannel, message: string) {
  await channel.send(message);
  const timestamp = Moment().format("MMMM Do YYYY, h:mm:ss a");
  console.log(`${timestamp}: ${message}`);
}

export async function DeleteChannelLastMessage(channel: TextChannel) {
  const lastMsg = await FetchChannelLastMessage(channel);
  await lastMsg.delete();
  return true;
}

export async function FetchChannelLastMessage(channel: TextChannel) {
  const lastMsg = await channel.fetchMessage(channel.lastMessageID);
  return lastMsg;
}

export async function SameLastMessage(channel: TextChannel, message: string) {
  let lastMsg;
  try {
    const messages = await channel.fetchMessages({ limit: 1 });
    lastMsg = messages.first();
  } catch (e) {
    console.error(e);
  }
  if (lastMsg && lastMsg.content === message)
    return true;
  return false;
}

export function NormalizeRust(message: string) {
  const matches = message.match(/\]:(.*?)\with/);
  if (matches) {
    const playerName = matches.pop();
    if (playerName)
      return playerName.substring(4).trim();
  }
}

export function NormalizeSdtd(message: string) {
  if (message.includes("joined"))
    return message;
  return "";
}
