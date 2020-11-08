Redis = require('ioredis')
Moment = require('moment')
Discord = require('discord.js')

supported_games = ['minecraft', '7days', 'rust', ' debug']

connect_redis = () ->
    redis = new Redis({
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT,
        password: process.env.REDIS_KEY
    })
    redis.auth(process.env.REDIS_KEY)

connect_discord = () ->
    discord = new Discord.Client()
    discord.login(process.env.TOKEN)

try
    connect_redis()
    connect_discord()
catch error
    throw new Error("Something Happen: #{error}")
