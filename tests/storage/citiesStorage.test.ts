import { beforeEach, describe, expect, test } from "bun:test";
import { CITIES_FILE, loadCities, saveCities } from "../../src/storage/citiesStorage.ts";
import { writeJsonFile } from "../../src/storage/jsonFile.ts";
import { cleanDataDir } from "../helpers/testState.ts";
import { lima, madrid } from "../helpers/fixtures.ts";

beforeEach(cleanDataDir);

describe("loadCities", () => {
  test("lista vacía si no hay archivo", () => {
    expect(loadCities()).toEqual([]);
  });

  test("lista vacía si el contenido no es un array", () => {
    writeJsonFile(CITIES_FILE, { cities: true });
    expect(loadCities()).toEqual([]);
  });
});

describe("saveCities + loadCities", () => {
  test("round-trip", () => {
    saveCities([madrid, lima]);
    expect(loadCities()).toEqual([madrid, lima]);
  });
});
