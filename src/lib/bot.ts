import moment = require("moment");
import { Client} from "discord.js";
import { GetChannel, GetGuild, SendChannelMessage } from "./helpers";

export default async function Connect() {
  const client = new Client();
  await client.login(process.env.TOKEN);
  console.log(`Logged in at: ${moment().format("MMMM Do YYYY, h:mm:ss a")}`);
  Listen(client);
}

async function Listen(client: Client) {
  const guild = await GetGuild(client, process.env.SERVER_ID!);
  client.on("guildMemberAdd", async (member) => {
    const general = await GetChannel(guild, process.env.GENERAL_CHANNEL!);
    SendChannelMessage(general, `**${member.displayName}** has joined the server!`);
  });
  client.on("guildMemberRemove", async (member) => {
    const debug = await GetChannel(guild, process.env.DEBUG_CHANNEL!);
    SendChannelMessage(debug, `**${member.displayName}** has left the server`);
  });
}
