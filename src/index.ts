#!/usr/bin/env node

import Redis from 'ioredis'
import Moment from 'moment'
import { Client, Guild, TextChannel } from 'discord.js'

if (!process.env.TOKEN) { throw new Error('Exiting - Double check your environment variables.') }
let discord
let redis

try {
  const discord = new Client()
  const redis = new Redis()

  redis.subscribe('minecraft', (err, count) => { return })
  redis.subscribe('7days', (err, count) => { return })
  redis.subscribe('rust', (err, count) => { return })
  discord.login(process.env.TOKEN)
} catch (error) {
  throw new Error(`Connection Error: ${error}`)
}

console.log(`Logged in at: ${Moment().format('MMMM Do YYYY, h:mm:ss a')}`)
Listen(discord, redis)

async function Listen (discord: Client, redis: Redis.Redis) {
  const guild = await GetGuild(discord, process.env.SERVER_ID!)

  redis.on('message', async (channel, message) => {
    let announcement
    switch (channel) {
      case 'minecraft':
        announcement = `**${message}** has entered the server`
        break
      case 'rust':
        message = NormalizeRust(message)
        announcement = `**${message}** has entered the server`
        break
      case '7days':
        message = NormalizeSdtd(message)
        announcement = message
        break
      case 'debug':
        console.log(message)
        return
      default:
        break
    }
    const gameChannel = await GetChannel(guild, channel)
    const duplicateMessage = await SameLastMessage(gameChannel, announcement)
    if (message) {
      if (duplicateMessage === false) {
        await SendChannelMessage(gameChannel, announcement)
        console.log(`${channel}: ${announcement}`)
      }
    }
  })
}

async function GetGuild (discordClient: Client, guildId: string) {
  const guild = await discordClient.guilds.get(guildId)!
  return guild
}

async function GetChannel (guild: Guild, channelName: string) {
  const channel = await guild.channels.find((chan) => chan.name === channelName)
  return channel as TextChannel
}

async function SendChannelMessage (channel: TextChannel, message: string) {
  await channel.send(message)
  const timestamp = Moment().format('MMMM Do YYYY, h:mm:ss a')
  console.log(`${timestamp}: ${message}`)
}

async function DeleteChannelLastMessage (channel: TextChannel) {
  const lastMsg = await FetchChannelLastMessage(channel)
  await lastMsg.delete()
  return true
}

async function FetchChannelLastMessage (channel: TextChannel) {
  const lastMsg = await channel.fetchMessage(channel.lastMessageID)
  return lastMsg
}

async function SameLastMessage (channel: TextChannel, message: string) {
  let lastMsg
  try {
    const messages = await channel.fetchMessages({ limit: 1 })
    lastMsg = messages.first()
  } catch (e) {
    console.error(e)
  }
  if (lastMsg && lastMsg.content === message)
    return true
  return false
}

function NormalizeRust (message: string) {
  const matches = message.match(/\](.*?)\[/)
  if (matches) {
    const playerName = matches.pop()
    if (playerName)
      return playerName.substring(1).trim()
  }
}

function NormalizeSdtd (message: string) {
  if (message.includes('joined'))
    return message
  return ''
}
