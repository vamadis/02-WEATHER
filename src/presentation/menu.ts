import type { City } from "../types/City.ts";
import type { MenuOption } from "../types/MenuOption.ts";
import type { Settings } from "../types/Settings.ts";
import { addCity } from "../actions/addCity.ts";
import { showAllCitiesWeather, showDefaultCityWeather } from "../actions/getWeather.ts";
import { listCities } from "../actions/listCities.ts";
import { removeCity } from "../actions/removeCity.ts";
import { setDefaultCity } from "../actions/setDefaultCity.ts";
import { toggleUnit } from "../actions/settings.ts";
import { loadCities, saveCities } from "../storage/citiesStorage.ts";
import { loadSettings, saveSettings } from "../storage/settingsStorage.ts";
import { bold, cyan } from "../utils/colors.ts";
import { unitSymbol } from "../utils/format.ts";
import { ask, closePrompt } from "./input.ts";
import { showError, showSuccess } from "./output.ts";

const BORDER = "════════════════════════════════════════";
const TITLE = "         WEATHER CLI";

type MenuItem = {
  key: string;
  option: MenuOption;
  label: (cities: City[], settings: Settings) => string;
};

const MENU_ITEMS: MenuItem[] = [
  { key: "1", option: "default-city-weather", label: () => "Clima de ciudad default" },
  { key: "2", option: "all-cities-weather", label: (cities) => `Clima de todas las ciudades (${cities.length})` },
  { key: "3", option: "add-city", label: () => "Buscar y agregar ciudad" },
  { key: "4", option: "remove-city", label: () => "Eliminar ciudad" },
  { key: "5", option: "set-default-city", label: () => "Establecer ciudad default" },
  { key: "6", option: "list-cities", label: () => "Listar ciudades guardadas" },
  { key: "8", option: "settings", label: (_cities, settings) => `Ajustes (${unitSymbol(settings.unit)})` },
  { key: "9", option: "exit", label: () => "Salir" },
];

export async function runMenu(): Promise<void> {
  const cities = loadCities();
  const settings = loadSettings();

  while (true) {
    renderMenu(cities, settings);
    const key = await ask("  Selecciona una opción: ");
    try {
      const shouldExit = await handleOption(key, cities, settings);
      if (shouldExit) {
        closePrompt();
        return;
      }
      saveCities(cities);
      saveSettings(settings);
    } catch (err) {
      showError(`Error: ${errorMessage(err)}`);
    }
  }
}

function renderMenu(cities: City[], settings: Settings): void {
  console.log(cyan(BORDER));
  console.log(cyan(bold(TITLE)));
  console.log(cyan(BORDER));
  for (const item of MENU_ITEMS) {
    console.log(cyan(`  ${item.key}. ${item.label(cities, settings)}`));
  }
  console.log(cyan(BORDER));
}

async function handleOption(
  key: string,
  cities: City[],
  settings: Settings,
): Promise<boolean> {
  const item = MENU_ITEMS.find((entry) => entry.key === key);
  if (item === undefined) {
    showError("Opción inválida.");
    return false;
  }
  switch (item.option) {
    case "default-city-weather":
      await showDefaultCityWeather(settings);
      return false;
    case "all-cities-weather":
      await showAllCitiesWeather(cities, settings);
      return false;
    case "add-city":
      await addCity(cities, settings);
      return false;
    case "remove-city":
      await removeCity(cities);
      return false;
    case "list-cities":
      listCities(cities);
      return false;
    case "set-default-city":
      await setDefaultCity(cities, settings);
      return false;
    case "settings":
      toggleUnit(settings);
      return false;
    case "exit":
      showSuccess("¡Hasta pronto!");
      return true;
  }
}

function errorMessage(err: unknown): string {
  return err instanceof Error ? err.message : String(err);
}
