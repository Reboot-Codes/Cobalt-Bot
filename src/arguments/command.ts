import { cache } from "../../cache.ts";

cache.arguments.set("command", {
  name: "command",
  execute: function (_argument, parameters) {
    const [name] = parameters;
    if (!name) return;

    const commandName = name.toLowerCase();
    const command = cache.commands.get(commandName);
    if (command) return command;

    // Check if its an alias
    return cache.commands.find((cmd) => Boolean(cmd.aliases?.includes(commandName)));
  },
});
