import { cache as discordCache, snowflakeToBigint } from "../../deps.ts";
import { cache } from "../../cache.ts";
import { fetchMember } from "../utils/helpers.ts";
import { logger } from "../utils/logger.ts";

const log = logger({ name: "Argument Helper: Member" });

cache.arguments.set("member", {
  name: "member",
  execute: async function (_argument, parameters, message) {
    const [id] = parameters;
    if (!id) return;

    const guild = discordCache.guilds.get(message.guildId);
    if (!guild) return;

    const userId = id.startsWith("<@") ? id.substring(id.startsWith("<@!") ? 3 : 2, id.length - 1) : id;

    if (/^[\d+]{17,}$/.test(userId)) {
      const cachedMember = discordCache.members.get(snowflakeToBigint(userId));
      if (cachedMember?.guilds.has(message.guildId)) return cachedMember;
    }

    const cached = discordCache.members.find(
      (member) => member.guilds.has(message.guildId) && member.tag.toLowerCase().startsWith(userId.toLowerCase())
    );
    if (cached) return cached;

    if (!/^[\d+]{17,}$/.test(userId)) return;

    log.debug("Fetching a member with Id from gateway", userId);

    const member = await fetchMember(guild.id, userId);

    return member;
  },
});
