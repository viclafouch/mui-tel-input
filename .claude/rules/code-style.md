## Code Style

Expert code simplification and review specialist. Enhances code clarity, consistency, and maintainability while preserving exact functionality. Prioritizes readable, explicit code over compact solutions.

## Scope

Analyze recently modified code and apply refinements. Focus on code touched in the current session unless instructed otherwise.

## Core Principles

### 1. Preserve Functionality and Type Contracts
Never change what the code does - only how it does it. All original features, outputs, and behaviors must remain intact.

**Never remove explicit types that serve as contracts** — return types that constrain a function's output to a specific shape or union, types validated against library/external types, or `as const satisfies Type` patterns. If an explicit type would catch a bug at compile time that inference alone would miss, it must stay.

### 2. Clarity Over Brevity
- **Avoid nested ternaries** - prefer switch/if-else for multiple conditions
- Choose explicit code over compact one-liners
- Dense code is not better code

### 3. Maintain Balance
Avoid over-simplification that could:
- Reduce maintainability
- Create "clever" solutions hard to understand
- Combine too many concerns
- Remove helpful abstractions
- Prioritize "fewer lines" over readability

## Review Checklist

### Naming Conventions
- Variables: descriptive, meaningful names
- Booleans: `is*`, `has*`, `should*`, `can*`
- Boolean functions: `matchIs*`, `matchAs*`
- Event handlers: `handle*`, `on*`
- No single-letter variables
- No abbreviations unless universal (`id`, `url`, `api`)

### Self-Documented Code
- Code readable without comments
- Complex logic extracted into well-named functions
- Magic numbers replaced with named constants
- No comments - code should speak for itself

### Unicode
- Write UTF-8 directly, never `\uXXXX` for printable characters: `"Début"` not `'D\u00e9but'`
- Invisible characters (`\u00a0`, `\u200b`): use named constants

### JSX
- No empty lines between sibling JSX elements (blank lines are forbidden inside JSX blocks)

### Conditionals
- **Always use ternary** instead of `&&` for conditional expressions

### No Unnecessary Abstractions
**FORBIDDEN:**
- Wrapper functions that just call another function
- Re-exporting without transformation
- Abstractions "for future use"

**Justified when:**
- Adding error handling, logging, or transformation
- Combining multiple calls
- Providing simpler API for complex operations

### Function Parameters
- **Max 2 positional parameters** - use object destructuring beyond that
- Define a dedicated type for the params object (named `*Params`)
- Required properties first, optional last in type definition
- Destructure directly in function signature, not in body

### Arrow Functions
- **Always use block body with explicit `return`** — never use implicit returns
- **Never remove curly braces** from arrow functions
- This applies to all arrow functions: callbacks, handlers, `.map()`, `.filter()`, etc.

### Eslint Disables

- **NEVER disable a rule at the file level** (`/* eslint-disable rule-name */`) — only per-line (`// eslint-disable-next-line rule-name`)
- **Exception : `no-console`** — seule règle autorisée en disable global fichier (`/* eslint-disable no-console */`)
- Always include a description explaining why: `// eslint-disable-next-line rule-name -- reason`
- Before disabling, ask: can the rule be satisfied by fixing the code? If yes, fix it
- A disable is only justified when the rule conflicts with a library API, a specific pattern that cannot be avoided, or a known eslint false positive
- If the same rule is disabled on many lines in a file, that is a code smell — reconsider the approach

### Code Structure
- Functions do one thing well
- Under 30 lines when possible
- Max 3 levels of nesting
- Early returns over nested conditions
- Group related code together

### No Mutations

Never mutate objects or arrays. Always return new instances.
Use `toSorted()`, `toReversed()`, spread operators, etc.

### Modern Web APIs
Always use native modern APIs (Intl, URLSearchParams, structuredClone, etc.) instead of manual implementations or libraries.

### Single Source of Truth

**NEVER duplicate constants, helpers, or types across files.**

**Global constants** (used across multiple features):
- `src/constants/` - One file per domain (`booking.ts`, `court.ts`)
- `src/constants/types.ts` - Shared types
- `src/helpers/` - Pure utility functions

**Component-specific constants** (used only by one component/feature):
- Co-locate with the component in a `constants.ts` file
- Example: `booking-modal/constants.ts` for modal-specific config
- Import with relative path: `from './constants'`

Before creating a constant or helper, search if it already exists.

### Extract & Reuse (CRITICAL)

Before writing ANY function, component, type, or constant inside a feature file, ask: **"Could this be reused elsewhere?"** If yes (or even maybe), extract it immediately — not later.

**What to extract:**
- **Pure functions** (formatting, validation, string manipulation) → shared helpers
- **Generic UI components** (dialogs, confirm modals, badges, cards) → shared components. Never define a reusable UI pattern inline in a page/feature file.
- **Custom hooks** (state logic, effects, mutations) → dedicated hook files
- **Types shared across files** → co-locate with the source or in shared type files

**When writing new code:**
- Scan existing helpers, components, and hooks FIRST — the function you need may already exist
- If you define something locally and realize it's generic, extract it in the same task — don't leave it for later
- If a sub-component is defined locally in a file, ask whether another file could benefit from it

**Red flags (things that should NOT live in feature/page files):**
- Pure functions with no dependency on local state or props
- UI components that receive generic props (title, description, onConfirm, etc.)
- Logic that appears in 2+ files in slightly different forms

### Helpers vs Utils

All utilities live in `src/`:

- `src/lib/` - Generic utilities (cn, etc.)
- `src/helpers/` - Generic pure functions (date formatting, string manipulation)
- `src/utils/` - Business utilities
- `src/constants/` - All constants, grouped by domain

**Rules:**
- Pure functions, no side effects
- One file per domain