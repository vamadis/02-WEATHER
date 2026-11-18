import { homedir } from "node:os";
import { join } from "node:path";

// Directorio de datos locales de la app
export const DATA_DIR = join(homedir(), ".weather-cli");
