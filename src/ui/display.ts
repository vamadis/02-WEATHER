import type { City, Forecast, Unit } from "../types.ts";

// Códigos WMO -> descripción en español
const WEATHER_DESCRIPTIONS: Record<number, string> = {
  0: "Despejado",
  1: "Mayormente despejado",
  2: "Parcialmente nublado",
  3: "Nublado",
  45: "Niebla",
  48: "Niebla con escarcha",
  51: "Llovizna ligera",
  53: "Llovizna moderada",
  55: "Llovizna densa",
  56: "Llovizna helada ligera",
  57: "Llovizna helada densa",
  61: "Lluvia ligera",
  63: "Lluvia moderada",
  65: "Lluvia fuerte",
  66: "Lluvia helada ligera",
  67: "Lluvia helada fuerte",
  71: "Nevada ligera",
  73: "Nevada moderada",
  75: "Nevada fuerte",
  77: "Granos de nieve",
  80: "Chubascos ligeros",
  81: "Chubascos moderados",
  82: "Chubascos violentos",
  85: "Chubascos de nieve ligeros",
  86: "Chubascos de nieve fuertes",
  95: "Tormenta",
  96: "Tormenta con granizo ligero",
  99: "Tormenta con granizo fuerte",
};

export function describeWeather(code: number): string {
  return WEATHER_DESCRIPTIONS[code] ?? "Condición desconocida";
}

export function unitSymbol(unit: Unit): string {
  return unit === "celsius" ? "°C" : "°F";
}

export function printWeather(city: City, forecast: Forecast, unit: Unit): void {
  const location = city.country ? `${city.name}, ${city.country}` : city.name;
  console.log(`\n  ${location}`);
  console.log(`    ${describeWeather(forecast.weatherCode)}`);
  console.log(`    Temperatura: ${forecast.temperature}${unitSymbol(unit)}`);
  console.log(`    Viento: ${forecast.windSpeed} km/h`);
}
