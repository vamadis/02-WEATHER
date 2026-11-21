import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import { addCity } from "../../src/actions/addCity.ts";
import type { City } from "../../src/types/City.ts";
import type { Settings } from "../../src/types/Settings.ts";
import {
  geocodingResponse,
  geocodingResultFor,
  lima,
  madrid,
  sampleWeather,
  weatherResponse,
} from "../helpers/fixtures.ts";
import { requestedUrls, respondWith, restoreFetch, stubFetch } from "../helpers/fetchMock.ts";
import { resetState, state } from "../helpers/testState.ts";

beforeEach(resetState);
afterEach(restoreFetch);

const noDefault: Settings = { defaultCity: null, unit: "celsius" };

describe("addCity", () => {
  test("no hace nada con input vacío", async () => {
    state.answers.push("   ");
    const cities: City[] = [];
    await addCity(cities, noDefault);
    expect(cities).toEqual([]);
    expect(requestedUrls()).toHaveLength(0);
  });

  test("error si la ciudad no se encuentra", async () => {
    state.answers.push("Narnia");
    stubFetch(() => geocodingResponse(null));
    const cities: City[] = [];
    await addCity(cities, noDefault);
    expect(state.error).toEqual(['No se encontró "Narnia".']);
    expect(cities).toEqual([]);
  });

  test("aviso si ya está guardada en la lista", async () => {
    state.answers.push("Madrid");
    stubFetch(() => geocodingResponse(geocodingResultFor(madrid)));
    const cities: City[] = [madrid];
    await addCity(cities, noDefault);
    expect(state.warning).toEqual(['"Madrid" ya está guardada.']);
    expect(cities).toEqual([madrid]);
  });

  test("aviso si ya es la ciudad default", async () => {
    state.answers.push("Madrid");
    stubFetch(() => geocodingResponse(geocodingResultFor(madrid)));
    const cities: City[] = [];
    const settings: Settings = { defaultCity: madrid, unit: "celsius" };
    await addCity(cities, settings);
    expect(state.warning).toEqual(['"Madrid" ya está guardada.']);
    expect(cities).toEqual([]);
  });

  test("agrega la ciudad y muestra su clima", async () => {
    state.answers.push("Madrid");
    stubFetch(
      respondWith(geocodingResponse(geocodingResultFor(madrid)), weatherResponse({ temperature: 18 })),
    );
    const cities: City[] = [];
    await addCity(cities, noDefault);
    expect(cities).toEqual([madrid]);
    expect(state.weatherPrints).toEqual([
      { city: madrid, weather: { ...sampleWeather, temperature: 18 }, unit: "celsius" },
    ]);
    expect(requestedUrls()).toHaveLength(2);
  });

  test("no agrega una ciudad con las mismas coordenadas que una guardada", async () => {
    state.answers.push("Lima Centro");
    stubFetch(() => geocodingResponse({ ...geocodingResultFor(lima), name: "Lima Centro" }));
    const cities: City[] = [lima];
    await addCity(cities, noDefault);
    expect(cities).toEqual([lima]);
    expect(state.warning).toEqual(['"Lima Centro" ya está guardada.']);
    expect(requestedUrls()).toHaveLength(1);
  });
});
