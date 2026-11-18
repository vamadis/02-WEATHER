import type { City } from "../types/City.ts";
import type { GeocodingResult } from "../types/Geocoding.ts";
import { getCoords } from "../api/geocoding.ts";

// Dos ciudades son la misma si comparten coordenadas
export function isSameCity(a: City, b: City): boolean {
  return a.lat === b.lat && a.lon === b.lon;
}

export function toCity(result: GeocodingResult): City {
  return {
    name: result.name,
    lat: result.latitude,
    lon: result.longitude,
    country: result.country,
  };
}

// Busca una ciudad por nombre (geocoding) y la convierte a City
export async function findCity(name: string): Promise<City | null> {
  const result = await getCoords(name);
  return result !== null ? toCity(result) : null;
}

// Elimina del array, en el lugar, las coincidencias de la ciudad
export function removeMatches(cities: City[], city: City): void {
  for (let i = cities.length - 1; i >= 0; i--) {
    const candidate = cities[i];
    if (candidate !== undefined && isSameCity(candidate, city)) {
      cities.splice(i, 1);
    }
  }
}
