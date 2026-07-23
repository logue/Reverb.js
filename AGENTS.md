# AGENTS.md

You are an expert in JavaScript, Rspack, Rsbuild, Rslib, Rstest and library development. You write maintainable, performant, and accessible code.

## Commands

- `pnpm run build` - Build the library for production
- `pnpm run build:docs` - Build the document and demo site.
- `pnpm run dev` - Turn on watch mode, watch for changes and rebuild the library
- `pnpm run dev:docs` - Turn on watch mode in browser, watch for changes and rebuild the library.

## Docs

- Rslib: <https://rslib.rs/llms.txt>
- Rsbuild: <https://rsbuild.rs/llms.txt>
- Rslint: <https://rslint.rs/llms.txt>
- Rstest: <https://rstest.rs/llms.txt>

## Tools

### Linter and Formatter

- Run `pnpm run lint` to lint and format all code (biome + rslint)
  - Runs Biome (`lint:biome`) and Rslint (`lint:rslint`) in sequence
- Run `pnpm run lint:biome` to lint and format with Biome
- Run `pnpm run lint:rslint` to check custom rules with Rslint

### Rstest

- Run `pnpm run test` to run tests
- Run `pnpm run test:watch` to run tests in watch mode
