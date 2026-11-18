import type { City } from "./City.ts";
import type { Unit } from "./Weather.ts";

export type Settings = {
  defaultCity: City | null;
  unit: Unit;
};
