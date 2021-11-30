import {
  DiscordenoMessage,
  botId,
  hasChannelPermissions,
  hasGuildPermissions,
  botHasChannelPermissions,
  botHasGuildPermissions,
} from '../../deps.ts';
import { cache } from '../../cache.ts';
import { fetchMember } from '../utils/helpers.ts';

cache.eventHandlers.messageCreate = (message: DiscordenoMessage) => {
  const isDM = message.guildId == BigInt(0);
  cache.monitors.forEach(async (monitor) => {
    // Check conditions for the monitor
    // Using !== is important because we're defaulting to false
    if (monitor.ignoreBots !== false && message.isBot) return;
    if (monitor.ignoreDM !== false && isDM) return;
    if (monitor.ignoreEdits && message.editedTimestamp) return;
    if (monitor.ignoreOthers && message.authorId !== botId) return;

    // No permissions needed
    if (
      !monitor.botChannelPermissions?.length &&
      !monitor.botServerPermissions?.length &&
      !monitor.userChannelPermissions?.length &&
      !monitor.userServerPermissions?.length
    ) {
      return monitor.execute(message);
    }

    // If permissions are needed, message can't be a DM!
    if (isDM) return;

    // Fetch the member if not in cache, in rare rare edge cases it can be undefined
    const member = await fetchMember(message.guildId, message.authorId);
    if (!member) return;

    const permissionCheckResults = await Promise.all([
      // Check if the message author has the necessary channel permissions to run this monitor
      monitor.userChannelPermissions
        ? hasChannelPermissions(message.channelId, member, monitor.userChannelPermissions)
        : undefined,
      // Check if the message author has the necessary guild permissions to run this monitor
      monitor.userServerPermissions
        ? hasGuildPermissions(message.guildId, member, monitor.userServerPermissions)
        : undefined,
      // Check if the bot has the necessary channel permissions to run this monitor in this channel.
      monitor.botChannelPermissions
        ? botHasChannelPermissions(message.channelId, monitor.botChannelPermissions)
        : undefined,
      // Check if the bot has the necessary guild permissions to run this monitor
      monitor.botServerPermissions ? botHasGuildPermissions(message.guildId, monitor.botServerPermissions) : undefined,
    ]);

    // All checks must pass
    if (permissionCheckResults.includes(false)) return;

    return monitor.execute(message);
  })
}