# discord-announcer [![CircleCI](https://circleci.com/gh/Egeeio/gsd-discord-announcer.svg?style=svg)](https://circleci.com/gh/Egeeio/gsd-discord-announcer)

<a href="https://codeclimate.com/github/egee-irl/gsd-discord-announcer/maintainability"><img src="https://api.codeclimate.com/v1/badges/0e771663ebf57b75cb43/maintainability" /></a>
[![Discord](https://discordapp.com/api/guilds/183740337976508416/widget.png?style=shield)](https://discord.gg/EMbcgR8)

Discord-Announcer is a tiny Discord bot that announces when players join game servers to a Discord server.

## Built with 💖 and

- [TypeScript](https://www.typescriptlang.org/)
- [DiscordJS](https://discord.js.org/#/)
- [ioredis](https://github.com/luin/ioredis)

## Hosting

Discord-Announcer is built for the Egee.io community and works in conjunction with [Log-Parser](https://github.com/Egeeio/gsd-log-parser), however the bot is generic enough that you can easily self-host it on your own server. Use the `./docker/docker-compose.yml` file, and add your Discord token and server id. You'll also need to make sure you have a Redis instance running locally.
