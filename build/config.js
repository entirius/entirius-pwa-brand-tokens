// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.

import StyleDictionary from 'style-dictionary';
import { cssWithFontFace, isFontFallback } from './formats/font-face.js';
import { tailwindPreset } from './formats/tailwind-preset.js';

// Naming rule (the contract): `--brand-` + path joined by `-`, `DEFAULT` segments dropped.
const brandName = (token) => ['brand', ...token.path.filter((segment) => segment !== 'DEFAULT')].join('-');

StyleDictionary.registerTransform({
  name: 'name/brand',
  type: 'name',
  transform: brandName,
});

StyleDictionary.registerTransform({
  name: 'value/brand-css-var',
  type: 'value',
  // transitive: runs after references resolve, so an alias points at its own var, not at its target's.
  transitive: true,
  transform: (token) => `var(--${brandName(token)})`,
});

// Generated files carry the MPL-2.0 notice under Style Dictionary's "do not edit" line.
StyleDictionary.registerFileHeader({
  name: 'mpl',
  fileHeader: (defaultMessage) => [
    ...defaultMessage,
    '',
    'This Source Code Form is subject to the terms of the Mozilla Public',
    'License, v. 2.0. If a copy of the MPL was not distributed with this',
    'file, You can obtain one at https://mozilla.org/MPL/2.0/.',
  ],
});

StyleDictionary.registerFormat({ name: 'css/brand-tokens', format: cssWithFontFace });
StyleDictionary.registerFormat({ name: 'javascript/tailwind-preset', format: tailwindPreset });

const isVariable = (token) => !isFontFallback(token);

const sd = new StyleDictionary({
  source: ['tokens/brand.json'],
  platforms: {
    css: {
      transforms: ['name/brand', 'fontFamily/css'],
      buildPath: 'dist/',
      files: [{ destination: 'tokens.css', format: 'css/brand-tokens', options: { outputReferences: true, fileHeader: 'mpl' } }],
    },
    scss: {
      transforms: ['name/brand', 'value/brand-css-var'],
      buildPath: 'dist/',
      files: [
        { destination: '_tokens.scss', format: 'scss/map-deep', filter: isVariable, options: { mapName: 'brand', fileHeader: 'mpl' } },
      ],
    },
    tailwind: {
      transforms: ['name/brand', 'fontFamily/css'],
      buildPath: 'dist/',
      files: [{ destination: 'tailwind-preset.js', format: 'javascript/tailwind-preset', options: { fileHeader: 'mpl' } }],
    },
  },
});

await sd.cleanAllPlatforms();
await sd.buildAllPlatforms();
