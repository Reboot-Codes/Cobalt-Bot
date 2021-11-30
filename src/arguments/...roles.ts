import { cache as discordCache, snowflakeToBigint } from "../../deps.ts";
import { cache } from "../../cache.ts";

cache.arguments.set("...roles", {
  name: "...roles",
  execute: function (_argument, parameters, message) {
    if (!parameters.length) return;

    const guild = discordCache.guilds.get(message.guildId);
    if (!guild) return;

    return parameters.map((word) => {
      const roleIdOrName = word.startsWith("<@&") ? word.substring(3, word.length - 1) : word.toLowerCase();

      const role = /^[\d+]{17,}$/.test(roleIdOrName)
        ? guild.roles.get(snowflakeToBigint(roleIdOrName))
        : guild.roles.find((r) => r.name.toLowerCase() === roleIdOrName);
      if (role) return role;
    });
  },
});
