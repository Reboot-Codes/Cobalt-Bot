import { startBot } from './deps.ts';
import { logger } from './src/utils/logger.ts';
import { importDirectory, fileLoader } from './src/utils/helpers.ts';
import { config } from './config.ts';
import { cache } from './cache.ts';

const log = logger({ name: "Main" });

log.info("Starting Up, this might take a while...");
cache.startTime = Date.now();

await Promise.all(
  [
    "./src/commands",
    "./src/inhibitors",
    "./src/events",
    "./src/arguments",
    "./src/monitors",
    "./src/tasks",
    "./src/permissionLevels",
  ].map((path) => importDirectory(Deno.realPathSync(path)))
);
await fileLoader();

await startBot({
  token: config.token,
  intents: ["Guilds", 'GuildMessages'],
  eventHandlers: cache.eventHandlers
}).then(undefined, (err) => {
  log.error('Unable to start bot! Error Below:');
  log.error(err);
  Deno.exit(1);
});