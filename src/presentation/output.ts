import type { City } from "../types/City.ts";
import type { Unit, Weather } from "../types/Weather.ts";
import { green, red, yellow } from "../utils/colors.ts";
import { describeWeather, locationLabel, unitSymbol } from "../utils/format.ts";

export function showInfo(message: string): void {
  console.log(`\n  ${message}\n`);
}

export function showError(message: string): void {
  console.log(`\n  ${red(message)}\n`);
}

export function showWarning(message: string): void {
  console.log(`\n  ${yellow(message)}\n`);
}

export function showSuccess(message: string): void {
  console.log(`\n  ${green(message)}\n`);
}

// Lista numerada de ciudades (listado y selección al eliminar)
export function printCityList(cities: City[]): void {
  console.log("\n  Ciudades guardadas:");
  cities.forEach((city, index) => {
    console.log(`    ${index + 1}. ${locationLabel(city)}`);
  });
}

export function printWeather(city: City, weather: Weather, unit: Unit): void {
  console.log(`\n  ${locationLabel(city)}`);
  console.log(`    ${describeWeather(weather.weatherCode)}`);
  const temperature = yellow(`${weather.temperature}${unitSymbol(unit)}`);
  console.log(`    Temperatura: ${temperature}`);
  console.log(`    Viento: ${weather.windSpeed} km/h`);
}
