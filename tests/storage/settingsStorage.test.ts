import { writeFileSync } from "node:fs";
import { beforeEach, describe, expect, test } from "bun:test";
import { loadSettings, saveSettings, SETTINGS_FILE } from "../../src/storage/settingsStorage.ts";
import { writeJsonFile } from "../../src/storage/jsonFile.ts";
import { cleanDataDir } from "../helpers/testState.ts";
import { lima } from "../helpers/fixtures.ts";

beforeEach(cleanDataDir);

describe("loadSettings", () => {
  test("defaults si no hay archivo", () => {
    expect(loadSettings()).toEqual({ defaultCity: null, unit: "celsius" });
  });

  test("defaults si el archivo está corrupto", () => {
    writeJsonFile(SETTINGS_FILE, {});
    writeFileSync(SETTINGS_FILE, "no-json", "utf-8");
    expect(loadSettings()).toEqual({ defaultCity: null, unit: "celsius" });
  });

  test("unidad inválida se normaliza a celsius", () => {
    writeJsonFile(SETTINGS_FILE, { unit: "kelvin" });
    expect(loadSettings().unit).toBe("celsius");
  });

  test("defaultCity ausente se lee como null", () => {
    writeJsonFile(SETTINGS_FILE, { unit: "fahrenheit" });
    expect(loadSettings()).toEqual({ defaultCity: null, unit: "fahrenheit" });
  });

  test("cada load devuelve una copia independiente", () => {
    const first = loadSettings();
    first.unit = "fahrenheit";
    expect(loadSettings().unit).toBe("celsius");
  });
});

describe("saveSettings + loadSettings", () => {
  test("round-trip", () => {
    saveSettings({ defaultCity: lima, unit: "fahrenheit" });
    expect(loadSettings()).toEqual({ defaultCity: lima, unit: "fahrenheit" });
  });
});
