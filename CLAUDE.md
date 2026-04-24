# mui-tel-input

Phone number input component for MUI (Material UI), published on NPM as `mui-tel-input`.

## Project structure

- `src/` — Library source code (components, hooks, helpers)
- `docs/` — Documentation site (Docusaurus), deployed on GitHub Pages
- `.storybook/` — Storybook config for local development

## Commands

- `npm run build` — Build the library
- `npm run lint` — TypeScript check + ESLint
- `npm test` — Run tests with Vitest
- `npm run storybook` — Local Storybook dev server
- `npm run release -- --release-as major|minor|patch` — Bump version with standard-version

## Deploy documentation

```
cd docs && GIT_USER=viclafouch npx docusaurus deploy
```

> **Important:** Never use `pnpm deploy` or `npm run deploy` — `pnpm deploy` is a pnpm workspace command, not Docusaurus. Always use `npx docusaurus deploy` directly.

This builds the Docusaurus site and pushes to the `gh-pages` branch. The site is hosted at https://viclafouch.github.io/mui-tel-input/.

## Release workflow

1. Fix bugs / add features on `master`
2. Run `npm run release -- --release-as <type>` (builds + bumps version + creates git tag)
3. `npm publish`
4. Create a GitHub Release with changelog
5. Deploy the documentation (see above)
6. Close related issues on GitHub

## Maintenance

- Monitor open issues and pull requests on GitHub
- The library is used by 100k+ weekly downloads — changes must be well tested
- Peer dependencies: MUI, Emotion, React — keep ranges broad for consumer compatibility
- Runtime dependency: `libphonenumber-js` — bundled into the library output
