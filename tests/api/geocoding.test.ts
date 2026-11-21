import { afterEach, describe, expect, test } from "bun:test";
import { getCoords } from "../../src/api/geocoding.ts";
import { geocodingResponse, geocodingResultFor, madrid } from "../helpers/fixtures.ts";
import { jsonResponse, requestedUrls, restoreFetch, stubFetch } from "../helpers/fetchMock.ts";

afterEach(restoreFetch);

describe("getCoords", () => {
  test("devuelve el primer resultado", async () => {
    stubFetch(() => geocodingResponse(geocodingResultFor(madrid)));
    expect(await getCoords("Madrid")).toEqual(geocodingResultFor(madrid));
  });

  test("null cuando no hay resultados", async () => {
    stubFetch(() => geocodingResponse(null));
    expect(await getCoords("Narnia")).toBeNull();
  });

  test("lanza error si la API responde con HTTP error", async () => {
    stubFetch(() => jsonResponse({}, 500));
    await expect(getCoords("Madrid")).rejects.toThrow("Geocoding falló (HTTP 500)");
  });

  test("consulta la URL con nombre codificado, count y language", async () => {
    stubFetch(() => geocodingResponse(null));
    await getCoords("Buenos Aires");
    expect(requestedUrls()).toHaveLength(1);
    const url = requestedUrls()[0]!;
    expect(url).toContain("name=Buenos%20Aires");
    expect(url).toContain("count=1");
    expect(url).toContain("language=es");
  });
});
