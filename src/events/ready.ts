import {
  cache as discordCache,
  DiscordActivityTypes,
  editBotStatus,
  upsertSlashCommands,
} from "../../deps.ts";
import { cache } from "../../cache.ts";
import { logger, Loglevels } from "../utils/logger.ts";
import { registerTasks } from "../utils/task-helper.ts";
import { Command } from "../utils/types/mod.ts";
import { configs } from "../../config.ts";

const log = logger({ logLevel: Loglevels.Debug, name: "Event: Ready" });

cache.eventHandlers.ready = async () => {
  editBotStatus({
    status: "online",
    activities: [
      {
        name: `commands | v${configs.version}`,
        createdAt: Date.now(),
        type: DiscordActivityTypes.Listening,
      },
    ],
  });

  registerTasks();

  log.info(`Loaded ${cache.arguments.size} Argument(s)`);
  log.info(`Loaded ${cache.commands.size} Command(s)`);
  log.info(`Loaded ${Object.keys(cache.eventHandlers).length} Event(s)`);
  log.info(`Loaded ${cache.inhibitors.size} Inhibitor(s)`);
  log.info(`Loaded ${cache.monitors.size} Monitor(s)`);
  log.info(`Loaded ${cache.tasks.size} Task(s)`);

  cache.fullyReady = true;

  log.info(`Preparing Slash Commands...`);

  const globalCommands = [];
  // deno-lint-ignore no-explicit-any
  const perGuildCommands: Command<any>[] = [];

  for (const command of cache.commands.values()) {
    if (!command.slash?.enabled) continue;

    // THIS COMMAND NEEDS SOME SLASH COMMAND STUFF
    if (command.slash.global) globalCommands.push(command.slash);
    if (command.slash.guild) perGuildCommands.push(command);
  }

  // Global /commands can take upto 1 hour to update in Discord
  if (globalCommands.length) {
    log.info(
      `Updating Global Slash Commands... Any changes will take up to 1 hour to update on discord.`,
    );
    await upsertSlashCommands(globalCommands).catch(log.info);
  }

  // Guild commands update instantly
  await Promise.all(
    discordCache.guilds.map(async (guild) => {
      await upsertSlashCommands(
        perGuildCommands.map((cmd) => {
          // Basic config only
          if (cmd.slash?.advanced === false) {
            return {
              name: cmd.name,
              description: cmd.description ||
                "Error: No description available.",
              options: cmd.slash?.options,
            };
          }

          // Advanced mode config
          const name = cmd.name;
          const description = cmd.name;

          return {
            name: name === "SLASH_NAME" ? cmd.name : name,
            description: description === "SLASH_DESCRIPTION"
              ? cmd.description || "No description available."
              : description,
            options: cmd.slash?.options?.map((option) => {
              const optionName = option.name;
              const optionDescription = option.description;

              return {
                ...option,
                name: optionName,
                description: optionDescription || "No description available.",
              };
            }),
          };
        }),
        guild.id,
      ).catch(log.warn);
      log.info(`Updated Guild ${guild.name} (${guild.id}) Slash Commands...`);
    }),
  );

  log.info("Slash Commands loaded successfully!");

  log.info("Bot started!");
};
