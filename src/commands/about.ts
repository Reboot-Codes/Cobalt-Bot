import {
  createCommand,
  humanizeMilliseconds,
  sendEmbed,
} from "../utils/helpers.ts";
import { cache as discordCache, DISCORDENO_VERSION } from "../../deps.ts";
import { configs } from "../../config.ts";
import { cache } from "../../cache.ts";

createCommand({
  name: "about",
  aliases: ["about-bot", "stats", "info"],
  description: "Show information about the bot!",
  execute: (message) => {
    const pingArr = (Date.now() - message.timestamp).toString().split("-");
    const ping = pingArr[pingArr.length - 1];

    let channels = 0;
    discordCache.guilds.forEach((guild) => {
      channels += guild.channels.size;
    });

    sendEmbed(message.channelId, {
      author: {
        name: "Cobalt#3379",
        url: "https://cobalt.reboot.dev/",
        iconUrl:
          "https://raw.githubusercontent.com/discordeno/guide/main/src/.vuepress/public/logo.png",
      },
      title: "Cobalt Bot Stats",
      color: configs.color,
      fields: [
        {
          name: "About This Bot",
          value:
            `Hey there, I'm a Bot built in Deno that strives to be the best!\nIf you don't know my prefix for your server, try to ping me!\n${configs.url}/`,
        },
        {
          name: "Created By",
          value: "RebootHas_Disc#9645",
          inline: true,
        },
        {
          name: "Official Server",
          value: `${configs.url}/support`,
          inline: true,
        },
        {
          name: "Invite",
          value: `${configs.url}/invite`,
          inline: true,
        },
        {
          name: "Active Guilds",
          value: `${discordCache.activeGuildIds.size}`,
          inline: true,
        },
        {
          name: "Channels",
          value: `${channels}`,
          inline: true,
        },
        {
          name: "Messages",
          value: `${discordCache.messages.array.length}`,
          inline: true,
        },
        {
          name: "Cached Guilds",
          value: `${discordCache.guilds.size}`,
          inline: true,
        },
        {
          name: "Cached Members",
          value: `${discordCache.members.size}`,
          inline: true,
        },
        {
          name: "Cached Commands",
          value: `${cache.commands.size}`,
          inline: true,
        },
        {
          name: "Runtime Version",
          value: `v${Deno.version.deno}`,
          inline: true,
        },
        {
          name: "Library Version",
          value: `v${DISCORDENO_VERSION}`,
          inline: true,
        },
        {
          name: "Bot Version",
          value: `v${configs.version}`,
          inline: true,
        },
        {
          name: "Bot Age",
          value: "<t:1638255644:R>",
          inline: true,
        },
        {
          name: "Uptime",
          value: `${humanizeMilliseconds(Date.now() - cache.startTime)}`,
          inline: true,
        },
        {
          name: "Ping",
          value: ping,
          inline: true,
        },
      ],
    });
  },
});
