# AGENTS.md

## Commands

- **Typecheck:** `bun run typecheck` → runs `bun check` (Bun's built-in typechecker, not `tsc`).
- **Run:** `bun index.ts`.
- No test runner or build script is defined yet.

## TypeScript strictness (tsconfig.json)

- `verbatimModuleSyntax` → use `import type` for type-only imports.
- `allowImportingTsExtensions` → relative imports must keep the `.ts` extension.
- `noUncheckedIndexedAccess` → indexed access yields `T | undefined`.
- `strict`, `noFallthroughCasesInSwitch`, `noImplicitOverride` are on.

## Architecture

- Entrypoint: `index.ts` (`package.json` `module` field). Currently just the `bun init` scaffold — feature work starts here.
- Weather lookup is a 2-step OpenMeteo flow: geocoding (city → lat/long) → forecast (lat/long → temperature).
- OpenMeteo needs **no API key and no `.env`** — don't add auth or env-loading code.
- End goal (README): a standalone executable binary; CLI menu and UI text are in **Spanish**.
