import { cache } from "../../cache.ts";
import { stringToMilliseconds } from "../utils/helpers.ts";

cache.arguments.set("duration", {
  name: "duration",
  execute: function (_argument, parameters) {
    const [time] = parameters;
    if (!time) return;

    return stringToMilliseconds(time);
  },
});
