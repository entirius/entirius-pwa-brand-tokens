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
