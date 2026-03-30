---
paths:
  - "**/*.{ts,tsx}"
---

## TypeScript Rules

### TRUST INFERENCE (CRITICAL - MOST IMPORTANT RULE)

TypeScript's inference is extremely powerful. Let it do its job.

**NEVER add explicit types when TypeScript can infer them correctly:**
- NO type annotations on variables initialized with a value
- NO type annotations on parameters with default values
- NO type annotations on function expressions or arrow functions

**Explicit types ARE required when inference is too loose:**
- Return types on functions where TypeScript infers a wider type than intended (e.g. `string` instead of a union, `object` instead of a specific shape)
- Return types on functions that build data conforming to an external type or contract (library types, API responses, schemas)
- `as const satisfies Type` on constants that need both literal preservation and type validation
- Uninitialized variables
- Generic type parameters that cannot be inferred
- Type narrowing with `as` when inference is impossible

**Rule of thumb:** if removing a type annotation would let invalid values pass silently at compile time, the annotation is necessary. If it just repeats what TypeScript already knows, remove it.

### Type Safety — Single Source of Truth (CRITICAL)

**NEVER hand-write a type when it can be derived from an existing source.** This applies universally — any library, ORM, internal code, constants, or schema.

**Derivation techniques (use the first one that fits):**
- `typeof myConstant` — derive from a runtime value
- `ExistingType['field']` — indexed access to pick a field type
- `ORM.ModelGetPayload<{ select: typeof SELECT }>` — derive from an ORM select/query constant
- `ReturnType<typeof fn>` / `Awaited<ReturnType<typeof fn>>` — derive from function output
- `Pick<T, 'a' | 'b'>` / `Omit<T, 'c'>` — subset of an existing type
- `T & { extra: string }` — extend an existing type with additional fields

**A hand-written type is ONLY justified when:**
- No source type exists to derive from (genuinely new domain concept)
- The type narrows a source type in a way derivation cannot express (e.g. replacing `string` with a union)
- Even then, derive what you can and only hand-write the narrowed/added fields

**Violation examples:**
- Writing `{ id: string; name: string; email: string }` when a library/ORM already has this shape → use `GetPayload`, `Pick`, or indexed access
- Copying field types from one type into another instead of intersecting/extending
- Defining `{ startedAt: Date | null; endsAt: Date | null }` when a select constant already produces these types → use `Row['field']`

**NEVER use `string` when a stricter type exists** in a library or the codebase — always use the library's own types to constrain values (route paths, query keys, event names, etc.). Extend or intersect library types instead of rewriting them with loose primitives.

### Constants Pattern (CRITICAL)
- **Arrays/Objects MUST use `as const satisfies Type`** — both parts are required. `as const` alone is NOT enough because it skips type validation. Always define a dedicated type and validate with `satisfies`.
  - WRONG: `const ITEMS = [...] as const`
  - CORRECT: `const ITEMS = [...] as const satisfies readonly ItemType[]`
- Primitives: simple assignment, no annotations

### Error Handling
- Every promise must have error handling
- Operations that can fail must run BEFORE irreversible mutations
