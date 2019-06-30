import { Client } from "discord.js";
import Redis from "ioredis";
import Moment from "moment";
import { GetChannel, GetGuild, SameLastMessage, SendChannelMessage } from "./helpers";

export default async function Connect() {
  const discord = new Client();
  const redis = new Redis();
  redis.subscribe("minecraft", (err, count) => { return; });

  await discord.login(process.env.TOKEN);
  console.log(`Logged in at: ${Moment().format("MMMM Do YYYY, h:mm:ss a")}`);
  Listen(discord, redis);
}

async function Listen(discord: Client, redis: Redis.Redis) {
  const guild = await GetGuild(discord, process.env.SERVER_ID!);

  redis.on("message", async (channel, message) => {
    const announcement = `**${message}** has entered the server`;
    const minecraft = await GetChannel(guild, process.env.MINECRAFT_CHANNEL!);
    const duplicateMessage = await SameLastMessage(minecraft, announcement);
    if (duplicateMessage === false) {
      SendChannelMessage(minecraft, `**${message}** has entered the server`);
      console.log("Receive message %s from channel %s", message, channel);
    }
  });
}
