import { Client} from "discord.js";
import moment from "moment";
import { GetChannel, GetGuild, SendChannelMessage } from "./helpers";

import Redis from "ioredis";


export default async function Connect() {
  const client = new Client();

  await client.login(process.env.TOKEN);
  console.log(`Logged in at: ${moment().format("MMMM Do YYYY, h:mm:ss a")}`);
  Listen(client);
}

async function Listen(client: Client) {
  const guild = await GetGuild(client, process.env.SERVER_ID!);
  const redis = new Redis();
  const pub = new Redis();

  redis.subscribe("minecraft", (err, count) => {
  });

  redis.on("message", async (channel, message) => {
    const guild = await GetGuild(client, process.env.SERVER_ID!);
    const general = await GetChannel(guild, process.env.GENERAL_CHANNEL!);
    SendChannelMessage(general, `**${message}** has joined the server!`);
    console.log("Receive message %s from channel %s", message, channel);
  });
}
