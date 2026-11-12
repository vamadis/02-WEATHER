import type { GeocodingResult } from "../types.ts";

const GEOCODING_URL = "https://geocoding-api.open-meteo.com/v1/search";

// Ciudad -> coordenadas (lat/lon) vía OpenMeteo Geocoding API
export async function getCoords(cityName: string): Promise<GeocodingResult | null> {
  const url = `${GEOCODING_URL}?name=${encodeURIComponent(cityName)}&count=1&language=es&format=json`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Geocoding falló (HTTP ${response.status})`);
  }
  const data = await response.json() as { results?: GeocodingResult[] };
  return data.results?.[0] ?? null;
}
