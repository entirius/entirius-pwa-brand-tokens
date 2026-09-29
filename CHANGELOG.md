# Changelog

All notable changes to this project will be documented in this file.

## [0.1.0] (unreleased)

### Added

- `tokens/brand.json`: the Entirius brand primitives in DTCG format — neutral, brand and status colour scales,
  roles (`accent`, `accent-fill`, `on-accent-fill`), glass and hairline, named gradients, radius scale, 4 px space
  grid, font families, weights and tracking, Arial fallback metrics, shadows, glows and the `light.*` steps for
  app light themes.
- `dist/tokens.css`: `--brand-*` CSS variables (aliases stay `var()`), plus `@font-face` fallback faces for Inter
  and Lexend Deca. Covers every var of the docs `brand.css` with the same values.
- `dist/_tokens.scss`: `$brand-*` variables and the nested map `$brand`, all `var(--brand-*)` references.
- `dist/tailwind-preset.js`: Tailwind preset with colours, `gradient-*` background images, radius scale
  (`base` → `DEFAULT`), font families and shadows; covers the brand keys of entirius.com `tailwind.config.ts`.
- `npm run check` and CI: the build must reproduce the committed `dist/`.
- Repo tooling: pre-commit with gitleaks v8.30.0, the canonical gitleaks config guards and `insert-license`
  (MPL-2.0 header); generated `dist/` files carry the MPL-2.0 header too.
- Tests: `tokens.scss` compiles through `pkg:@entirius/brand-tokens` with Sass's `NodePackageImporter`, and every
  `* Fallback: *` family named in `font.family.*` has a matching `@font-face` block.
- `light.neutral.*` (50–900) and `light.tint.*` (`primary`, `positive`, `negative`, `informative`, `notice`): calmer
  steps for app light themes — a grey scale with no blue cast for page, surfaces, borders and text, and subtle
  backgrounds at half the chroma of the `light.*.50` tints. Additive: every existing var keeps its name and value
  (test against a snapshot of the previous `dist/tokens.css`).

### Notes

- `radius.4xl` is `32px`, equal to entirius.com's `2rem` at the default 16 px root. Radii stay px on purpose.
