import { cache } from "../../cache.ts";
import { PermissionLevels } from "../utils/types/mod.ts";

// The default level where any member can use the command
cache.permissionLevels.set(PermissionLevels.MEMBER, () => true);
