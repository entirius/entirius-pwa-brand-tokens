// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.

import StyleDictionary from 'style-dictionary';

// `font.fallback.*` holds metric overrides for local() fallback faces, not CSS variables.
export const isFontFallback = (token) => token.path[0] === 'font' && token.path[1] === 'fallback';

const titleCase = (kebab) =>
  kebab
    .split('-')
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(' ');

// `lexend-deca-arial` → family 'Lexend Deca Fallback: Arial' drawn from local(Arial).
function fontFaceBlock(token) {
  const key = token.path.at(-1);
  const split = key.lastIndexOf('-');
  const font = titleCase(key.slice(0, split));
  const local = titleCase(key.slice(split + 1));
  const overrides = Object.entries(token.$value).map(([property, value]) => `  ${property}: ${value};`);
  return ['@font-face {', `  font-family: '${font} Fallback: ${local}';`, `  src: local(${local});`, ...overrides, '}'].join(
    '\n',
  );
}

// css/variables for every token except the fallbacks, then one @font-face block per fallback.
export async function cssWithFontFace(args) {
  const { dictionary } = args;
  const variables = { ...dictionary, allTokens: dictionary.allTokens.filter((token) => !isFontFallback(token)) };
  const css = await StyleDictionary.hooks.formats['css/variables']({ ...args, dictionary: variables });
  const fontFaces = dictionary.allTokens.filter(isFontFallback).map(fontFaceBlock);
  return `${css}\n${fontFaces.join('\n\n')}\n`;
}
