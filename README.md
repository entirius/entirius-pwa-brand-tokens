# entirius-pwa-brand-tokens

The brand values of Entirius, the open-source modular ecommerce platform: one file, `tokens/brand.json`, builds
into CSS variables, SCSS and a Tailwind preset. The CMS, the documentation site and entirius.com consume it. Brand
rules and roles are published at https://docs.entirius.com/; this package holds the values only.

## What it does

- Keeps every brand primitive (colours, gradients, radii, spacing, fonts, shadows) in one DTCG file.
- Builds `--brand-*` CSS variables, with `@font-face` fallback faces.
- Builds `$brand-*` SCSS variables and the nested map `$brand`.
- Builds a Tailwind preset whose keys follow the same token paths as the CSS variables.
- Ships the built files in the repository, so nothing builds on install.

## Installation

The package (`@entirius/brand-tokens`) is not in a registry: install it as a git dependency pinned to a tag, picked
from https://github.com/entirius/entirius-pwa-brand-tokens/tags.

```shell
npm install github:entirius/entirius-pwa-brand-tokens#<tag>
```

## Quick start

Import the variables once, then reference them:

```css
@import '@entirius/brand-tokens/tokens.css';

.button { background: var(--brand-accent-fill); border-radius: var(--brand-radius-xl); }
```

The SCSS and Tailwind entry points and the naming rule are in
https://github.com/entirius/entirius-pwa-brand-tokens/blob/develop/docs/usage.md.

## Requirements

- No runtime dependencies; consumers need only a bundler that resolves package exports.
- The SCSS entry point needs Dart Sass with its `NodePackageImporter`; the preset needs Tailwind CSS.
- Building the package: Node.js 20.19 or newer and npm.

## Documentation

- Usage (entry points, naming rule, radius unit, light theme steps):
  https://github.com/entirius/entirius-pwa-brand-tokens/tree/develop/docs
- Entirius documentation: https://docs.entirius.com/
- Changelog: https://github.com/entirius/entirius-pwa-brand-tokens/blob/develop/CHANGELOG.md

## Part of Entirius

One source for the look of the Entirius frontends and sites.

- Admin CMS (consumes the tokens): https://github.com/entirius/entirius-pwa-cms
- Storefront: https://github.com/entirius/entirius-pwa-storefront
- Docker harness: https://github.com/entirius/entirius-zeno

## Development

```shell
npm ci           # install dev dependencies
npm run build    # regenerate dist/ from tokens/brand.json
npm test         # node:test suite
npm run check    # build, then fail when dist/ drifts from the source
```

Change a value:

1. Edit `tokens/brand.json` (never `dist/`).
2. `npm run build`, then `npm test`. The tests hold the baseline CSS variables and Tailwind preset values against
   frozen snapshots in `test/fixtures/`: a changed value fails until the snapshot is updated on a release.
3. Commit `brand.json` and `dist/` together. CI runs `npm run check`, which fails when `dist/` drifts.

Development and agent instructions: https://github.com/entirius/entirius-pwa-brand-tokens/blob/develop/AGENTS.md

## License

Mozilla Public License 2.0 (MPL-2.0) — see https://github.com/entirius/entirius-pwa-brand-tokens/blob/develop/LICENSE.
