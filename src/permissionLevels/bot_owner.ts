import { configs } from "../../config.ts";
import { cache } from "../../cache.ts";
import { PermissionLevels } from "../utils/types/mod.ts";

// The member using the command must be one of the bots dev team that has owner level access
cache.permissionLevels.set(PermissionLevels.BOT_OWNER, (message) =>
  configs.userIds.botOwners.includes(message.authorId)
);
