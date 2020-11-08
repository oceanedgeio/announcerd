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
    return redis

connect_discord = () ->
    discord = new Discord.Client()
    discord.login(process.env.TOKEN)
    return discord
try
    redis = connect_redis()
    discord = connect_discord()
    for game in supported_games
        redis.subscribe(game)

catch error
    throw new Error("Something Happen: #{error}")


discord.on('ready', () ->
    console.log('yeet'))
