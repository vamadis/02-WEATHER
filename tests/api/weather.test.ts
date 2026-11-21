import { afterEach, describe, expect, test } from "bun:test";
import { getWeather } from "../../src/api/weather.ts";
import {
  incompleteWeatherResponse,
  madrid,
  sampleWeather,
  weatherResponse,
} from "../helpers/fixtures.ts";
import { jsonResponse, requestedUrls, restoreFetch, stubFetch } from "../helpers/fetchMock.ts";

afterEach(restoreFetch);

describe("getWeather", () => {
  test("devuelve el clima actual", async () => {
    stubFetch(() => weatherResponse());
    expect(await getWeather(madrid.lat, madrid.lon, "celsius")).toEqual(sampleWeather);
  });

  test("lanza error si la API responde con HTTP error", async () => {
    stubFetch(() => jsonResponse({}, 503));
    await expect(getWeather(madrid.lat, madrid.lon, "celsius")).rejects.toThrow(
      "Forecast falló (HTTP 503)",
    );
  });

  test("lanza error si falta current", async () => {
    stubFetch(() => jsonResponse({}));
    await expect(getWeather(madrid.lat, madrid.lon, "celsius")).rejects.toThrow(
      "Datos de forecast incompletos",
    );
  });

  test("lanza error si los campos de current están incompletos", async () => {
    stubFetch(() => incompleteWeatherResponse());
    await expect(getWeather(madrid.lat, madrid.lon, "celsius")).rejects.toThrow(
      "Datos de forecast incompletos",
    );
  });

  test("consulta la URL con coordenadas y unidad", async () => {
    stubFetch(() => weatherResponse());
    await getWeather(40.42, -3.7, "fahrenheit");
    expect(requestedUrls()).toHaveLength(1);
    const url = requestedUrls()[0]!;
    expect(url).toContain("latitude=40.42");
    expect(url).toContain("longitude=-3.7");
    expect(url).toContain("temperature_unit=fahrenheit");
    expect(url).toContain("wind_speed_unit=kmh");
  });
});
