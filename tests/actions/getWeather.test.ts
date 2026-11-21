import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import { showAllCitiesWeather, showDefaultCityWeather } from "../../src/actions/getWeather.ts";
import { lima, madrid, sampleWeather, weatherResponse } from "../helpers/fixtures.ts";
import { requestedUrls, respondWith, restoreFetch, stubFetch } from "../helpers/fetchMock.ts";
import { resetState, state } from "../helpers/testState.ts";

beforeEach(resetState);
afterEach(restoreFetch);

describe("showDefaultCityWeather", () => {
  test("avisa si no hay ciudad default", async () => {
    await showDefaultCityWeather({ defaultCity: null, unit: "celsius" });
    expect(state.info).toEqual(["No hay ciudad default. Usa la opción 5."]);
    expect(requestedUrls()).toHaveLength(0);
  });

  test("obtiene e imprime el clima de la ciudad default", async () => {
    stubFetch(() => weatherResponse({ temperature: 30 }));
    await showDefaultCityWeather({ defaultCity: madrid, unit: "fahrenheit" });
    expect(state.weatherPrints).toEqual([
      { city: madrid, weather: { ...sampleWeather, temperature: 30 }, unit: "fahrenheit" },
    ]);
  });
});

describe("showAllCitiesWeather", () => {
  test("avisa si no hay ciudades guardadas", async () => {
    await showAllCitiesWeather([], { defaultCity: null, unit: "celsius" });
    expect(state.info).toEqual(["No hay ciudades guardadas."]);
    expect(requestedUrls()).toHaveLength(0);
  });

  test("imprime el clima de cada ciudad", async () => {
    stubFetch(respondWith(weatherResponse(), weatherResponse({ temperature: 15 })));
    await showAllCitiesWeather([madrid, lima], { defaultCity: null, unit: "celsius" });
    expect(state.weatherPrints).toEqual([
      { city: madrid, weather: sampleWeather, unit: "celsius" },
      { city: lima, weather: { ...sampleWeather, temperature: 15 }, unit: "celsius" },
    ]);
    expect(requestedUrls()).toHaveLength(2);
  });
});
