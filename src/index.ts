import Connect from "./lib/bot";

if (!process.env.TOKEN)
  throw new Error("Exiting - Double check your environment variables.");
Connect();
