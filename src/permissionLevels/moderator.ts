import { PermissionLevels } from "../utils/types/mod.ts";
import { hasGuildPermissions } from "../../deps.ts";
import { cache } from "../../cache.ts";

// The member using the command must be a moderator. (Usually has MANAGE_GUILD perm)
cache.permissionLevels.set(PermissionLevels.MODERATOR, (message) =>
  hasGuildPermissions(message.guildId, message.authorId, ["MANAGE_GUILD"])
);
