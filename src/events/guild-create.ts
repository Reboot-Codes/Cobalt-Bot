import { cache } from "../../cache.ts";
import { logger } from "../utils/logger.ts";

const log = logger({ name: "Event: Guild Create"})

cache.eventHandlers.guildCreate = function (guild) {
  log.info(`${guild.name} with ${guild.memberCount} members.`);
};
