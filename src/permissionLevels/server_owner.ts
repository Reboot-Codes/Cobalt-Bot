import { cache } from "../../cache.ts";
import { PermissionLevels } from "../utils/types/mod.ts";

// The member using the command must be an server owner.
cache.permissionLevels.set(PermissionLevels.SERVER_OWNER, (message) => message.guild?.ownerId === message.authorId);
