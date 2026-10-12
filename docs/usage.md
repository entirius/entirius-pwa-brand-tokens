# Usage

Entry points of `@entirius/brand-tokens`, the naming rule that ties a token path to its CSS variable and
Tailwind key, and the notes on radii and the light theme steps.

## Entry points

| Entry point | File | For |
|---|---|---|
| `@entirius/brand-tokens/tokens.css` | `dist/tokens.css` | `:root { --brand-*: … }` plus the `@font-face` fallback faces |
| `@entirius/brand-tokens/tokens.scss` | `dist/_tokens.scss` | `$brand-*` variables and the nested map `$brand` |
| `@entirius/brand-tokens/tailwind-preset` | `dist/tailwind-preset.js` | Tailwind preset: colours, gradients, radii, font families, shadows |
| `@entirius/brand-tokens/tokens.json` | `tokens/brand.json` | the source, DTCG format |

CSS — import once, then reference the vars:

```css
@import '@entirius/brand-tokens/tokens.css';

.button { background: var(--brand-accent-fill); border-radius: var(--brand-radius-xl); }
```

SCSS — every value is a `var(--brand-*)` reference, so load `tokens.css` once as well. Dart Sass resolves the
package through the `pkg:` scheme and its `NodePackageImporter` (`sass --pkg-importer=node` on the CLI); a bare
`@use '@entirius/brand-tokens/tokens.scss'` does not resolve:

```scss
@use 'sass:map';
@use 'pkg:@entirius/brand-tokens/tokens.scss' as brand;

.button { background: map.get(brand.$brand, 'accent', 'fill'); color: brand.$brand-white; }
```

```js
import { NodePackageImporter, compile } from 'sass';

compile('app.scss', { importers: [new NodePackageImporter()] });
```

webpack's `sass-loader` needs the same importer in its `sassOptions` (`importers: [new NodePackageImporter()]`).

Tailwind:

```ts
import brand from '@entirius/brand-tokens/tailwind-preset';

export default { presets: [brand], content: ['./app/**/*.{ts,tsx}'] };
```

The preset carries resolved values (no `var()`), so it works without `tokens.css`. `space` is not in the preset:
Tailwind's default spacing is the same 4 px grid.

## Naming rule

CSS var = `--brand-` + token path joined by `-`, `DEFAULT` segments dropped. Tailwind keys follow the same path, so a
class and a var of the same name carry the same value.

| Token path | CSS var | Tailwind |
|---|---|---|
| `accent.DEFAULT` | `--brand-accent` | `text-accent` |
| `accent.fill` | `--brand-accent-fill` | `bg-accent-fill` |
| `glass.tint` | `--brand-glass-tint` | `bg-glass-tint` |
| `gradient.card` | `--brand-gradient-card` | `bg-gradient-card` |
| `radius.base` / `radius.2xl` | `--brand-radius-base` / `--brand-radius-2xl` | `rounded` / `rounded-2xl` |

## Radius unit

Radii are px. `radius.4xl` is `32px`, which equals entirius.com's `rounded-4xl` (`2rem`) at the default 16 px root.
The px value is deliberate — do not rewrite it to rem.

## Light theme steps

`light.neutral.*` (50–900) is a grey scale with no blue cast for page, surfaces, borders and text; `light.tint.*`
holds low-chroma backgrounds for accent and status roles. On `light.tint.primary` only `tertiary-200` text passes AA
(5.87:1) — `tertiary-100` and `primary-200` do not.
