import { join } from "node:path";
import type { City } from "../types/City.ts";
import { DATA_DIR } from "../utils/constants.ts";
import { readJsonFile, writeJsonFile } from "./jsonFile.ts";

export const CITIES_FILE = join(DATA_DIR, "cities.json");

export function loadCities(): City[] {
  const data = readJsonFile<unknown>(CITIES_FILE);
  return Array.isArray(data) ? (data as City[]) : [];
}

export function saveCities(cities: City[]): void {
  writeJsonFile(CITIES_FILE, cities);
}
