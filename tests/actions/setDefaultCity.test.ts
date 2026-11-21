import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import { setDefaultCity } from "../../src/actions/setDefaultCity.ts";
import type { City } from "../../src/types/City.ts";
import type { Settings } from "../../src/types/Settings.ts";
import { geocodingResponse, geocodingResultFor, lima, madrid } from "../helpers/fixtures.ts";
import { requestedUrls, restoreFetch, stubFetch } from "../helpers/fetchMock.ts";
import { resetState, state } from "../helpers/testState.ts";

beforeEach(resetState);
afterEach(restoreFetch);

describe("setDefaultCity", () => {
  test("no hace nada con input vacío", async () => {
    state.answers.push("   ");
    const cities: City[] = [madrid];
    const settings: Settings = { defaultCity: null, unit: "celsius" };
    await setDefaultCity(cities, settings);
    expect(cities).toEqual([madrid]);
    expect(settings.defaultCity).toBeNull();
    expect(requestedUrls()).toHaveLength(0);
  });

  test("error si la ciudad no se encuentra", async () => {
    state.answers.push("Narnia");
    stubFetch(() => geocodingResponse(null));
    const settings: Settings = { defaultCity: null, unit: "celsius" };
    await setDefaultCity([], settings);
    expect(state.error).toEqual(['No se encontró "Narnia".']);
    expect(settings.defaultCity).toBeNull();
  });

  test("establece la default y la quita de la lista", async () => {
    state.answers.push("Lima");
    stubFetch(() => geocodingResponse(geocodingResultFor(lima)));
    const cities: City[] = [madrid, lima];
    const settings: Settings = { defaultCity: null, unit: "celsius" };
    await setDefaultCity(cities, settings);
    expect(cities).toEqual([madrid]);
    expect(settings.defaultCity).toEqual(lima);
    expect(state.success).toEqual(["Ciudad default: Lima"]);
  });

  test("la default anterior vuelve a la lista", async () => {
    state.answers.push("Lima");
    stubFetch(() => geocodingResponse(geocodingResultFor(lima)));
    const cities: City[] = [];
    const settings: Settings = { defaultCity: madrid, unit: "celsius" };
    await setDefaultCity(cities, settings);
    expect(cities).toEqual([madrid]);
    expect(settings.defaultCity).toEqual(lima);
  });

  test("reemplazo completo: la nueva default sale de la lista y la anterior entra", async () => {
    state.answers.push("Lima");
    stubFetch(() => geocodingResponse(geocodingResultFor(lima)));
    const cities: City[] = [lima];
    const settings: Settings = { defaultCity: madrid, unit: "celsius" };
    await setDefaultCity(cities, settings);
    expect(cities).toEqual([madrid]);
    expect(settings.defaultCity).toEqual(lima);
  });
});
