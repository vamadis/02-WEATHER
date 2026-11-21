import { beforeEach, describe, expect, test } from "bun:test";
import { listCities } from "../../src/actions/listCities.ts";
import { lima, madrid } from "../helpers/fixtures.ts";
import { resetState, state } from "../helpers/testState.ts";

beforeEach(resetState);

describe("listCities", () => {
  test("avisa si no hay ciudades guardadas", () => {
    listCities([]);
    expect(state.info).toEqual(["No hay ciudades guardadas."]);
    expect(state.cityLists).toEqual([]);
  });

  test("imprime la lista de ciudades guardadas", () => {
    listCities([madrid, lima]);
    expect(state.cityLists).toEqual([[madrid, lima]]);
    expect(state.info).toEqual([]);
  });
});
