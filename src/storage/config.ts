import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { dirname, join } from "node:path";
import type { Config, Unit } from "../types.ts";

const CONFIG_DIR = join(homedir(), ".weather-cli");
const CONFIG_FILE = join(CONFIG_DIR, "config.json");

const DEFAULT_CONFIG: Config = {
  cities: [],
  defaultCity: null,
  unit: "celsius",
};

export function loadConfig(): Config {
  if (!existsSync(CONFIG_FILE)) {
    return structuredClone(DEFAULT_CONFIG);
  }
  try {
    const raw = readFileSync(CONFIG_FILE, "utf-8");
    const parsed = JSON.parse(raw) as Partial<Config>;
    return {
      cities: Array.isArray(parsed.cities) ? parsed.cities : [],
      defaultCity: parsed.defaultCity ?? null,
      unit: normalizeUnit(parsed.unit),
    };
  } catch {
    return structuredClone(DEFAULT_CONFIG);
  }
}

export function saveConfig(config: Config): void {
  if (!existsSync(CONFIG_DIR)) {
    mkdirSync(dirname(CONFIG_FILE), { recursive: true });
  }
  writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2), "utf-8");
}

function normalizeUnit(value: unknown): Unit {
  return value === "fahrenheit" ? "fahrenheit" : "celsius";
}
