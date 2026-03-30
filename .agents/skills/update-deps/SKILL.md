---
name: update-deps
description: Audit all outdated dependencies with detailed research on changelogs, breaking changes, bug fixes, and deprecations. Creates a temporary plan without updating anything. Use when you want to review what changed in your dependencies before upgrading.
user-invocable: true
---

# Dependency Update Audit

## Pre-loaded data

!`PM="npm"; if [ -f bun.lockb ] || [ -f bun.lock ]; then PM="bun"; elif [ -f pnpm-lock.yaml ]; then PM="pnpm"; elif [ -f yarn.lock ]; then PM="yarn"; fi; echo "=== PACKAGE_MANAGER ==="; echo "$PM"; echo "=== DATE ==="; date +%Y-%m-%d; echo "=== OUTDATED ==="; if [ "$PM" = "pnpm" ]; then pnpm outdated --json 2>/dev/null || true; elif [ "$PM" = "bun" ]; then bun outdated 2>/dev/null || true; elif [ "$PM" = "yarn" ]; then yarn outdated --json 2>/dev/null || true; else npm outdated --json 2>/dev/null || true; fi; echo "=== AUDIT ==="; if [ "$PM" = "pnpm" ]; then pnpm audit --json 2>/dev/null || true; elif [ "$PM" = "npm" ]; then npm audit --json 2>/dev/null || true; elif [ "$PM" = "yarn" ]; then yarn audit --json 2>/dev/null || true; fi; echo "=== OVERRIDES ==="; node -e "const p=require('./package.json'); console.log(JSON.stringify({overrides:p.overrides,pnpmOverrides:p.pnpm?.overrides,resolutions:p.resolutions}||{}))" 2>/dev/null || echo "{}"; echo "=== DEV_DEPS ==="; node -e "console.log(JSON.stringify(Object.keys(require('./package.json').devDependencies||{})))" 2>/dev/null || echo "[]"; echo "=== PINNED ==="; node -e "const p=require('./package.json'); const all={...p.dependencies,...p.devDependencies}; const pinned=Object.entries(all).filter(([,v])=>!v.startsWith('^')&&!v.startsWith('~')&&!v.startsWith('>')).map(([k,v])=>k+': '+v); console.log(JSON.stringify(pinned))" 2>/dev/null || echo "[]"; echo "=== ENGINES ==="; node -e "const p=require('./package.json'); console.log(JSON.stringify({node:p.engines?.node,typescript:p.devDependencies?.typescript,packageManager:p.packageManager}))" 2>/dev/null || echo "{}"; echo "=== NODE_VERSION ==="; node --version 2>/dev/null || echo "unknown"`

## Arguments

If arguments were passed (e.g., `/update-deps react`, `/update-deps major`):
- If the argument is `major`, `minor`, or `patch` — filter to only that update type
- Otherwise, treat it as a package name filter — only audit packages whose name contains the argument
- If no arguments, audit all outdated packages

Arguments: $ARGUMENTS

## Step 1 — Parse and categorize

From the pre-loaded data above, build a list of every outdated package with:
- Package name
- Current version → Wanted version (within semver range) → Latest version
- **In-range**: yes if `wanted > current` (updatable without changing `package.json`), no if requires range bump
- `dependency` or `devDependency` (use DEV_DEPS list)
- Update type: **major**, **minor**, or **patch** (compare current → latest)
- **Deprecated**: check `isDeprecated` field in pnpm JSON output. Flag prominently.
- **Pinned**: check PINNED list. Note if the package has no `^`/`~` prefix (intentionally locked).
- **Has override**: check OVERRIDES data. Flag if the package appears in overrides/resolutions.
- **Security advisory**: cross-reference with AUDIT data. Flag packages with known CVEs.
- **Engine constraints**: note the project's Node.js version (from ENGINES + NODE_VERSION) and TypeScript version. Agents must check if new package versions require a newer Node.js or TypeScript.

Apply argument filters if provided. If no packages are outdated (after filtering), inform the user and stop.

**Note on bun**: `bun outdated` outputs a human-readable table, not JSON. Parse accordingly.
**Note on Yarn Berry**: Yarn v2+ may not support `yarn outdated`. If the command failed, run `yarn npm info <pkg>` per package or fall back to `npm outdated --json`.

**Scale guard**: If there are more than 40 outdated packages after filtering, inform the user of the count and suggest narrowing scope (e.g., `/update-deps major` or `/update-deps react`). Proceed only with user confirmation, or automatically limit to major + minor updates only (skip patches).

## Step 2 — Research + impact analysis (single pass, parallel agents)

Launch **parallel Agent calls**. Each agent researches the changelog AND checks codebase impact in one pass.

**Grouping strategy** (target: max 10-12 agents total):
- **One agent per package** for major updates with breaking changes expected
- **Group by ecosystem** for minor updates: all `@tanstack/*` together, all `@radix-ui/*` together, all `@sentry/*` together, all `eslint`-related together, etc. One agent per group.
- **One single agent** for all `@types/*` packages (these are routine, lightweight treatment)
- **One single agent** for all patch-only updates (lightweight: just check for security fixes and notable bugs)

### Agent prompt template

Each agent MUST receive and follow these instructions:

**Part A — Research** (for each package assigned):

