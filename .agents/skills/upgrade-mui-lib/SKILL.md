---
name: upgrade-mui-lib
description: Upgrade all dependencies in a MUI component library (mui-tel-input, mui-color-input, mui-otp-input, etc.) to the latest versions. Applies known breaking changes and migration steps automatically.
user-invocable: true
---

# Upgrade MUI Library Dependencies

Upgrade all dependencies for a MUI component library project. This skill has pre-baked knowledge of breaking changes — no research agents needed.

## Pre-loaded data

!`echo "=== NODE ==="; node -v; echo "=== OUTDATED ==="; npm outdated --json 2>/dev/null || true; echo "=== PACKAGE_JSON ==="; cat package.json`

## Step 1 — Install safe minor/patch updates

Update all packages within their current semver range first:

```bash
npm update
```

Then update devDependencies that have new minor/patch versions outside the range (bump the `^` range in package.json):

- `@babel/core`, `@emotion/styled`, `@mui/material`, `@testing-library/*`, `@types/react`, `@types/react-dom`, `babel-loader`, `prettier`, `react`, `react-dom`, `vite-plugin-dts`, `husky`

Use `npm install <pkg>@^latest-minor --save-dev` for each.

## Step 2 — Major upgrades with known migrations

Apply these major upgrades **one by one**, using `--legacy-peer-deps` if Storybook causes conflicts:

### Vite 6/7 → 8

```bash
npm install vite@^8 @vitejs/plugin-react@^6 --save-dev --legacy-peer-deps
```

**Config migration** (`vite.config.ts`):
- Replace `rollupOptions` → `rolldownOptions` (Vite 8 uses Rolldown, not Rollup)
- Remove `output.globals` (useless for ES-only builds)
- Replace `__dirname` → `import.meta.dirname`
- Remove `rollup-plugin-peer-deps-external` — replace with manual external config:

```ts
import pkg from './package.json' with { type: 'json' }

const external = [
  ...Object.keys(pkg.peerDependencies ?? {}),
  'react/jsx-runtime',
  /^@mui\/material\//
]

// In build config:
rolldownOptions: {
  output: { sourcemapExcludeSources: true },
  external
}
```

- Remove `peerDepsExternal()` from plugins array
- Run `npm uninstall rollup-plugin-peer-deps-external`

### Vitest 3 → 4

```bash
npm install vitest@^4 --save-dev
```

**Config migration**:
- Add `exclude: [...configDefaults.exclude, '**/dist/**']` to `test` config (Vitest 4 simplified default excludes)
- Import `configDefaults` from `vitest/config`
- `vi.restoreAllMocks()` behavior changed — add `afterEach(() => { vi.restoreAllMocks() })` in test files where spies accumulate across tests
- `toBeCalledTimes` → `toHaveBeenCalledTimes` (deprecated)

### TypeScript 5 → 6

```bash
npm install typescript@^6 --save-dev
```

**Config migration** (`tsconfig.json`):
- Remove `baseUrl` — inline the path into `paths` entries:
  - Before: `"baseUrl": "./src"`, `"paths": { "@foo/*": ["foo/*"] }`
  - After: `"paths": { "@foo/*": ["./src/foo/*"] }`
- Fix any bare imports that relied on `baseUrl` (e.g., `from 'index.types'` → `from '../../index.types'`)

**Config migration** (`tsconfig.node.json`):
- Change `"moduleResolution": "node"` → `"moduleResolution": "bundler"`

### ESLint config (viclafouch v4 → v5)

```bash
npm install @viclafouch/eslint-config-viclafouch@^5 --save-dev
```

**Config migration** (`eslint.config.js`):
- `baseConfig` from `index.mjs` no longer exists — all base rules are now in `typescriptConfig`
- Use named exports from package root instead of individual `.mjs` file imports
- New configs available: `jsxA11yConfig`, `testingLibraryConfig`
- `prettierConfig` must be last

```js
import {
  hooksConfig,
  importsConfig,
  jsxA11yConfig,
  prettierConfig,
  reactConfig,
  testingLibraryConfig,
  typescriptConfig
} from '@viclafouch/eslint-config-viclafouch'

export default [
  { ignores: ['**/node_modules/**', '**/dist/**'] },
  ...typescriptConfig,
  ...reactConfig,
  ...hooksConfig,
  ...importsConfig,
  ...jsxA11yConfig,
  ...testingLibraryConfig,
  ...prettierConfig,
  { rules: { 'unicorn/filename-case': 'off' } }
]
```

**Note**: ESLint 10 is blocked by `eslint-plugin-import`. Stay on ESLint 9 latest:

```bash
npm install eslint@^9 --save-dev
```

### jsdom 26 → 29

```bash
npm install jsdom@^29 --save-dev
```

No config changes needed. Images with `alt=""` get `role="presentation"` — update tests using `getByRole('img')` if flag images are decorative.

### Storybook 8 → 10

Run the official migration CLI:

```bash
npx storybook@latest upgrade
```

This handles addon restructuring automatically. After:
- `@storybook/addon-actions`, `@storybook/addon-essentials`, `@storybook/addon-interactions` are removed
- `@storybook/addon-docs`, `eslint-plugin-storybook` are added
- Update story imports: `from '@storybook/react'` → `from '@storybook/react-vite'`
- Update action imports: `from '@storybook/addon-actions'` → `from 'storybook/actions'`

**If `skipLibCheck: false` causes TS errors in `ast-types` (Storybook dep)**, set `skipLibCheck: true`.

### @types/node

Move from `dependencies` to `devDependencies` and update:

```bash
npm uninstall @types/node --legacy-peer-deps
npm install @types/node@^25 --save-dev --legacy-peer-deps
```

## Step 3 — Fix lint errors

Run `npx eslint . --fix` to auto-fix import sorting and prettier formatting introduced by the config changes.

Remaining manual fixes typically needed:
- `toSorted()` instead of `[...arr].sort()` (`unicorn/no-array-sort`)
- `.forEach()` → `for...of` (`unicorn/no-array-for-each`)
- `undefined` removal (`unicorn/no-useless-undefined`)
- `interface` → `type` (`@typescript-eslint/consistent-type-definitions`) — **revert if the interface is exported and consumers may use declaration merging**

## Step 4 — Verify

Run all three checks:

```bash
npm run lint
npm run build
npx vitest run
```

All must pass before considering the upgrade complete. Fix any remaining issues.

## Step 5 — Act warnings cleanup

If `npx vitest run --reporter=verbose 2>&1 | grep stderr` shows act warnings:
- Convert synchronous `fireEvent.click` helpers to async `userEvent.click`
- Add `await` to all callers
- Suppress expected `console.error` in tests with `vi.spyOn(console, 'error').mockImplementation(() => {})`

## Rules

- Always use `--legacy-peer-deps` when Storybook causes peer dependency conflicts with Vite 8
- Never upgrade ESLint to v10 until `eslint-plugin-import` supports it
- This is a LIBRARY — never bundle `libphonenumber-js` or peer dependencies into the output
- Keep `peerDependencies` ranges broad for consumer compatibility
- Run lint + build + tests after EACH major upgrade to catch issues early
