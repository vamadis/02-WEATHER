import type { City, Config, Unit } from "../types.ts";
import { getCoords } from "../api/geocoding.ts";
import { getForecast } from "../api/forecast.ts";
import { loadConfig, saveConfig } from "../storage/config.ts";
import { ask, closePrompt } from "./prompt.ts";
import { printWeather, unitSymbol } from "./display.ts";

const BORDER = "════════════════════════════════════════";
const TITLE = "         WEATHER CLI";

export async function runMenu(): Promise<void> {
  const config = loadConfig();

  while (true) {
    renderMenu(config);
    const option = await ask("  Selecciona una opción: ");
    try {
      const shouldExit = await handleOption(option, config);
      if (shouldExit) {
        closePrompt();
        return;
      }
      saveConfig(config);
    } catch (err) {
      console.log(`\n  Error: ${errorMessage(err)}\n`);
    }
  }
}

function renderMenu(config: Config): void {
  console.log(BORDER);
  console.log(TITLE);
  console.log(BORDER);
  console.log("  1. Clima de ciudad default");
  console.log(`  2. Clima de todas las ciudades (${config.cities.length})`);
  console.log("  3. Buscar y agregar ciudad");
  console.log("  4. Eliminar ciudad");
  console.log("  5. Establecer ciudad default");
  console.log(`  8. Ajustes (${unitSymbol(config.unit)})`);
  console.log("  9. Salir");
  console.log(BORDER);
}

async function handleOption(option: string, config: Config): Promise<boolean> {
  switch (option) {
    case "1":
      await weatherForDefault(config);
      return false;
    case "2":
      await weatherForAll(config);
      return false;
    case "3":
      await searchAndAdd(config);
      return false;
    case "4":
      await deleteCity(config);
      return false;
    case "5":
      await setDefaultCity(config);
      return false;
    case "8":
      toggleUnit(config);
      return false;
    case "9":
      console.log("\n  ¡Hasta pronto!\n");
      return true;
    default:
      console.log("\n  Opción inválida.\n");
      return false;
  }
}

async function weatherForDefault(config: Config): Promise<void> {
  if (!config.defaultCity) {
    console.log("\n  No hay ciudad default. Usa la opción 5.\n");
    return;
  }
  await showWeather(config.defaultCity, config.unit);
}

async function weatherForAll(config: Config): Promise<void> {
  if (config.cities.length === 0) {
    console.log("\n  No hay ciudades guardadas.\n");
    return;
  }
  for (const city of config.cities) {
    await showWeather(city, config.unit);
  }
  console.log("");
}

async function searchAndAdd(config: Config): Promise<void> {
  const name = await ask("\n  Ciudad a buscar: ");
  if (!name) return;
  const city = await resolveCity(name);
  if (!city) {
    console.log(`\n  No se encontró "${name}".\n`);
    return;
  }
  if (alreadySaved(config, city)) {
    console.log(`\n  "${city.name}" ya está guardada.\n`);
    return;
  }
  config.cities.push(city);
  await showWeather(city, config.unit);
}

async function deleteCity(config: Config): Promise<void> {
  if (config.cities.length === 0) {
    console.log("\n  No hay ciudades guardadas para eliminar.\n");
    return;
  }
  console.log("\n  Ciudades guardadas:");
  config.cities.forEach((c, i) => {
    const location = c.country ? `${c.name}, ${c.country}` : c.name;
    console.log(`    ${i + 1}. ${location}`);
  });
  const input = await ask("\n  Número a eliminar: ");
  const idx = Number(input) - 1;
  const removed = config.cities[idx];
  if (!removed || Number.isNaN(idx)) {
    console.log("\n  Selección inválida.\n");
    return;
  }
  config.cities.splice(idx, 1);
  console.log(`\n  Eliminada: ${removed.name}\n`);
}

async function setDefaultCity(config: Config): Promise<void> {
  const name = await ask("\n  Nombre de la ciudad default: ");
  if (!name) return;
  const city = await resolveCity(name);
  if (!city) {
    console.log(`\n  No se encontró "${name}".\n`);
    return;
  }
  // La antigua default pasa a la lista de guardadas
  if (config.defaultCity) {
    config.cities.push(config.defaultCity);
  }
  // Si la nueva default ya estaba guardada, se saca de la lista
  config.cities = config.cities.filter((c) => !sameCity(c, city));
  config.defaultCity = city;
  console.log(`\n  Ciudad default: ${city.name}\n`);
}

function toggleUnit(config: Config): void {
  config.unit = config.unit === "celsius" ? "fahrenheit" : "celsius";
  console.log(`\n  Unidad: ${unitSymbol(config.unit)}\n`);
}

async function showWeather(city: City, unit: Unit): Promise<void> {
  const forecast = await getForecast(city.lat, city.lon, unit);
  printWeather(city, forecast, unit);
}

async function resolveCity(name: string): Promise<City | null> {
  const result = await getCoords(name);
  if (!result) return null;
  return {
    name: result.name,
    lat: result.latitude,
    lon: result.longitude,
    country: result.country,
  };
}

function alreadySaved(config: Config, city: City): boolean {
  const inList = config.cities.some((c) => sameCity(c, city));
  const isDefault = config.defaultCity !== null && sameCity(config.defaultCity, city);
  return inList || isDefault;
}

function sameCity(a: City, b: City): boolean {
  return a.lat === b.lat && a.lon === b.lon;
}

function errorMessage(err: unknown): string {
  return err instanceof Error ? err.message : String(err);
}
