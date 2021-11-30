import { configs } from "../../config.ts";
import { cache } from "../../cache.ts";
import { PermissionLevels } from "../utils/types/mod.ts";

// The member using the command must be one of the bots support team
cache.permissionLevels.set(PermissionLevels.BOT_SUPPORT, (message) =>
  configs.userIds.botSupport.includes(message.authorId)
);
