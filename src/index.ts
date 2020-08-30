#!/usr/bin/env node

import Redis from 'ioredis'
import Moment from 'moment'
import { Client, Guild, TextChannel } from 'discord.js'

if (!process.env.TOKEN) { throw new Error('Exiting - Double check your environment variables.') }
let discord
let redis

try {
  discord = new Client()
  redis = new Redis({
    host: process.env.REDIS_HOST,
    password: process.env.REDIS_KEY
  })

  redis.auth(process.env.REDIS_KEY!)
  redis.subscribe('minecraft', (err, count) => { })
  redis.subscribe('7days', (err, count) => { })
  redis.subscribe('rust', (err, count) => { })
  redis.subscribe('debug', (err, count) => { })
} catch (error) {
  throw new Error(`Connection Error: ${error}`)
}

Listen(discord, redis)

async function Listen (discord: Client, redis: Redis.Redis) {
  await discord.login(process.env.TOKEN)
  console.log(`Logged in at: ${Moment().format('MMMM Do YYYY, h:mm:ss a')}`)
  const guild = await GetGuild(discord, process.env.SERVER_ID!)

  redis.on('message', async (channel, message) => {
    let announcement
    switch (channel) {
      case 'minecraft':
        announcement = `**${message}** has entered the server`
        break
      case 'rust':
        announcement = `**${message}** has entered the server`
        break
      case '7days':
        message = NormalizeSdtd(message)
        announcement = message
        break
      case 'debug':
        announcement = message
        break
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
  if (channel.name === 'debug') return false
  let lastMsg
  try {
    const messages = await channel.fetchMessages({ limit: 1 })
    lastMsg = messages.first()
  } catch (e) {
    console.error(e)
  }
  if (lastMsg && lastMsg.content === message) { return true }
  return false
}

function NormalizeSdtd (message: string) {
  if (message.includes('joined')) { return message }
  return ''
}
