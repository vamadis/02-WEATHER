import type { City } from "../types/City.ts";
import type { Settings } from "../types/Settings.ts";
import { ask } from "../presentation/input.ts";
import { showError, showSuccess } from "../presentation/output.ts";
import { findCity, removeMatches } from "../utils/city.ts";

// Establece la ciudad default; la anterior vuelve a la lista de guardadas
export async function setDefaultCity(cities: City[], settings: Settings): Promise<void> {
  const name = await ask("\n  Nombre de la ciudad default: ");
  if (name === "") return;
  const city = await findCity(name);
  if (city === null) {
    showError(`No se encontró "${name}".`);
    return;
  }
  if (settings.defaultCity !== null) {
    cities.push(settings.defaultCity);
  }
  // Si la nueva default ya estaba guardada, se saca de la lista
  removeMatches(cities, city);
  settings.defaultCity = city;
  showSuccess(`Ciudad default: ${city.name}`);
}
