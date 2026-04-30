# AGENT.md

This file provides guidance for AI coding agents (GitHub Copilot, Claude, Cursor, etc.) working in this repository.

---

## Project Overview

**`@logue/reverb`** — Web Audio API convolution reverb effect library written in TypeScript.

- **Type**: TypeScript library (no framework)
- **Build tool**: Vite 8 (outputs UMD / ES / CJS / IIFE)
- **Language**: TypeScript (strict)
- **Package manager**: pnpm (do not use npm or yarn)
- **Node version**: `^20.19.0 || >=22.12.0`
- **Peer dependencies**: `@thi.ng/colored-noise`, `@thi.ng/random`, `@thi.ng/transducers`

### Source layout

```
src/
  Reverb.ts              # Main class (default export)
  NoiseType.ts           # NoiseType union type + generator map
  Meta.ts                # Version / build date constants
  interfaces/
    OptionInterface.ts   # OptionInterface + defaults export
  __tests__/
    Reverb.test.ts
    NoiseType.test.ts
    OptionInterface.test.ts
    integration.test.ts
    e2e.test.ts
    setup.ts             # Mock AudioContext / AudioNode helpers
```

### Library API

**`Reverb` class** (`src/Reverb.ts`)

| Member                      | Description                                                  |
| --------------------------- | ------------------------------------------------------------ |
| `static version`            | Package version string                                       |
| `static build`              | Build date string                                            |
| `constructor(ctx, options)` | `ctx`: `AudioContext`; `options`: `Partial<OptionInterface>` |
| `connect(sourceNode)`       | Connect to source; returns output `AudioNode`                |
| `disconnect()`              | Disconnect all nodes                                         |
| `buildImpulse()`            | Regenerate impulse response buffer                           |
| `mix(value)`                | Set dry/wet ratio (0–1)                                      |
| `setNoise(type)`            | Switch noise algorithm                                       |
| `filterType(type)`          | Set `BiquadFilterType`                                       |

**`OptionInterface`** (all fields have defaults in `defaults` export)

| Field             | Type               | Default     | Description                  |
| ----------------- | ------------------ | ----------- | ---------------------------- |
| `noise`           | `NoiseType`        | `'white'`   | Colored noise algorithm      |
| `scale`           | `number`           | `1`         | Noise scale                  |
| `peaks`           | `number`           | `2`         | Number of IR peaks           |
| `randomAlgorithm` | `INorm`            | `SYSTEM`    | RNG from `@thi.ng/random`    |
| `decay`           | `number`           | `2`         | IR decay amount              |
| `delay`           | `number`           | `0`         | IR delay                     |
| `time`            | `number`           | `2`         | IR length (seconds)          |
| `filterType`      | `BiquadFilterType` | `'allpass'` | Filter type                  |
| `filterFreq`      | `number`           | `2200`      | Filter frequency (Hz)        |
| `filterQ`         | `number`           | `1`         | Filter Q value               |
| `mix`             | `number`           | `0.5`       | Dry/wet ratio                |
| `reverse`         | `boolean`          | `false`     | Invert IR                    |
| `once`            | `boolean`          | `false`     | Prevent multiple connections |

**`NoiseType`** union: `'blue' | 'brown' | 'green' | 'pink' | 'red' | 'violet' | 'white'`

---

## Commands

```bash
pnpm dev              # Start demo dev server (http://localhost:5173)
pnpm build            # Type-check + production library build (dist/)
pnpm build:docs       # Build demo page (docs/)
pnpm build:analyze    # Bundle size analysis (rollup-plugin-visualizer)
pnpm build:clean      # Remove dist/
pnpm preview          # Preview docs build
pnpm lint             # Run all linters in sequence: oxlint → eslint → prettier
pnpm lint:oxlint      # oxlint --fix
pnpm lint:eslint      # eslint --fix --cache
pnpm lint:prettier    # prettier -w
pnpm type-check       # tsc --noEmit
pnpm test             # Vitest interactive watch
pnpm test:run         # Vitest single run
pnpm test:coverage    # Vitest with v8 coverage report
pnpm clean            # Clear Vite dev cache
```

