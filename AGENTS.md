# AGENTS.md

You are an expert in JavaScript, Rspack, Rsbuild, Rslib, Rstest, and library development. You write maintainable, performant, and accessible code.

- **Build tool**: Rslib (for build library), Rsbuild (for demo site)
- **Linter**: Rslint and Biome
- **Testing**: Rstest
- **Language**: TypeScript 7
- **Package manager**: pnpm (do not use npm or yarn)

**Last updated**: 2026-07-23
**Verified with**: `package.json` in this repository

## Tool Versions

See `package.json` for authoritative dependency versions.

This guide assumes:

- TypeScript 7.0.2 or later
- Rslib 0.23.2 or later
- Rsbuild 2.1.7 or later
- Rstest 0.11.3 or later

If you encounter version-related issues, check `package.json` and this document's last update date.

## VS Code Setup

Recommended extensions are listed in `.vscode/extensions.json`.
Formatter and linter are configured in `.vscode/settings.json`:

- Default formatter: **Biome**
- Format on save: enabled
- Auto-fix on save: Rslint

When you open the project in VS Code, you'll be prompted to install recommended extensions.

## Docs

- Rslib: <https://rslib.rs/llms.txt>
- Rsbuild: <https://rsbuild.rs/llms.txt>
- Rslint: <https://rslint.rs/llms.txt>
- Rstest: <https://rstest.rs/llms.txt>

## Project Structure

### Build Tools

This project uses two complementary build tools:

- **Rslib** - Builds the library for distribution (ESM, CJS, etc.)
  - Command: `pnpm run build`
  - Output: `dist/` (published to npm)
  - Configuration: `rslib.config.ts`, `tsconfig.rslib.json`

- **Rsbuild** - Builds the demo and documentation site
  - Command: `pnpm run build:docs`
  - Output: `docs/` (for manual testing and validation)
  - Configuration: `rsbuild.config.ts`, `tsconfig.rsbuild.json`
  - Purpose: Interactive demo to verify library functionality during development

### Development Workflow

- `pnpm run dev` - Watch mode for library
- `pnpm run dev:docs` - Local dev server for demo site with hot reload

## Commands

- `pnpm run build` - Build the library for production
- `pnpm run build:docs` - Build the demo site
- `pnpm run dev` - Watch mode for library
- `pnpm run dev:docs` - Dev server with hot reload
- `pnpm run preview` - Preview the built demo site
- `pnpm run test` - Run tests
- `pnpm run test:watch` - Watch mode for tests
- `pnpm run lint` - Lint and format all code (Biome + Rslint)
- `pnpm run clean` - Remove build artifacts

## TypeScript Rules

- **No `any`** - use `unknown` and narrow with type guards.
- **Explicit return types** on exported functions.
- **Use `type` over `interface`** for object shapes; extend via intersection (`&`).
- **Union literal types** instead of magic strings:
  ```ts
  type Status = "active" | "inactive" | "pending";
  ```
- **Underscore prefix** for intentionally unused variables: `_value`, `_error`.
- **Array type syntax**: `string[]` not `Array<string>`.
- **Generic constructors**: left-hand side style - `const map: Map<string, User> = new Map()`.

## Testing

Testing program uses rstest.

- Run `pnpm run test` to run tests
- Run `pnpm run test:watch` to run tests in watch mode
