import { hasGuildPermissions } from "../../deps.ts";
import { PermissionLevels } from "../utils/types/mod.ts";
import { cache } from "../../cache.ts";

// The member using the command must be an admin. (Required ADMIN server perm.)
cache.permissionLevels.set(PermissionLevels.ADMIN, (message) =>
  hasGuildPermissions(message.guildId, message.authorId, ["ADMINISTRATOR"])
);
