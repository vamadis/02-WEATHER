import { mock } from "bun:test";
import type { City } from "../../src/types/City.ts";
import type { Unit, Weather } from "../../src/types/Weather.ts";
import { dataDir, state } from "./testState.ts";

// Preload de bunfig.toml: corre antes de que cualquier archivo de tests
// importe módulos de src/. Aísla DATA_DIR del ~/.weather-cli real y
// reemplaza la capa de presentation por mocks controlables desde testState.

mock.module("../../src/utils/constants.ts", () => ({ DATA_DIR: dataDir }));

mock.module("../../src/presentation/input.ts", () => ({
  ask: async (_question: string): Promise<string> => (state.answers.shift() ?? "").trim(),

  askNumber: async (_question: string): Promise<number | null> => {
    const answer = (state.answers.shift() ?? "").trim();
    if (answer === "") return null;
    const value = Number(answer);
    return Number.isInteger(value) ? value : null;
  },

  closePrompt: () => {},
}));

mock.module("../../src/presentation/output.ts", () => ({
  showInfo: (message: string): void => {
    state.info.push(message);
  },
  showError: (message: string): void => {
    state.error.push(message);
  },
  showWarning: (message: string): void => {
    state.warning.push(message);
  },
  showSuccess: (message: string): void => {
    state.success.push(message);
  },
  printCityList: (cities: City[]): void => {
    // Copia defensiva: el código bajo test puede mutar el array después (splice)
    state.cityLists.push([...cities]);
  },
  printWeather: (city: City, weather: Weather, unit: Unit): void => {
    state.weatherPrints.push({ city, weather, unit });
  },
}));
