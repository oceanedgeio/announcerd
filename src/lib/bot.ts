import { Client } from "discord.js";
import Redis from "ioredis";
import Moment from "moment";
import { GetChannel, GetGuild, SendChannelMessage } from "./helpers";

export default async function Connect() {
  const client = new Client();

  await client.login(process.env.TOKEN);
  console.log(`Logged in at: ${Moment().format("MMMM Do YYYY, h:mm:ss a")}`);
  Listen(client);
}

async function Listen(client: Client) {
  const guild = await GetGuild(client, process.env.SERVER_ID!);
  const redis = new Redis();
  const pub = new Redis();

  redis.subscribe("minecraft", (err, count) => { return; });

  redis.on("message", async (channel, message) => {
    const minecraft = await GetChannel(guild, process.env.MINECRAFT_CHANNEL!);
    SendChannelMessage(minecraft, `**${message}** has entered the server`);
    console.log("Receive message %s from channel %s", message, channel);
  });
}
