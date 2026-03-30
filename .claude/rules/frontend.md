---
paths: ["src/**/*.{ts,tsx}"]
---

## Frontend design

### React
- Use `React.useState`, `React.useEffect`, etc. — never destructure React imports.
- **Use `useMutation`** for async operations (forms, API calls) instead of multiple `useState` and manual state management for loading/success/error.
- **NEVER use `useCallback` or `useMemo`** unless you have a proven performance problem. These are premature optimizations that add complexity without benefit in 99% of cases. Only valid uses:
  - Passing callbacks to heavily memoized child components (`React.memo`)
  - Expensive computations that are measurably slow (profile first)
  - Dependencies in `useEffect` that would cause infinite loops without memoization
- **NEVER return null in child components** - conditional rendering must happen in the parent, not inside the child. If a component might not render, the parent decides whether to render it at all. Child components should always render something when called.
- **Use functional updates for state derived from previous state** - `setState(prev => !prev)` instead of `setState(!state)`. This avoids bugs with React's batching.
- **Extract logic into custom hooks** - any useEffect, useState combo, or reusable logic should become a custom hook in `src/hooks/`. Keep components focused on rendering. Hooks go in dedicated files named `use-*.ts`.

### Libraries
- ALWAYS use shadcn components instead of raw HTML elements, `<Input>` instead of `<input>`,`<Textarea>` instead of `<textarea>`, etc.
- **Never modify code** in `src/components/ui`, `src/components/kibo-ui`, or `src/components/animate-ui` folders - run `pnpm run lint:fix` first (auto-fixes formatting), then add `/* eslint-disable */` at the top of files to ignore remaining errors.
- **No margins on icons in buttons** - shadcn Button has built-in `gap` spacing

### TanStack Query
- **Never destructure** `useQuery`/`useSuspenseQuery` results - use inferred types
- Name variables with `*Query` suffix: `const currentUserQuery = useSuspenseQuery(...)`
- Access data via `query.data`, status via `query.isPending`, etc.
- **Never create intermediate variables** for `query.data` - use `query.data` directly everywhere

### Server Functions (TanStack Start)
- Use `useMutation` (TanStack Query) for async operations
- Use `mutation.isPending`, `mutation.isError`, `mutation.error` - never `useState` for loading/error
- Always display `mutation.error` with `getErrorMessage()` helper
- Name: `*Mutation` suffix

### Execution Boundaries (TanStack Start)
- **`createServerOnlyFn`** for utility functions accessing DB, env vars, or server-only APIs - crashes if called from client
- **`createClientOnlyFn`** for utility functions using `window`, `localStorage`, or browser-only APIs - crashes if called from server
- **`createServerFn`** for RPC calls (client can call, executes on server via network request)
- Place server-only utilities in `src/utils/` wrapped with `createServerOnlyFn`

### Forms
- **TanStack Form** + **Zod** + **useMutation** for submission

### Accessibility (WCAG 2.1 AA)
- Keyboard navigation support
- Screen reader compatibility
- Focus management
- ARIA attributes usage
- Labels with `htmlFor`/`id` matching
- `aria-invalid`, `aria-describedby` on inputs
- `role="alert"` on error messages
- `aria-busy` on loading buttons
- `aria-hidden` on decorative icons
- **Color contrast**: minimum 4.5:1 for normal text, 3:1 for large text. Never use `text-gray-500` or lighter on `bg-gray-50`/`bg-white` for readable content. Use `text-gray-600` minimum for secondary text, `text-gray-700` or darker recommended
- **Touch targets**: minimum 44x44px on interactive elements (buttons, links). Add `py-1` or `py-2` on text-only links to ensure sufficient height
- **External links**: always use `target="_blank"` with `rel="noopener noreferrer"`. When text mentions URLs or external resources (sources, LinkedIn, GitHub), render them as clickable `<a>` links, not plain text

### UX Patterns
- **Never disable buttons** - always allow clicks, explain constraints in dialog/feedback
- Show "why not" instead of blocking - users understand context better than silent disabled states

