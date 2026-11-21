import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import type { City } from "../../src/types/City.ts";
import type { Unit, Weather } from "../../src/types/Weather.ts";

// Estado compartido por los mocks de presentation/ (input y output)
export type WeatherPrint = { city: City; weather: Weather; unit: Unit };

export type TestState = {
  answers: string[];
  info: string[];
  error: string[];
  warning: string[];
  success: string[];
  cityLists: City[][];
  weatherPrints: WeatherPrint[];
};

type Holder = {
  __weatherTestDataDir?: string;
  __weatherTestState?: TestState;
  __weatherTestCleanup?: boolean;
};

// Anclaje en globalThis: única instancia aunque el preload se ejecute por cada archivo de tests
const holder = globalThis as unknown as Holder;

// DATA_DIR temporal por run de tests; nunca toca ~/.weather-cli real
export const dataDir: string = (holder.__weatherTestDataDir ??= mkdtempSync(
  join(tmpdir(), "weather-tests-"),
));

export const state: TestState = (holder.__weatherTestState ??= {
  answers: [],
  info: [],
  error: [],
  warning: [],
  success: [],
  cityLists: [],
  weatherPrints: [],
});

// Vuelve al estado inicial entre tests (limpia en el lugar para que los
// mocks ya instalados —que comparten estas referencias— lo perciban)
export function resetState(): void {
  state.answers.length = 0;
  state.info.length = 0;
  state.error.length = 0;
  state.warning.length = 0;
  state.success.length = 0;
  state.cityLists.length = 0;
  state.weatherPrints.length = 0;
}

// Borra cities.json / settings.json / config.json entre tests de storage
export function cleanDataDir(): void {
  rmSync(dataDir, { recursive: true, force: true });
}

if (!holder.__weatherTestCleanup) {
  holder.__weatherTestCleanup = true;
  process.on("exit", () => rmSync(dataDir, { recursive: true, force: true }));
}
