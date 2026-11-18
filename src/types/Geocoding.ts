// Resultado crudo de la API de geocoding (OpenMeteo)
export type GeocodingResult = {
  name: string;
  latitude: number;
  longitude: number;
  country?: string;
};
