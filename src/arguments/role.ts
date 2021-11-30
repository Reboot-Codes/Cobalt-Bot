import { cache as discordCache, snowflakeToBigint } from "../../deps.ts";
import { cache } from "../../cache.ts";

cache.arguments.set("role", {
  name: "role",
  execute: async function (_argument, parameters, message) {
    const [id] = parameters;
    if (!id) return;

    const guild = discordCache.guilds.get(message.guildId);
    if (!guild) return;

    const roleIdOrName = id.startsWith("<@&") ? id.substring(3, id.length - 1) : id.toLowerCase();

    const role = /^[\d+]{17,}$/.test(roleIdOrName)
      ? guild.roles.get(snowflakeToBigint(roleIdOrName))
      : guild.roles.find((r) => r.name.toLowerCase() === roleIdOrName);
    if (role) return role;

    // No role was found, let's list roles for better user experience.
    const possibleRoles = guild.roles.filter((r) => r.name.toLowerCase().startsWith(roleIdOrName));
    if (!possibleRoles.size) return;

    // TODO: add translations for this response & also make it look better
    await message.reply(
      [
        `A valid role was not found using the name ${id}.`,
        "A few possible roles were found, they are listed below with their name (and id).",
        "Try using the id of the role you wish to use.",
        "",
        possibleRoles.map((r) => `**${r.name}** ${r.id}`).join("\n"),
      ].join("\n")
    );
  },
});
