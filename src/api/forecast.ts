import type { Forecast, Unit } from "../types.ts";

const FORECAST_URL = "https://api.open-meteo.com/v1/forecast";

// Coordenadas -> clima actual (temperatura, código WMO, viento)
export async function getForecast(
  lat: number,
  lon: number,
  unit: Unit,
): Promise<Forecast> {
  const url =
    `${FORECAST_URL}?latitude=${lat}&longitude=${lon}` +
    `&current=temperature_2m,weather_code,wind_speed_10m` +
    `&temperature_unit=${unit}&wind_speed_unit=kmh`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Forecast falló (HTTP ${response.status})`);
  }
  const data = await response.json() as {
    current?: {
      temperature_2m?: number;
      weather_code?: number;
      wind_speed_10m?: number;
    };
  };
  const current = data.current;
  if (
    !current ||
    current.temperature_2m === undefined ||
    current.weather_code === undefined ||
    current.wind_speed_10m === undefined
  ) {
    throw new Error("Datos de forecast incompletos");
  }
  return {
    temperature: current.temperature_2m,
    weatherCode: current.weather_code,
    windSpeed: current.wind_speed_10m,
  };
}
