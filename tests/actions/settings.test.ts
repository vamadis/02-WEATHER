import { beforeEach, describe, expect, test } from "bun:test";
import { toggleUnit } from "../../src/actions/settings.ts";
import type { Settings } from "../../src/types/Settings.ts";
import { resetState, state } from "../helpers/testState.ts";

beforeEach(resetState);

describe("toggleUnit", () => {
  test("pasa de celsius a fahrenheit", () => {
    const settings: Settings = { defaultCity: null, unit: "celsius" };
    toggleUnit(settings);
    expect(settings.unit).toBe("fahrenheit");
    expect(state.success).toEqual(["Unidad: °F"]);
  });

  test("vuelve de fahrenheit a celsius", () => {
    const settings: Settings = { defaultCity: null, unit: "fahrenheit" };
    toggleUnit(settings);
    expect(settings.unit).toBe("celsius");
    expect(state.success).toEqual(["Unidad: °C"]);
  });
});