### JSX Size Limit
- **Max 200 lines** for components with specific logic (forms, modals, interactive features)
- Split into sub-components when exceeded (e.g., FormField, SuccessState, etc.)
- Static content pages (mentions légales, CGV) are exempt

### Separation of Concerns
- Each file has **one clear responsibility**
- Extract logic into dedicated files organized by domain (`components/auth/`, `hooks/`, `lib/`)
- Keep entry points minimal - they orchestrate, not implement

### Component Architecture
- Reusable component patterns
- Props API design
- State management decisions
- Composition vs inheritance
- Error boundary placement

### Responsive Design
- Mobile-first approach
- Breakpoint strategy
- Touch-friendly interactions
- Drawer patterns (mobile filters)
- Adaptive layouts

### Performance
- Core Web Vitals optimization
- Bundle size management
- Lazy loading strategies
- Image optimization
- Font loading

### Tailwind CSS
- **No arbitrary values in components** (e.g., `font-[Bricolage_Grotesque]`, `text-[14px]`)
- Define custom utilities in global CSS (`app.css`) and reuse them
- Keep styling consistent: one source of truth for design tokens (fonts, colors, spacing)
- If a value is used more than once, it should be a utility class or CSS variable
- **Prefer `gap`/`space-y`/`space-x`** over `mt-*`/`mb-*` for spacing between siblings

### Attribute-Driven Styling
- **Never use dynamic classes for state** — use `aria-*` or `data-*` attributes on the element, then style with Tailwind modifiers (`aria-selected:bg-primary`, `data-active:bg-accent`)
- **Tailwind `data-*` shorthand** — use `data-foo:` instead of `data-[foo]:` for boolean data attributes. Use bracket syntax `data-[foo=value]:` only when matching a specific value
- Avoid `cn("bg-muted", isActive && "bg-primary")` — prefer setting an attribute and letting CSS handle the rest
- **Exceptions**: variant props (size, color), layout changes without a semantic attribute, third-party constraints

### Hover & Interaction Consistency
- **No custom hover effects** that don't exist elsewhere on the site
- **Forbidden hover effects**: `hover:scale-*`, `hover:rotate-*`, `hover:-translate-y-*` (lift effects)
- **Allowed hover effects**: `hover:bg-*`, `hover:text-*`, `hover:border-*` (color transitions only)
- Buttons already have built-in hover states via shadcn - don't override with custom transforms
- Links use `hover:text-primary` or `hover:text-foreground` - keep it simple
- **Consistency over creativity**: match existing patterns, don't invent new interactions

### Animations (Framer Motion)
- **Use Framer Motion** for all UI animations - no CSS transitions for interactive elements
- **AnimatePresence** for enter/exit animations (notifications, modals, toasts)
- **layout prop** for smooth layout shifts when elements appear/disappear
- **Prefer `motion` components** over CSS animations for:
  - Notifications and alerts (slide in/out)
  - Modal/dialog transitions
  - List item additions/removals
  - Page transitions
  - Hover/tap interactions
- **Respect `prefers-reduced-motion`** - use `useReducedMotion()` hook
- **Standard durations**: 0.2s (fast), 0.3s (normal), 0.5s (slow)
- **Standard easings**: `[0.4, 0, 0.2, 1]` (ease-out), `[0.4, 0, 1, 1]` (ease-in)
- **CSS transitions exception**: when CSS transitions are used (accordion, collapse), add a named CSS class and include it in the `@media (prefers-reduced-motion: reduce)` block in `styles.css` with `transition: none`

### SEO Checklist (new pages)
- Every new route MUST be added to the sitemap (`sitemap[.]xml.ts`)
- Every route MUST define `head()` with `seo()` (title, description, keywords, pathname)
- Structured data (JSON-LD) for rich pages (FAQ, product, etc.)
- When content references external URLs, render them as clickable links (benefits SEO link signals and user trust)