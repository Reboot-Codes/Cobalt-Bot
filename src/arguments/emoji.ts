import { cache as discordCache } from "../../deps.ts";
import { defaultEmojis } from "../utils/constants/default_emojis.ts";
import { emojiUnicode } from "../utils/helpers.ts";
import { cache } from "../../cache.ts";

cache.arguments.set("emoji", {
  name: "emoji",
  execute: function (_argument, parameters, message) {
    let [id] = parameters;
    if (!id) return;

    if (defaultEmojis.has(id)) return id;

    if (id.startsWith("<:") || id.startsWith("<a:")) {
      id = id.substring(id.lastIndexOf(":") + 1, id.length - 1);
    }

    let emoji = discordCache.guilds.get(message.guildId)?.emojis.find((e) => e.id === id);
    if (!emoji) {
      for (const guild of discordCache.guilds.values()) {
        const globalemoji = guild.emojis.find((e) => e.id === id);
        if (!globalemoji) continue;

        emoji = globalemoji;
        break;
      }

      if (!emoji) return;
    }

    return emojiUnicode(emoji);
  },
});
