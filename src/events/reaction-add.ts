import { snowflakeToBigint } from "../../deps.ts";
import { processReactionCollectors } from "../utils/collectors.ts";
import { cache } from "../../cache.ts";

cache.eventHandlers.reactionAdd = function (data, message) {
  // Process reaction collectors.
  if (message) {
    processReactionCollectors(message, data.emoji, snowflakeToBigint(data.userId));
  }
};
