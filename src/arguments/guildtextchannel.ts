import { cache as discordCache, ChannelTypes, snowflakeToBigint } from "../../deps.ts";
import { cache } from "../../cache.ts";

const textChannelTypes = [
  ChannelTypes.GuildText,
  ChannelTypes.GuildNews,
  ChannelTypes.GuildNewsThread,
  ChannelTypes.GuildPivateThread,
  ChannelTypes.GuildPublicThread,
];
cache.arguments.set("guildtextchannel", {
  name: "guildtextchannel",
  execute: function (_argument, parameters, message) {
    const [id] = parameters;
    if (!id) return;

    const guild = discordCache.guilds.get(message.guildId);
    if (!guild) return;

    const channelIdOrName = id.startsWith("<#") ? id.substring(2, id.length - 1) : id.toLowerCase();

    const channel = /^[\d+]{17,}$/.test(channelIdOrName)
      ? discordCache.channels.get(snowflakeToBigint(channelIdOrName))
      : discordCache.channels.find((channel) => channel.name === channelIdOrName && channel.guildId === guild.id);

    if (channel?.type === undefined || !textChannelTypes.includes(channel.type)) {
      return;
    }

    return channel;
  },
});
