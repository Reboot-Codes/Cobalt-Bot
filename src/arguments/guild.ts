import { cache as discordCache, snowflakeToBigint } from "../../deps.ts";
import { cache } from "../../cache.ts";

cache.arguments.set("guild", {
  name: "guild",
  execute: function (_argument, parameters) {
    const [id] = parameters;
    if (!id) return;

    return discordCache.guilds.get(snowflakeToBigint(id));
  },
});
