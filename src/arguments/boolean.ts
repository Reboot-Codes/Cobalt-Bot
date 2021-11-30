import { cache } from "../../cache.ts";

cache.arguments.set("boolean", {
  name: "boolean",
  execute: function (_argument, parameters) {
    const [boolean] = parameters;

    if (["true", "false", "on", "off", "enable", "disable"].includes(boolean)) {
      return ["true", "on", "enable"].includes(boolean);
    }
  },
});
