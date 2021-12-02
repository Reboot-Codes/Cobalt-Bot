import { Collection, DiscordenoMessage } from './deps.ts';
import { CustomEvents, Monitor, Task } from './src/utils/types/mod.ts';
import { Argument, Command, MessageCollector, ReactionCollector, ButtonCollector, PermissionLevels } from './src/utils/types/mod.ts';

export const cache = {
  fullyReady: false,
  eventHandlers: {} as CustomEvents,
  activeGuildIDs: new Set<bigint>(),
  dispatchedGuildIDs: new Set<bigint>(),
  dispatchedChannelIDs: new Set<bigint>(),
  arguments: new Collection<string, Argument>(),
  // deno-lint-ignore no-explicit-any
  commands: new Collection<string, Command<any>>(),
  inhibitors: new Collection<
    string,
    (
      message: DiscordenoMessage,
      // deno-lint-ignore no-explicit-any
      command: Command<any>
    ) => Promise<boolean> | boolean
  >(),
  permissionLevels: new Collection<
    PermissionLevels,
    (
      message: DiscordenoMessage,
      // deno-lint-ignore no-explicit-any
      command: Command<any>
    ) => Promise<boolean> | boolean
  >(),
  monitors: new Collection<string, Monitor>(),
  tasks: new Collection<string, Task>(),
  runningTasks: { initialTimeouts: [] as number[], intervals: [] as number[] },
  guildPrefixes: new Collection<bigint, string>(),
  messageCollectors: new Collection<bigint, MessageCollector>(),
  reactionCollectors: new Collection<bigint, ReactionCollector>(),
  buttonCollectors: new Collection<bigint, ButtonCollector>(),
  startTime: {} as number,
}