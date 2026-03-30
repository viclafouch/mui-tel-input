## Documentation & Sync

### Principle

- **CLAUDE.md** = Operational instructions (stack without versions, commands, tools)
- **Plans** = Detailed specs, milestones, exact versions
- **package.json** = Source of truth for versions

Never put version numbers in CLAUDE.md (sync risk).

### After Code Changes

1. Update plan if applicable (check milestones, add libs)
2. Verify CLAUDE.md remains valid (stack, patterns)
3. `pnpm lint:fix`

### Adding a Dependency

1. Check if already installed
2. Consult official docs for peer dependencies
3. Install with exact required versions
4. Document in the plan

### Removing a Dependency

1. Remove from `package.json`
2. `pnpm install`
3. Search and remove orphan imports
4. Remove from plan

### Checklist

- [ ] Plan up to date (milestones, libs)
- [ ] CLAUDE.md consistent
- [ ] No orphan imports
- [ ] `pnpm lint:fix` passes
