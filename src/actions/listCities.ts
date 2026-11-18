import type { City } from "../types/City.ts";
import { printCityList, showInfo } from "../presentation/output.ts";

// Lista todas las ciudades guardadas
export function listCities(cities: City[]): void {
  if (cities.length === 0) {
    showInfo("No hay ciudades guardadas.");
    return;
  }
  printCityList(cities);
  console.log("");
}
