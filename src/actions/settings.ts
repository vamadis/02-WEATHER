import type { Settings } from "../types/Settings.ts";
import { showSuccess } from "../presentation/output.ts";
import { unitSymbol } from "../utils/format.ts";

// Alterna la unidad de temperatura entre °C y °F
export function toggleUnit(settings: Settings): void {
  settings.unit = settings.unit === "celsius" ? "fahrenheit" : "celsius";
  showSuccess(`Unidad: ${unitSymbol(settings.unit)}`);
}
