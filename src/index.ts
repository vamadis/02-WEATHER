import { runMenu } from "./presentation/menu.ts";
import { migrateLegacyConfig } from "./storage/migration.ts";

migrateLegacyConfig();
await runMenu();
