export type Unit = "celsius" | "fahrenheit";

// Clima actual: temperatura, código WMO y viento
export type Weather = {
  temperature: number;
  weatherCode: number;
  windSpeed: number;
};
