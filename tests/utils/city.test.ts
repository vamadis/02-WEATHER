import { afterEach, describe, expect, test } from "bun:test";
import { findCity, isSameCity, removeMatches, toCity } from "../../src/utils/city.ts";
import { geocodingResponse, geocodingResultFor, lima, madrid } from "../helpers/fixtures.ts";
import { restoreFetch, stubFetch } from "../helpers/fetchMock.ts";

describe("isSameCity", () => {
  test("true si comparten coordenadas (aunque el nombre difiera)", () => {
    expect(isSameCity(madrid, { ...madrid, name: "Madrid Centro" })).toBe(true);
  });

  test("false si las coordenadas difieren", () => {
    expect(isSameCity(madrid, lima)).toBe(false);
  });
});

describe("toCity", () => {
  test("mapea los campos de geocoding a City", () => {
    expect(toCity(geocodingResultFor(madrid))).toEqual(madrid);
  });
});

describe("removeMatches", () => {
  test("no modifica el array si no hay coincidencias", () => {
    const cities = [madrid];
    removeMatches(cities, lima);
    expect(cities).toEqual([madrid]);
  });

  test("elimina todas las coincidencias en el lugar", () => {
    const cities = [madrid, lima, { ...madrid, name: "Madrid (dup)" }];
    removeMatches(cities, madrid);
    expect(cities).toEqual([lima]);
  });
});

describe("findCity", () => {
  afterEach(restoreFetch);

  test("devuelve la City cuando el geocoding la encuentra", async () => {
    stubFetch(() => geocodingResponse(geocodingResultFor(madrid)));
    expect(await findCity("Madrid")).toEqual(madrid);
  });

  test("devuelve null cuando no hay resultados", async () => {
    stubFetch(() => geocodingResponse(null));
    expect(await findCity("Narnia")).toBeNull();
  });
});