Always run `pnpm lint` and `pnpm type-check` before committing. These are also enforced by husky pre-commit hooks via lint-staged.

---

## TypeScript Rules

- **No `any`** — use `unknown` and narrow with type guards.
- **Explicit return types** on exported functions.
- **Use `interface` or `type`** as appropriate; prefer `interface` for public API shapes.
- **Union literal types** instead of magic strings:
  ```ts
  type Status = 'active' | 'inactive' | 'pending';
  ```
- **Underscore prefix** for intentionally unused variables: `_value`, `_error`.
- **Array type syntax**: `string[]` not `Array<string>`.
- **Generic constructors**: left-hand side style — `const map: Map<string, User> = new Map()`.
- **Immutable shared defaults**: never mutate shared default objects.
  Use `Object.assign({}, defaults, options)` or spread (`{ ...defaults, ...options }`) to create a new instance.

---

## Import Rules

- **Always use the `@/` alias** for internal imports — relative parent traversal (`../`) is prohibited in application code:

  ```ts
  // OK
  import Reverb from '@/Reverb';
  import type OptionInterface from '@/interfaces/OptionInterface';

  // NG
  import Reverb from '../../Reverb';
  ```

  > **Exception**: test files under `src/**/__tests__/` may use `../` (rule is disabled for that scope).

- The `~` alias maps to `node_modules`.
- **Import order** (enforced by `import-x/order`, auto-fixed by `pnpm lint:eslint`):
  1. Node built-ins
  2. External packages (vitest / @vitejs / @thi.ng etc.)
  3. Internal (`@/**`)
  4. Sibling / index
  5. Type imports

  A blank line is required between each group.

---

## ESLint Disable Policy

`@eslint-community/eslint-comments/require-description` is set to `error`. Every `eslint-disable` comment **must** include a reason:

```ts
// OK
// eslint-disable-next-line @typescript-eslint/ban-ts-comment -- third-party type gap, no @types available

// NG
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
```

---

## Testing

### Unit tests (Vitest)

- Test files: `src/**/__tests__/*.ts`
- Test environment: `happy-dom` (Web Audio API mocked in `setup.ts`)
- Follow **Arrange / Act / Assert** structure.
- Mock `AudioContext` and `AudioNode` using helpers from `src/__tests__/setup.ts` — do **not** rely on real Web Audio API.
- Do **not** mutate shared `defaults` between tests — always pass options to the `Reverb` constructor.
- Coverage provider: `v8`; reports: `text`, `html`, `lcov`.

There are no E2E tests (Playwright is not used in this project).

---

## Git & PR Rules

- Commit messages follow **Conventional Commits**:
  ```
  feat(auth): add JWT refresh token rotation
  fix(api): handle 429 rate limit with exponential backoff
  docs: update README setup instructions
  ```
- PRs should be focused on a single purpose; aim for diffs under ~400 lines.
- Minimum **1 approving review** required before merging to `master`.
- PR description must include: what changed, how to test, and screenshots if UI is affected.

---

## Environment Variables

- All client-side env vars must be prefixed with `VITE_APP_`:
  ```
  VITE_APP_TITLE=My App
  VITE_APP_API_BASE_URL=https://api.example.com
  ```
- Copy `.env.example` to `.env` before running the dev server.
- Never commit `.env` — it is in `.gitignore`.
- Access via `import.meta.env.VITE_APP_*` (typed in `env.d.ts`).

---

## What NOT to Do

- Do not use `any` — use `unknown` with type guards.
- Do not use Options API (`defineComponent`, `data()`, `methods:`).
- Do not use runtime `defineProps({ title: String })` declarations.
- Do not write `../` relative imports that traverse parent directories (exception: `src/**/__tests__/` may use `../` to reach the component under test).
- Do not use `<style>` without `scoped`.
- Do not write bare `localStorage` / `sessionStorage` access — use `pinia-plugin-persistedstate`.
- Do not add `eslint-disable` comments without a description.
- Do not install packages with `npm` or `yarn` — use `pnpm` only.
