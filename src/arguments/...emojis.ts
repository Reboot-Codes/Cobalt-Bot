import { cache } from "../../cache.ts";
import { cache as discordCache } from "../../deps.ts";
import { defaultEmojis } from "../utils/constants/default_emojis.ts";
import { emojiUnicode } from "../utils/helpers.ts";

cache.arguments.set("...emojis", {
  name: "...emojis",
  execute: function (_argument, parameters, message) {
    if (!parameters.length) return;

    const emojis = parameters.map((e) =>
      e.startsWith("<:") || e.startsWith("<a:") ? e.substring(e.lastIndexOf(":") + 1, e.length - 1) : e
    );

    return emojis
      .map((emoji) => {
        if (defaultEmojis.has(emoji)) return emoji;

        let guildEmoji = discordCache.guilds.get(message.guildId)?.emojis.find((e) => e.id === emoji);
        if (!guildEmoji) {
          for (const guild of discordCache.guilds.values()) {
            const globalemoji = guild.emojis.find((e) => e.id === emoji);
            if (!globalemoji?.id) continue;

            guildEmoji = globalemoji;
            break;
          }
        }

        if (!guildEmoji) return;

        return emojiUnicode(guildEmoji);
      })
      .filter((e) => e);
  },
});
