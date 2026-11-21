# AGENTS.md

## Commands

- **Typecheck:** `bun run typecheck` → runs `bun check` (Bun's built-in typechecker, not `tsc`).
- **Test:** `bun test` (or `bun run test`). All tests live in `tests/` as `*.test.ts`, mirroring `src/`. `bunfig.toml` preloads `tests/helpers/setup.ts`, which runs before any `src/` module loads and uses `mock.module` to point `DATA_DIR` at a per-run temp dir and replace the `presentation/` layer with controllable mocks (`tests/helpers/testState.ts`). Network calls are stubbed per test via `tests/helpers/fetchMock.ts`; fixtures in `tests/helpers/fixtures.ts`.
- **Run:** `bun src/index.ts`.
- **Build:** `bun run build` → runs `bun check && bun test && bun build --target=bun` first; the build fails (and is skipped) if types or tests fail. Outputs to `dist/`; standalone binary: `bun build --compile src/index.ts --outfile weather`.

## TypeScript strictness (tsconfig.json)

- `verbatimModuleSyntax` → use `import type` for type-only imports.
- `allowImportingTsExtensions` → relative imports must keep the `.ts` extension.
- `noUncheckedIndexedAccess` → indexed access yields `T | undefined`.
- `strict`, `noFallthroughCasesInSwitch`, `noImplicitOverride` are on.

## Architecture

- Entrypoint: `src/index.ts` (`package.json` `module` field). It runs the one-time storage migration and starts the menu loop.
- Layered structure under `src/`:
  - `actions/` — user actions (getWeather, addCity, removeCity, setDefaultCity, listCities, settings). They orchestrate I/O through `presentation/`.
  - `presentation/` — console UI: `menu.ts` (render + dispatch via `MENU_ITEMS`), `input.ts` (ask/askNumber), `output.ts` (messages, printWeather, printCityList).
  - `storage/` — local persistence in `~/.weather-cli/`: `cities.json` (`citiesStorage.ts`), `settings.json` (`settingsStorage.ts`), `jsonFile.ts` (shared JSON read/write), `migration.ts` (one-time split from legacy `config.json`, never deletes it).
  - `types/` — one file per domain type: City, Weather (+Unit), Geocoding, Settings, MenuOption.
  - `api/` — OpenMeteo integration: `geocoding.ts` (city → coords), `weather.ts` (coords → current weather).
  - `utils/` — `format.ts`, `constants.ts` (DATA_DIR), `colors.ts`, `city.ts` (isSameCity, findCity, removeMatches).
- Weather lookup is a 2-step OpenMeteo flow: geocoding (city → lat/long) → weather (lat/long → temperature).
- OpenMeteo needs **no API key and no `.env`** — don't add auth or env-loading code.
- The menu loop keeps `cities` + `settings` in memory and saves both storages after every action.
- End goal (README): a standalone executable binary; CLI menu and UI text are in **Spanish**.
