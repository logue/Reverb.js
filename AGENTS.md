# AGENTS.md

You are an expert in TypeScript, Rsbuild, Rslib, Rstest, and library development. You write maintainable, performant, and accessible code.

## Setup & Overview

- **Build tool**: Rslib (for build library), Rsbuild (for demo site)
- **Linter**: Rslint and Biome
- **Testing**: Rstest
- **Language**: TypeScript 7
- **Package manager**: pnpm (do not use npm or yarn)

**Last updated**: 2026-07-29
**Verified with**: `package.json` in this repository

### Tool Versions

See `package.json` for authoritative dependency versions.

This guide assumes:

- TypeScript 7.0.2 or later
- Rsbuild 2.1.7 or later
- Rslib 0.23.2 or later
- Rstest 0.11.4 or later

**If you encounter version-related issues, check `package.json` directly—it is the source of truth.**

### Dependency Management

- `minimumReleaseAge: 0` is set in `pnpm-workspace.yaml` to prevent unpredictable auto-injection of `minimumReleaseAgeExclude`
- This ensures version resolution is deterministic and reproducible across projects

### VS Code Setup

Recommended extensions are listed in `.vscode/extensions.json`.
Formatter and linter are configured in `.vscode/settings.json`:

- Default formatter: **Biome**
- Format on save: enabled
- Auto-fix on save: Rslint

When you open the project in VS Code, you'll be prompted to install recommended extensions.

## Project

### Project Structure

This project uses two complementary build tools:

- **Rslib** - Builds the library for distribution (ESM, CJS, etc.)
  - Command: `pnpm run build`
  - Output: `dist/` (published to npm)
  - Configuration: `rslib.config.ts`, `tsconfig.rslib.json`

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
- `pnpm run clean:hard` - Remove build artifact and build caches.

## Documentation

- Rslib: <https://rslib.rs/llms.txt>
- Rsbuild: <https://rsbuild.rs/llms.txt>
- Rslint: <https://rslint.rs/llms.txt>
- Rstest: <https://rstest.rs/llms.txt>

## Code Style

### TypeScript Rules

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
- **Do not ignore TypeScript errors**
- **Do not use `@ts-ignore` without good reason**

### Directory Structure & File Organization

#### Type vs Interface Organization

- **`interfaces/`** - Data structures that:
  - Define object shapes for APIs
  - May include default values or factory functions in the same file
  - Example: `OptionInterface.ts` (type + default config)

- **`types/`** - Type-only definitions:
  - Union types (preferred over enums)
  - Generic types
  - Type aliases
  - No runtime values

### Union Types Over Enums

Avoid TypeScript `enum`. Use union types with companion objects:

```ts
// ✅ Good
export type NoiseType =
  | "blue"
  | "brown"
  | "green"
  | "pink"
  | "red"
  | "violet"
  | "white";

export const noiseTypes: NoiseType[] = [
  "blue",
  "brown",
  "green",
  "pink",
  "red",
  "violet",
  "white",
];

export const NoiseType: Record<NoiseType, NoiseGenerator> = {
  blue,
  brown: red,
  green,
  pink,
  red,
  violet,
  white,
};

// ❌ Avoid
enum NoiseType {
  Blue = "blue",
  Brown = "brown",
  // ...
}
```

**Why:**

- Tree-shaking friendly
- No runtime overhead
- More flexible companion objects
- Type narrowing remains explicit

#### Formatting

- Use Biome
- Use Rslint for linting
- **Indentation**: Tabs
- **Semicolons**: Use semicolons
- **Quotes**: Double quotes

### Naming Conventions

- **Types/Interfaces**: `PascalCase` (e.g., `RspackOptions`)
- **Classes**: `PascalCase` (e.g., `Compiler`)
- **Functions**: `camelCase` (e.g., `createCompiler`)
- **Variables**: `camelCase` (e.g., `compiler`)
- **Constants**: `SCREAMING_SNAKE_CASE` or `camelCase`
- **Files**: `camelCase.ts` or `PascalCase.ts` (match main export)

### Async/Await Patterns

- Use `async/await` over promises
- Handle errors with try/catch
- Use `Promise.all` for parallel operations

### Facade Pattern: Hiding Complexity

This project follows the Facade pattern: the public API is simple and focused,
while internal complexity is deliberately hidden.

- Users interact with high-level operations (read/write files, transform data)
- Implementation details (binary parsing, encoding, version handling) are internal
- This reduces cognitive load on users and provides stable contracts

Example: `symbol-art-parser` exposes only `.sar` ↔ JSON conversions, hiding binary protocol details.

## Patterns & Best Practices

### Code Documentation & Comments

- Use `//` for single-line
- Use `/* */` for multi-line
- All exported functions, types, interfaces, and global variables must have JSDoc
- Non-exported implementation details can skip JSDoc
- Use `@param`, `@returns`, `@example`, `@throws` as needed
- Explain "why" not "what"

### Error Handling

- **Use standard exceptions** (`TypeError`, `RangeError`, `Error`) for input validation and simple errors
  - `TypeError`: When argument type is incorrect
  - `RangeError`: When argument value is out of valid range
  - `Error`: For unexpected/unrecoverable situations

- **Define custom exceptions** only when:
  - The error has actionable context (error codes, recovery suggestions)
  - Downstream code needs to catch and handle specific failures
  - Multiple error conditions require differentiation

### API Design Principle

Prioritize the external API clarity over internal implementation patterns.
Hidden complexity is acceptable if it provides users with simple, intuitive interfaces.

This may include using the same identifier for both type and value when it improves ergonomics.

### Testing

Testing program uses rstest.

- Run `pnpm run test` to run tests
- Run `pnpm run test:watch` to run tests in watch mode

### Test Code Style

- Use descriptive test names
- Group related tests with `describe`
- Use `it` or `test` for individual cases
- Clean up resources after tests (afterEach, afterAll)
- Follow the same TypeScript rules as non-test code
