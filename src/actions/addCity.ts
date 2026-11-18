import type { City } from "../types/City.ts";
import type { Settings } from "../types/Settings.ts";
import { ask } from "../presentation/input.ts";
import { showError, showWarning } from "../presentation/output.ts";
import { findCity, isSameCity } from "../utils/city.ts";
import { showCityWeather } from "./getWeather.ts";

// Busca una ciudad y la agrega a la lista de guardadas
export async function addCity(cities: City[], settings: Settings): Promise<void> {
  const name = await ask("\n  Ciudad a buscar: ");
  if (name === "") return;
  const city = await findCity(name);
  if (city === null) {
    showError(`No se encontró "${name}".`);
    return;
  }
  if (isCitySaved(cities, settings, city)) {
    showWarning(`"${city.name}" ya está guardada.`);
    return;
  }
  cities.push(city);
  await showCityWeather(city, settings.unit);
}

// Está guardada si está en la lista o es la ciudad default
function isCitySaved(cities: City[], settings: Settings, city: City): boolean {
  const inList = cities.some((saved) => isSameCity(saved, city));
  const isDefault = settings.defaultCity !== null && isSameCity(settings.defaultCity, city);
  return inList || isDefault;
}
