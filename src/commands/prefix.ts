import { cache } from "../../cache.ts";
import { PermissionLevels } from "../utils/types/mod.ts";
import { createCommand, createSubcommand, sendEmbed, getTime } from "../utils/helpers.ts";
import { parsePrefix } from "../monitors/command-handler.ts";
// import { db } from "../database/database.ts";

// This command will only execute if there was no valid sub command: !prefix
createCommand({
  name: "prefix",
  arguments: [
    {
      name: "subcommand",
      type: "subcommand",
      required: false,
    },
  ] as const,
  guildOnly: true,
  permissionLevels: [PermissionLevels.MEMBER],
  execute: (message) => {
    sendEmbed(message.channelId, {
      title: 'Prefix Info',
      description: `**Current Prefix**: \`${parsePrefix(message.guildId)}\``,
      footer: {
        text: `As of: ${getTime()}`
      }
    })
  },
});

/*/ Create a subcommand for when users do !prefix set $
createSubcommand("prefix", {
  name: "set",
  arguments: [
    {
      name: "prefix",
      type: "string",
      required: true,
      missing: (message) => {
        message.reply(`Please provide a prefix`);
      },
    },
  ] as const,
  permissionLevels: [PermissionLevels.ADMIN],
  execute: (message, args) => {
    if (args.prefix.length > 3) {
      return message.reply("Prefix input too long");
    }

    const oldPrefix = parsePrefix(message.guildId);
    cache.guildPrefixes.set(message.guildId, args.prefix);
    db.guilds.update(message.guildId.toString(), { prefix: args.prefix });

    const embed = new Embed()
      .setTitle("Success, prefix was changed")
      .setDescription([`**Old Prefix**: \`${oldPrefix}\``, `**New Prefix**: \`${args.prefix}\``])
      .setTimestamp();

    return message.send({ embed });
  },
});
*/