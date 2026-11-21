import { existsSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { beforeEach, describe, expect, test } from "bun:test";
import { CITIES_FILE, loadCities, saveCities } from "../../src/storage/citiesStorage.ts";
import { loadSettings, saveSettings, SETTINGS_FILE } from "../../src/storage/settingsStorage.ts";
import { migrateLegacyConfig } from "../../src/storage/migration.ts";
import { writeJsonFile } from "../../src/storage/jsonFile.ts";
import { cleanDataDir, dataDir } from "../helpers/testState.ts";
import { lima, madrid } from "../helpers/fixtures.ts";

const legacyFile = join(dataDir, "config.json");

beforeEach(cleanDataDir);

describe("migrateLegacyConfig", () => {
  test("no hace nada si no hay config.json legacy", () => {
    migrateLegacyConfig();
    expect(existsSync(CITIES_FILE)).toBe(false);
    expect(existsSync(SETTINGS_FILE)).toBe(false);
  });

  test("no hace nada si el config.json legacy está corrupto", () => {
    writeJsonFile(legacyFile, {});
    writeFileSync(legacyFile, "no-json", "utf-8");
    migrateLegacyConfig();
    expect(existsSync(CITIES_FILE)).toBe(false);
    expect(existsSync(SETTINGS_FILE)).toBe(false);
  });

  test("divide el legacy en cities.json + settings.json", () => {
    writeJsonFile(legacyFile, { cities: [madrid], defaultCity: lima, unit: "fahrenheit" });
    migrateLegacyConfig();
    expect(loadCities()).toEqual([madrid]);
    expect(loadSettings()).toEqual({ defaultCity: lima, unit: "fahrenheit" });
  });

  test("no sobrescribe cities.json existente", () => {
    writeJsonFile(legacyFile, { cities: [madrid] });
    saveCities([lima]);
    migrateLegacyConfig();
    expect(loadCities()).toEqual([lima]);
  });

  test("no sobrescribe settings.json existente", () => {
    writeJsonFile(legacyFile, { unit: "fahrenheit" });
    saveSettings({ defaultCity: null, unit: "celsius" });
    migrateLegacyConfig();
    expect(loadSettings()).toEqual({ defaultCity: null, unit: "celsius" });
  });

  test("nunca borra el config.json legacy", () => {
    writeJsonFile(legacyFile, { cities: [madrid] });
    migrateLegacyConfig();
    expect(existsSync(legacyFile)).toBe(true);
  });
});
