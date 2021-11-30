import { bgBrightCyan, black, Collection } from "../../deps.ts";
import { Task } from "./types/tasks.ts";
import { cache } from "../../cache.ts";
import { logger } from "./logger.ts";

const log = logger({ name: "Task Helper" });

export function registerTasks() {
  for (const task of cache.tasks.values()) {
    cache.runningTasks.initialTimeouts.push(
      setTimeout(async () => {
        log.info(`[TASK: ${bgBrightCyan(black(task.name))}] Started.`);
        try {
          await task.execute();
        } catch (error) {
          log.error(error);
        }

        cache.runningTasks.initialTimeouts.push(
          setInterval(async () => {
            if (!cache.fullyReady) return;
            log.info(`[TASK: ${bgBrightCyan(black(task.name))}] Started.`);
            try {
              await task.execute();
            } catch (error) {
              log.error(error);
            }
          }, task.interval)
        );
      }, task.interval - (Date.now() % task.interval))
    );
  }
}

export function clearTasks() {
  for (const timeout of cache.runningTasks.initialTimeouts) clearTimeout(timeout);
  for (const task of cache.runningTasks.intervals) clearInterval(task);

  cache.tasks = new Collection<string, Task>();
  cache.runningTasks = { initialTimeouts: [], intervals: [] };
}
