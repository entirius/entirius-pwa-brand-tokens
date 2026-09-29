# AGENTS.md

entirius-brand-tokens — `@entirius/brand-tokens`: the Entirius brand values in `tokens/brand.json` (DTCG), built by
Style Dictionary 4 into `dist/tokens.css`, `dist/_tokens.scss` and `dist/tailwind-preset.js`.

## Commands

| Command | Meaning |
|---|---|
| `npm ci` | install dev dependencies (Node 22, `.nvmrc`) |
| `npm run build` | regenerate `dist/` from `tokens/brand.json` |
| `npm test` | `node:test` suite: naming rule, fallback faces, preset shape, SCSS compile through `pkg:`, docs parity, baseline snapshots (the baseline vars of `dist/tokens.css` and values of `dist/tailwind-preset.js` keep their values) |
| `DOCS_BRAND_CSS=<path> npm test` | also checks every `--brand-*` var of the docs `brand.css` against `dist/tokens.css` |
| `npm run check` | build, then `git diff --exit-code dist/` — fails when `dist/` drifts from the source |

## Naming rule (the contract)

- CSS var = `--brand-` + token path joined by `-`, `DEFAULT` segments dropped (`glass.DEFAULT` → `--brand-glass`).
- Tailwind keys use the same path (`accent.fill` → `bg-accent-fill`); `radius.base` → `rounded` (`DEFAULT`).
- `font.fallback.*` is not a var: it emits `@font-face` fallback blocks in `tokens.css`.
- Renaming or removing a token is a breaking change for every consumer.

## Conventions

- `test/fixtures/*-baseline.json` are frozen snapshots: extend them only on a release, never edit them to make a
  failing test pass.
- Never edit `dist/` by hand; commit it together with the `brand.json` change that produced it.
- No `postinstall`/`prepare` scripts and no runtime dependencies: consumers install from git.
- Build code: `build/config.js` + one custom format per file in `build/formats/`.
- English only; MPL-2.0 header on JS source files (pre-commit `insert-license`) and on generated `dist/` files
  (the `mpl` file header in `build/config.js`).
- Git flow: `master` + `develop`, changes land via PR. Release = bump `version`, move the `CHANGELOG.md` section to
  the release, tag `vX.Y.Z` after the PR merges. Consumers pin the tag.
- Default: do not commit — git is the user's call.

## Commit Message Format

**NEVER add `Co-Authored-By: Claude ...` (or any other Claude/Anthropic attribution) to commit messages.**
Same rule for PR descriptions: no `Generated with [Claude Code]` footer.
