export type Unit = "celsius" | "fahrenheit";

export type City = {
  name: string;
  lat: number;
  lon: number;
  country?: string;
};

export type Config = {
  cities: City[];
  defaultCity: City | null;
  unit: Unit;
};

export type Forecast = {
  temperature: number;
  weatherCode: number;
  windSpeed: number;
};

export type GeocodingResult = {
  name: string;
  latitude: number;
  longitude: number;
  country?: string;
};
