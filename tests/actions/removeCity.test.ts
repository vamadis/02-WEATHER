import { beforeEach, describe, expect, test } from "bun:test";
import { removeCity } from "../../src/actions/removeCity.ts";
import type { City } from "../../src/types/City.ts";
import { lima, madrid } from "../helpers/fixtures.ts";
import { resetState, state } from "../helpers/testState.ts";

beforeEach(resetState);

describe("removeCity", () => {
  test("avisa si no hay ciudades para eliminar", async () => {
    await removeCity([]);
    expect(state.info).toEqual(["No hay ciudades guardadas para eliminar."]);
  });

  test("error con selección no numérica", async () => {
    state.answers.push("abc");
    const cities: City[] = [madrid, lima];
    await removeCity(cities);
    expect(state.error).toEqual(["Selección inválida."]);
    expect(cities).toEqual([madrid, lima]);
  });

  test("error con cero", async () => {
    state.answers.push("0");
    const cities: City[] = [madrid];
    await removeCity(cities);
    expect(state.error).toEqual(["Selección inválida."]);
    expect(cities).toEqual([madrid]);
  });

  test("error con número fuera de rango", async () => {
    state.answers.push("5");
    const cities: City[] = [madrid];
    await removeCity(cities);
    expect(state.error).toEqual(["Selección inválida."]);
    expect(cities).toEqual([madrid]);
  });

  test("elimina la ciudad elegida", async () => {
    state.answers.push("2");
    const cities: City[] = [madrid, lima];
    await removeCity(cities);
    expect(cities).toEqual([madrid]);
    expect(state.success).toEqual(["Eliminada: Lima"]);
    expect(state.cityLists).toEqual([[madrid, lima]]);
  });
});
