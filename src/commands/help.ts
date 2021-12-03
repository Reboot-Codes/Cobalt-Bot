// deno-lint-ingore-file no-explicit-any
import { createCommand, sendEmbed } from "../utils/helpers.ts";
import { cache } from "../../cache.ts";
import { Embed, EmbedField } from "../../deps.ts";

createCommand({
  name: "help",
  description:
    "Pass in a command to receive information about that command, or receive a list of commands",
  usage: ["[command]"],
  arguments: [
    {
      name: 'command',
      type: 'string',
      required: false
    }
  ],
  execute: (message, args) => {
    if (args?.command) {
      const embed: Embed = {};
      cache.commands.forEach((command) => {
        if (command.name === args.command) {
          embed.title = `\`${command.name}\``;
          let aliases = '';
          String(command.aliases).split(",").forEach((alias) => {
            aliases += `\`${alias}\` `;
          });
          
          embed.description = `${command.aliases ? `Aliases: ${aliases}\n` : ``}${command.description}${command.usage ? `\n\nUsage: ${String(command.usage)}` : ``}`;
        } else if (command.aliases?.find((value) => {
          if (value === args.command) return true;
        })) {
          embed.title = `\`${command.name}\``;
          let aliases = '';
          String(command.aliases).split(",").forEach((alias) => {
            aliases += `\`${alias}\` `;
          });

          embed.description = `${command.aliases ? `Aliases: ${aliases}\n` : ``}${command.description}${command.usage ? `\n\nUsage: ${String(command.usage)}` : ``}`;
        }
      })

      if (embed.title !== undefined) {
        sendEmbed(message.channelId, embed);
      } else {
        sendEmbed(message.channelId, {
          title: `Sorry, That Command Doesn't Exist`,
          description: `You may want to send a command request to the creator: @RebootHas_Disc#9645`
        })
      }
    } else {
      const commandArr: EmbedField[] = [];
      cache.commands.forEach((command) => {
        if (command.name === "help") {
          return;
        } else {
          let aliases = '';
          String(command.aliases).split(",").forEach((alias) => {
            aliases += `\`${alias}\` `;
          });

          commandArr.push({
            name: `\`${command.name}\``,
            value: `${command.aliases ? `Aliases: ${aliases}\n` : ``}${command.description}${command.usage ? `\n\nUsage: ${String(command.usage)}` : ``}`,
            inline: false,
          });
        }
      });

      sendEmbed(message.channelId, {
        title: "Help Menu",
        fields: [...commandArr],
      });
    }
  },
});
