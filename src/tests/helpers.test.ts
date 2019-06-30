// tslint:disable: no-unused-expression
import { Client } from "discord.js";
import { DeleteChannelLastMessage, GetChannel, GetGuild, SameLastMessage, SendChannelMessage } from "../lib/helpers";

describe("SameLastMessage Function", () => {
  let testChannel;
  let discord;
  let testMsg;
  let guild;

  beforeEach(async () => {
    testMsg = "This is just a test";
    discord = new Client();
    await discord.login("");
    guild = await GetGuild(discord, "561304574917607424");
    testChannel = await GetChannel(guild, "he-man");
  });
  afterEach(async () => {
    await DeleteChannelLastMessage(testChannel);
    discord.destroy();
  });
  test("Returns true if messages are the same", async () => {
    await SendChannelMessage(testChannel, testMsg);
    const isItDuplicate = await SameLastMessage(testChannel, testMsg);
    expect(isItDuplicate).toBe(true);
  });
  test("Returns false if messages are different", async () => {
    await SendChannelMessage(testChannel, "This isn't just a test");
    const isItDuplicate = await SameLastMessage(testChannel, testMsg);
    expect(isItDuplicate).toBe(false);
  });
});
