import { Client } from "discord.js";
import Redis from "ioredis";
import Moment from "moment";
import { GetChannel, GetGuild, SameLastMessage, SendChannelMessage, NormalizeRust } from "./helpers";

export default async function Connect() {
  const discord = new Client();
  const redis = new Redis();
  redis.subscribe("minecraft", (err, count) => { return; });
  redis.subscribe("rust", (err, count) => { return; });

  await discord.login(process.env.TOKEN);
  console.log(`Logged in at: ${Moment().format("MMMM Do YYYY, h:mm:ss a")}`);
  Listen(discord, redis);
}

async function Listen(discord: Client, redis: Redis.Redis) {
  const guild = await GetGuild(discord, process.env.SERVER_ID!);

  redis.on("message", async (channel, message) => {
    if (channel === "rust") {
      message = NormalizeRust(message);
    }
    const announcement = `**${message}** has entered the server`;
    const gameChannel = await GetChannel(guild, channel);
    const duplicateMessage = await SameLastMessage(gameChannel, announcement);
    if (duplicateMessage === false) {
      await SendChannelMessage(gameChannel, announcement);
      console.log(`${channel}: ${announcement}`);
    }
  });
}
