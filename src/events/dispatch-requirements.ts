import { cache } from "../../cache.ts";
import {
  botId,
  cache as discordCache,
  delay,
  getChannels,
  getGuild,
  getMember,
  Guild,
  snowflakeToBigint,
  structures,
} from "../../deps.ts";
import { logger } from "../utils/logger.ts";

const log = logger({ name: "Event: Dispatch Requirements" });

const processing = new Set<bigint>();

cache.eventHandlers.dispatchRequirements = async function (data, shardID) {
  if (!cache.fullyReady) return;

  // DELETE MEANS WE DONT NEED TO FETCH. CREATE SHOULD HAVE DATA TO CACHE
  if (data.t && ["GUILD_CREATE", "GUILD_DELETE"].includes(data.t)) return;

  const id = snowflakeToBigint(
    (data.t && ["GUILD_UPDATE"].includes(data.t)
      ? // deno-lint-ignore no-explicit-any
        (data.d as any)?.id
      : // deno-lint-ignore no-explicit-any
        (data.d as any)?.guild_id) ?? ""
  );

  if (!id || cache.activeGuildIDs.has(id)) return;

  // If this guild is in cache, it has not been swept and we can cancel
  if (discordCache.guilds.has(id)) {
    cache.activeGuildIDs.add(id);
    return;
  }

  if (processing.has(id)) {
    log.info(`New Guild ID already being processed: ${id} in ${data.t} event`);

    let runs = 0;
    do {
      await delay(500);
      ++runs;
    } while (processing.has(id) && runs < 40);

    if (!processing.has(id)) return;

    return log.info(`Already processed guild was not successfully fetched:  ${id} in ${data.t} event`);
  }

  processing.add(id);

  // New guild id has appeared, fetch all relevant data
  log.info(`New Guild ID has appeared: ${id} in ${data.t} event`);

  const rawGuild = (await getGuild(id, {
    counts: true,
    addToCache: false,
  }).catch(log.info)) as Guild | undefined;

  if (!rawGuild) {
    processing.delete(id);
    return log.info(`[Guild ID ${id} failed to fetch.`);
  }

  log.info(`Guild ID ${id} has been found. ${rawGuild.name}`);

  const [channels, botMember] = await Promise.all([
    getChannels(id, false),
    getMember(id, botId, { force: true }),
  ]).catch((error) => {
    log.info(error);
    return [];
  });

  if (!botMember || !channels) {
    processing.delete(id);
    return log.info(`Guild ID ${id} Name: ${rawGuild.name} failed. Unable to get botMember or channels`);
  }

  const guild = await structures.createDiscordenoGuild(rawGuild, shardID);

  // Add to cache
  discordCache.guilds.set(id, guild);
  cache.dispatchedGuildIDs.delete(id);
  channels.forEach((channel) => {
    cache.dispatchedChannelIDs.delete(channel.id);
    discordCache.channels.set(channel.id, channel);
  });

  processing.delete(id);

  log.info(`Guild ID ${id} Name: ${guild.name} completely loaded.`);
};

// Events that have
/**
 * channelCreate
 * channelUpdate
 * channelDelete
 * channelPinsUpdate
 * guildBanAdd
 * guildBanRemove
 * guildEmojisUpdate
 * guildIntegrationsUpdate
 * guildMemberAdd
 * guildMemberRemove
 * guildMemberUpdate
 * guildMembersChunk
 * guildRoleCreate
 * guildRoleUpdate
 * guildRoleDelete
 * inviteCreate
 * inviteDelete
 * messageCreate
 * messageUpdate
 * messageDelete
 * messageDeleteBulk
 * messageReactionAdd
 * messageReactionRemove
 * messageReactionRemoveAll
 * messageReactionRemoveEmoji
 * presenceUpdate
 * typingStart
 * voiceStateUpdate
 * voiceServerUpdate
 * webhooksUpdate
 */

// Events that dont have guild_id
/**
 * guildCreate id
 * guildUpdate id
 * guildDelete id
 */

export function sweepInactiveGuildsCache() {
  for (const guild of discordCache.guilds.values()) {
    if (cache.activeGuildIDs.has(guild.id)) continue;

    // This is inactive guild. Not a single thing has happened for atleast 30 minutes.
    // Not a reaction, not a message, not any event!
    discordCache.guilds.delete(guild.id);
    cache.dispatchedGuildIDs.add(guild.id);
  }

  // Remove all channel if they were dispatched
  discordCache.channels.forEach((channel) => {
    if (!cache.dispatchedGuildIDs.has(channel.guildId)) return;

    discordCache.channels.delete(channel.id);
    cache.dispatchedChannelIDs.add(channel.id);
  });

  // Reset activity for next interval
  cache.activeGuildIDs.clear();
}
