---
name: react-useeffect
description: Audit React components for unnecessary useEffect hooks. Use when reviewing code that has useEffect, useState patterns, or when asked to optimize React components. Identifies anti-patterns like derived state, chained effects, event-driven effects and suggests better alternatives (computed values, useMemo, key prop, event handlers, useSuspenseQuery).
user-invocable: true
---

# React useEffect Best Practices

Effects are escape hatches - they should primarily synchronize with external systems. Many common use cases don't actually require Effects.

## Key Recommendations

**Avoid Effects for:**
- Computing derived values (calculate during render instead)
- Handling user interactions (use event handlers)
- Managing state chains (compute state in handlers)
- Responding to prop changes (use the `key` prop)

**Use Effects for:**
- Synchronizing with external systems (non-React widgets, browser APIs)
- Subscriptions and analytics
- Data fetching with proper cleanup

## The Decision Framework

Ask yourself: Is this responding to a user interaction (event handler), component appearance (effect), prop/state change needing derivation (calculate during render), or prop-based reset (key prop)?

This approach reduces unnecessary Effects, improving performance and maintainability.

## Additional Resources

- [anti-patterns.md](./anti-patterns.md) - Common mistakes to avoid
- [alternatives.md](./alternatives.md) - Better solutions for each anti-pattern