Find changelog info by trying these sources **in order** — stop as soon as you get meaningful results:

1. **npm registry metadata**: run `npm view [package-name] repository.url homepage` via Bash to get the repo URL and homepage
2. **GitHub Releases page**: if repo is on GitHub, `WebFetch` on `https://github.com/[org]/[repo]/releases` — this is where most projects document breaking changes and migration guides
3. **CHANGELOG.md in repo**: `WebFetch` on `https://raw.githubusercontent.com/[org]/[repo]/main/CHANGELOG.md` (try `master` branch too if `main` 404s). Many libraries (Radix, Prisma, TanStack, etc.) maintain a `CHANGELOG.md` instead of or alongside GitHub Releases. **Important**: CHANGELOGs can be very large — only extract entries between the current and latest version, skip everything older
4. **Migration guide**: for major updates, `WebFetch` on `https://github.com/[org]/[repo]/blob/main/MIGRATION.md` or `UPGRADING.md` — some libraries ship dedicated migration docs
5. **context7 MCP**: for **major updates only**, use `resolve-library-id` then `query-docs` to get up-to-date docs. Skip for minor/patch.
6. **WebSearch** as fallback: search `"[package-name] v[latest] changelog"`, `"[package-name] v[latest] breaking changes"`, `"[package-name] v[latest] migration guide"`

If none of these sources yield meaningful info, say so honestly — do not fabricate.

**Part B — Codebase impact** (for each package assigned):
1. `Grep` for imports: `from ['"][package-name]` and `require\(['"][package-name]`
2. Count files and list key usage locations
3. For each breaking change found: check if the deprecated/removed API is used in the codebase
4. For each notable new feature: note if it could replace existing patterns
5. For each deprecation: search for the deprecated API name in `src/`
6. Check peer dependency compatibility with current `package.json`

**Return format** (already in final plan markdown — no reformatting needed):

```markdown
### [package-name] (`current` → `latest`) — dependency/devDependency

**Update type**: major/minor/patch | **In-range**: yes/no | **Pinned**: yes/no

#### Changes
- **Bug fixes**: [version]: [concrete description of what was fixed]
- **New features**: [version]: [what the feature does, not just its name]
- **Breaking changes**: [description + migration steps]
- **Deprecations**: [what was deprecated + replacement]
- **Security**: [CVE if any, severity]
- **Peer deps**: [new or changed requirements]
- **License**: [only if changed between versions — e.g., MIT → GPL. Skip if unchanged]
- **Engine requirements**: [if minimum Node.js or TypeScript version changed, compare with project's versions from ENGINES data]
- **Notable**: [perf improvements, bundle size changes, other]

#### Impact on project
- **Files using this package**: X files (`src/...`, ...)
- **Bug fixes relevant to us**: yes/no — [details]
- **New features we could use**: yes/no — [details]
- **Deprecations affecting us**: yes/no — [files using deprecated API]
- **Breaking changes requiring migration**: yes/no — [files to modify]
- **Peer dependency conflicts**: yes/no — [details]
- **Override conflicts**: yes/no — [if package is in overrides, note whether override still needed]

#### Recommendation
🟢 Update now / 🟡 Update with migration / 🔴 Blocked (reason) / ⚪ Skip (reason)

#### Migration steps (if 🟡 or 🔴)
1. ...
```

For **patch-only packages** and **`@types/*`**, use a lighter format:

```markdown
| Package | Current | Latest | In-range | Security | Notable |
|---------|---------|--------|----------|----------|---------|
| name    | x.y.z   | x.y.w  | yes/no   | none/CVE | brief   |
```

## Step 3 — Create the plan file

After ALL agents complete, write `plan-update-deps-DATE.md` (one single write, using today's date from pre-loaded data). Place it in whichever plan directory the project uses (check for `.claude/plans/`, `docs/`, or project root — prefer an existing directory; create `.claude/plans/` as default if none exists).

Structure:

```markdown
# Dependency Update Audit — [DATE]

## Summary

- **Package manager**: [detected PM]
- **X** packages outdated (Y major, Z minor, W patch)
- **Dependencies**: [count] | **Dev dependencies**: [count]
- **Security advisories**: [count] packages with known CVEs
- **Deprecated packages**: [count]

---

## Major updates

[Agent output for each major package, using the template above]

---

## Minor updates

[Agent output for each minor package/group, using the template above]

---

## Patch updates

[Lightweight table from agent output]

---

## Action plan

### 🟢 Safe to update now
- [package]: [one-line reason]

### 🟡 Update with migration needed
- [package]: [what needs to change]

### 🔴 Blocked
- [package]: [blocking reason — peer deps, breaking change too invasive, etc.]

### ⚪ Skip (no benefit / too risky)
- [package]: [reason]
```

## Rules

- **This is an audit only.** NEVER run install, update, add, or any command that modifies `package.json`, lockfiles, or source code. No `npm install`, `pnpm update`, `yarn add`, `bun add`, etc.
- If changelog/release info is unavailable, say so honestly — do not fabricate
- For packages with dozens of patch releases, focus on the most impactful changes (security, major bugs), not every single patch
- The plan file is temporary — the user will delete it after applying updates manually
- Linting is NOT needed (no code changes)
- Do NOT update any existing plan files — this audit is standalone
- Use the detected package manager consistently — never switch to a different one
