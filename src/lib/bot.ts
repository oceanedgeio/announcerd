import { Client } from 'discord.js'
import Redis from 'ioredis'
import Moment from 'moment'
import { GetChannel, GetGuild, NormalizeRust, NormalizeSdtd, SameLastMessage, SendChannelMessage } from './helpers'

export default async function Connect () {
  const discord = new Client()
  const redis = new Redis()
  redis.subscribe('minecraft', (err, count) => { return })
  redis.subscribe('7days', (err, count) => { return })
  redis.subscribe('rust', (err, count) => { return })

  await discord.login(process.env.TOKEN)
  console.log(`Logged in at: ${Moment().format('MMMM Do YYYY, h:mm:ss a')}`)
  Listen(discord, redis)
}

async function Listen(discord: Client, redis: Redis.Redis) {
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
