import { describe, expect, test } from "bun:test";
import { describeWeather, locationLabel, unitSymbol } from "../../src/utils/format.ts";
import { lima, madrid } from "../helpers/fixtures.ts";

describe("describeWeather", () => {
  test("traduce códigos WMO conocidos", () => {
    expect(describeWeather(0)).toBe("Despejado");
    expect(describeWeather(3)).toBe("Nublado");
    expect(describeWeather(95)).toBe("Tormenta");
  });

  test("devuelve 'Condición desconocida' para códigos no mapeados", () => {
    expect(describeWeather(1234)).toBe("Condición desconocida");
  });
});

describe("unitSymbol", () => {
  test("devuelve el símbolo de cada unidad", () => {
    expect(unitSymbol("celsius")).toBe("°C");
    expect(unitSymbol("fahrenheit")).toBe("°F");
  });
});

describe("locationLabel", () => {
  test("incluye el país cuando existe", () => {
    expect(locationLabel(madrid)).toBe("Madrid, España");
  });

  test("solo la ciudad cuando no hay país", () => {
    expect(locationLabel({ ...lima, country: undefined })).toBe("Lima");
  });
});
