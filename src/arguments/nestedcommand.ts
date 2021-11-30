import { cache } from "../../cache.ts";
import { Command } from "../utils/types/mod.ts";

cache.arguments.set("nestedcommand", {
  name: "nestedcommand",
  execute: function (_argument, parameters) {
    let command = cache.commands.get(parameters.join("\n").toLowerCase());
    if (command) return command;

    for (const word of parameters) {
      // deno-lint-ignore no-explicit-any
      const isCommand: Command<any> | undefined = command
        ? // IF A COMMAND WAS FOUND WE SEARCH FOR ITS SUBCOMMANDS
          command.subcommands?.get(word)
        : // ELSE FIND THE VALID COMMAND OR COMMAND BY ITS ALIAS
          cache.commands.get(word) || cache.commands.find((cmd) => Boolean(cmd.aliases?.includes(word)));
      if (!isCommand) continue;

      command = isCommand;
    }

    return command;
  },
});
