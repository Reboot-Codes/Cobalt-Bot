// This task will help remove un-used collectors to help keep our cache optimized.
import { cache } from "../../cache.ts";
import { Milliseconds } from "../utils/constants/time.ts";

cache.tasks.set(`collectors`, {
  name: `collectors`,
  // Runs this function once a minute
  interval: Milliseconds.MINUTE,
  execute: () => {
    const now = Date.now();

    cache.messageCollectors.forEach((collector, key) => {
      // This collector has not finished yet.
      if (collector.createdAt + collector.duration > now) return;

      // Remove the collector
      cache.messageCollectors.delete(key);
      // Reject the promise so code can continue in commands.
      return collector.reject("User did not send a message in time.");
    });

    cache.reactionCollectors.forEach((collector, key) => {
      // This collector has not finished yet.
      if (collector.createdAt + collector.duration > now) return;

      // Remove the collector
      cache.reactionCollectors.delete(key);
      // Reject the promise so code can continue in commands.
      return collector.reject("User did not react in time.");
    });

    cache.buttonCollectors.forEach((collector, key) => {
      // This collector has not finished yet.
      if (collector.createdAt + collector.duration > now) return;

      // Remove the collector
      cache.buttonCollectors.delete(key);
      // Reject the promise so code can continue in commands.
      return collector.reject("The button was not pressed in time.");
    });
  },
});
