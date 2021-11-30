import { ComponentInteraction, DiscordInteractionTypes, SlashCommandInteraction } from "../../deps.ts";
import { processButtonCollectors } from "../utils/collectors.ts";
import { cache } from "../../cache.ts";

cache.eventHandlers.interactionCreate = function (data, member) {
  // A slash command was used!
  if (data.type === DiscordInteractionTypes.ApplicationCommand) {
    const command = (data as SlashCommandInteraction).data?.name
      ? cache.commands.get((data as SlashCommandInteraction).data!.name!)
      : undefined;
    if (!command) return;

    command.slash?.execute(data as SlashCommandInteraction, member);
  }

  // Or a button was clicked!
  if (data.type === DiscordInteractionTypes.MessageComponent) {
    processButtonCollectors(data as ComponentInteraction, member);
  }
};
