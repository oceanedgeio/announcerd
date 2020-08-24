// // tslint:disable: no-unused-expression
// import { Client } from "discord.js";
// import { DeleteChannelLastMessage, GetChannel, GetGuild, SameLastMessage, SendChannelMessage } from "../index";

// describe("SameLastMessage Function", () => {
//   let testChannel;
//   let discord;
//   let testMsg;
//   let guild;

//   beforeEach(async () => {
//     testMsg = "This is just a test";
//     discord = new Client();
//     await discord.login(process.env.TOKEN!);
//     guild = await GetGuild(discord, process.env.SERVER_ID!);
//     testChannel = await GetChannel(guild, process.env.CHANNEL_NAME!);
//   });
//   afterEach(async () => {
//     await DeleteChannelLastMessage(testChannel);
//     discord.destroy();
//   });
//   test("Returns true if messages are the same", async () => {
//     await SendChannelMessage(testChannel, testMsg);
//     const isItDuplicate = await SameLastMessage(testChannel, testMsg);
//     expect(isItDuplicate).toBe(true);
//   });
//   test("Returns false if messages are different", async () => {
//     await SendChannelMessage(testChannel, "This isn't just a test");
//     const isItDuplicate = await SameLastMessage(testChannel, testMsg);
//     expect(isItDuplicate).toBe(false);
//   });
// });
