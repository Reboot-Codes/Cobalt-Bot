import { createCommand } from "../utils/helpers.ts";
import { cache as discordCache } from "../../deps.ts";

createCommand({
  name: "ping",
  description: "Ping the Bot! Returns a time in Milliseconds",
  botChannelPermissions: ["SEND_MESSAGES"],
  execute: (message) => {
    const pingArr = (Date.now() - message.timestamp).toString().split("-");
    const ping = pingArr[pingArr.length - 1];
    message.send(`Ping: ${ping}ms`);
  },
});

createCommand({
  name: "dev-ping",
  description:
    "Ping the Bot! Returns extra information about performance impacts",
  botChannelPermissions: ["SEND_MESSAGES"],
  aliases: ["devping"],
  execute: (message) => {
    let memberCount = 0;
    discordCache.guilds.forEach((guild) => {
      memberCount += guild.members.size;
    });

    message.send(
      `Ping MS: ${
        Date.now() - message.timestamp
      }ms | Guilds: ${discordCache.guilds.size} | Users: ${memberCount}`,
    );
  },
});
