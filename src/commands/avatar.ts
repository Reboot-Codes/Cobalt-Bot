import {
  avatarURL,
  //  DiscordApplicationCommandOptionTypes,
  //  DiscordInteractionResponseTypes,
  //  sendInteractionResponse,
  snowflakeToBigint,
} from "../../deps.ts";
import { createCommand } from "../utils/helpers.ts";
import { sendEmbed } from "../utils/helpers.ts";
//import { logger } from "../utils/logger.ts";

//const log = logger({ name: "Command: Avatar" });

createCommand({
  name: `avatar`,
  guildOnly: true,
  description: "Get the avatar link for yourself or another member",
  /* slash: {
    enabled: true,
    guild: true,
    global: false,
    advanced: true,
    options: [
      {
        required: false,
        name: "commands/avatar:USER_NAME",
        description: "commands/avatar:USER_DESCRIPTION",
        type: DiscordApplicationCommandOptionTypes.User,
      },
    ],
    async execute(data, member) {
      const arg = data.data?.options?.[0];

      if (arg?.type === DiscordApplicationCommandOptionTypes.User && arg?.value) {
        const targetUser = data.data?.resolved?.users?.[arg.value as string];
        if (!targetUser) return;

        const url = avatarURL(snowflakeToBigint(targetUser.id), Number(targetUser.discriminator), {
          avatar: targetUser.avatar ?? undefined,
          size: 2048,
        });

        return await sendInteractionResponse(snowflakeToBigint(data.id), data.token, {
          private: false,
          type: DiscordInteractionResponseTypes.ChannelMessageWithSource,
          data: {
            embeds: [
              {
                author: {
                  name: `${targetUser.username}#${targetUser?.discriminator}`,
                  iconUrl: url,
                },
                image: {
                  url,
                },
              },
            ],
          },
        }).catch(log.error);
      }

      if (!member) return;

      return await sendInteractionResponse(snowflakeToBigint(data.id), data.token, {
        type: DiscordInteractionResponseTypes.ChannelMessageWithSource,
        data: {
          embeds: [
            {
              author: {
                name: member.tag,
                iconUrl: member.avatarURL,
              },
              image: {
                url: member.makeAvatarURL({ size: 2048 }),
              },
            },
          ],
        },
      }).catch(log.error);
    },
  }, */
  execute: (message) => {
    const mentioned = message.mentions?.[0];

    if (mentioned !== undefined) {
      sendEmbed(message.channelId, {
        author: {
          name: `${mentioned.username}#${mentioned.discriminator}`,
          iconUrl: avatarURL(
            BigInt(mentioned.id),
            Number(mentioned.discriminator),
            { avatar: mentioned.id, size: 2048, animated: false },
          ),
        },
        image: {
          url: avatarURL(
            BigInt(mentioned.id),
            Number(mentioned.discriminator),
            { avatar: mentioned.id, size: 2048, animated: true },
          ),
        },
      });
    } else {
      sendEmbed(message.channelId, {
        author: {
          name: message.tag,
          iconUrl: avatarURL(
            message.authorId,
            Number(message.tag.split("#")[1]),
            { avatar: message.authorId, size: 2048, animated: false },
          ),
        },
        image: {
          url: avatarURL(message.authorId, Number(message.tag.split("#")[1]), {
            avatar: message.authorId,
            size: 2048,
            animated: true,
          }),
        },
      });
    }
  },
});
