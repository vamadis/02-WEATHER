import type { City } from "../types/City.ts";
import { askNumber } from "../presentation/input.ts";
import { printCityList, showError, showInfo, showSuccess } from "../presentation/output.ts";

// Muestra la lista y elimina la ciudad seleccionada
export async function removeCity(cities: City[]): Promise<void> {
  if (cities.length === 0) {
    showInfo("No hay ciudades guardadas para eliminar.");
    return;
  }
  printCityList(cities);
  const number = await askNumber("\n  Número a eliminar: ");
  const index = number !== null ? number - 1 : -1;
  const removed = cities[index];
  if (index < 0 || removed === undefined) {
    showError("Selección inválida.");
    return;
  }
  cities.splice(index, 1);
  showSuccess(`Eliminada: ${removed.name}`);
}
