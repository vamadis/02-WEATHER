import { existsSync } from "node:fs";
import { join } from "node:path";
import type { City } from "../types/City.ts";
import { DATA_DIR } from "../utils/constants.ts";
import { readJsonFile } from "./jsonFile.ts";
import { CITIES_FILE, saveCities } from "./citiesStorage.ts";
import { SETTINGS_FILE, saveSettings } from "./settingsStorage.ts";

// Formato del config.json original (antes del split de storage)
type LegacyConfig = {
  cities?: City[];
  defaultCity?: City | null;
  unit?: unknown;
};

const LEGACY_CONFIG_FILE = join(DATA_DIR, "config.json");

// Divide el config.json original en cities.json + settings.json (una sola vez).
// No modifica ni borra el archivo original.
export function migrateLegacyConfig(): void {
  if (!existsSync(LEGACY_CONFIG_FILE)) return;
  const legacy = readJsonFile<LegacyConfig>(LEGACY_CONFIG_FILE);
  if (legacy === null) return;

  if (!existsSync(CITIES_FILE) && Array.isArray(legacy.cities)) {
    saveCities(legacy.cities);
  }
  if (!existsSync(SETTINGS_FILE)) {
    saveSettings({
      defaultCity: legacy.defaultCity ?? null,
      unit: legacy.unit === "fahrenheit" ? "fahrenheit" : "celsius",
    });
  }
}
