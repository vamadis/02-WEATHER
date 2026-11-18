import type { City } from "../types/City.ts";
import type { Settings } from "../types/Settings.ts";
import type { Unit } from "../types/Weather.ts";
import { getWeather } from "../api/weather.ts";
import { printWeather, showInfo } from "../presentation/output.ts";

// Muestra el clima de la ciudad default
export async function showDefaultCityWeather(settings: Settings): Promise<void> {
  if (settings.defaultCity === null) {
    showInfo("No hay ciudad default. Usa la opción 5.");
    return;
  }
  await showCityWeather(settings.defaultCity, settings.unit);
}

// Muestra el clima de todas las ciudades guardadas
export async function showAllCitiesWeather(
  cities: City[],
  settings: Settings,
): Promise<void> {
  if (cities.length === 0) {
    showInfo("No hay ciudades guardadas.");
    return;
  }
  for (const city of cities) {
    await showCityWeather(city, settings.unit);
  }
  console.log("");
}

// Obtiene y muestra el clima actual de una ciudad
export async function showCityWeather(city: City, unit: Unit): Promise<void> {
  const weather = await getWeather(city.lat, city.lon, unit);
  printWeather(city, weather, unit);
}
