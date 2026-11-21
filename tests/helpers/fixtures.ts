import type { City } from "../../src/types/City.ts";
import type { GeocodingResult } from "../../src/types/Geocoding.ts";
import type { Weather } from "../../src/types/Weather.ts";
import { jsonResponse } from "./fetchMock.ts";

export const madrid: City = { name: "Madrid", lat: 40.42, lon: -3.7, country: "España" };
export const lima: City = { name: "Lima", lat: -12.05, lon: -77.04, country: "Perú" };

export const sampleWeather: Weather = { temperature: 21.5, weatherCode: 2, windSpeed: 10.4 };

export function geocodingResultFor(city: City): GeocodingResult {
  return {
    name: city.name,
    latitude: city.lat,
    longitude: city.lon,
    country: city.country,
  };
}

export function geocodingResponse(result: GeocodingResult | null): Response {
  return jsonResponse({ results: result === null ? [] : [result] });
}

// Payload completo del forecast; los overrides reemplazan campos sueltos
export function weatherResponse(overrides: Partial<Weather> = {}): Response {
  const weather = { ...sampleWeather, ...overrides };
  return jsonResponse({
    current: {
      temperature_2m: weather.temperature,
      weather_code: weather.weatherCode,
      wind_speed_10m: weather.windSpeed,
    },
  });
}

// Payload sin los campos que getWeather exige
export function incompleteWeatherResponse(): Response {
  return jsonResponse({ current: {} });
}
