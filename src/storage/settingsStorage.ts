import { join } from "node:path";
import type { Settings } from "../types/Settings.ts";
import type { Unit } from "../types/Weather.ts";
import { DATA_DIR } from "../utils/constants.ts";
import { readJsonFile, writeJsonFile } from "./jsonFile.ts";

export const SETTINGS_FILE = join(DATA_DIR, "settings.json");

const DEFAULT_SETTINGS: Settings = {
  defaultCity: null,
  unit: "celsius",
};

export function loadSettings(): Settings {
  const data = readJsonFile<Partial<Settings>>(SETTINGS_FILE);
  if (data === null) {
    return structuredClone(DEFAULT_SETTINGS);
  }
  return {
    defaultCity: data.defaultCity ?? null,
    unit: normalizeUnit(data.unit),
  };
}

export function saveSettings(settings: Settings): void {
  writeJsonFile(SETTINGS_FILE, settings);
}

function normalizeUnit(value: unknown): Unit {
  return value === "fahrenheit" ? "fahrenheit" : "celsius";
}
