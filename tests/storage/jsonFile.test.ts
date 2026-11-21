import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { beforeEach, describe, expect, test } from "bun:test";
import { readJsonFile, writeJsonFile } from "../../src/storage/jsonFile.ts";
import { cleanDataDir, dataDir } from "../helpers/testState.ts";

beforeEach(cleanDataDir);

describe("readJsonFile", () => {
  test("null si el archivo no existe", () => {
    expect(readJsonFile(join(dataDir, "missing.json"))).toBeNull();
  });

  test("null si el JSON está corrupto", () => {
    const path = join(dataDir, "corrupt.json");
    writeJsonFile(path, {});
    writeFileSync(path, "{ json inválido", "utf-8");
    expect(readJsonFile(path)).toBeNull();
  });

  test("lee los datos escritos", () => {
    const path = join(dataDir, "data.json");
    writeJsonFile(path, { name: "Madrid" });
    expect(readJsonFile<{ name: string }>(path)).toEqual({ name: "Madrid" });
  });
});

describe("writeJsonFile", () => {
  test("crea los directorios padres", () => {
    const path = join(dataDir, "nested", "dir", "data.json");
    writeJsonFile(path, [1, 2]);
    expect(existsSync(path)).toBe(true);
  });

  test("escribe JSON formateado", () => {
    const path = join(dataDir, "pretty.json");
    writeJsonFile(path, { a: 1 });
    expect(readFileSync(path, "utf-8")).toBe(JSON.stringify({ a: 1 }, null, 2));
  });
});
