// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.

import { fileHeader } from 'style-dictionary/utils';

const flatKey = (path) => path.filter((segment) => segment !== 'DEFAULT').join('-');

// Tailwind `theme.extend` section → which tokens it takes and the key path of a token in it.
// Keys follow the token path, so a class and a `--brand-*` var of the same name carry the same value.
const SECTIONS = {
  colors: {
    take: (token) => token.$type === 'color' && token.path[0] !== 'gradient',
    key: (token) => token.path,
  },
  backgroundImage: {
    take: (token) => token.$type === 'gradient',
    key: (token) => [flatKey(token.path)],
  },
  borderRadius: {
    take: (token) => token.path[0] === 'radius',
    key: (token) => [token.path[1] === 'base' ? 'DEFAULT' : token.path[1]],
  },
  fontFamily: {
    take: (token) => token.path[0] === 'font' && token.path[1] === 'family',
    key: (token) => [token.path[2]],
  },
  boxShadow: {
    take: (token) => token.$type === 'shadow',
    key: (token) => [flatKey(token.path[0] === 'shadow' ? token.path.slice(1) : token.path)],
  },
};

function setIn(target, keys, value) {
  const parent = keys.slice(0, -1).reduce((node, key) => (node[key] ??= {}), target);
  parent[keys.at(-1)] = value;
}

export async function tailwindPreset({ dictionary, file }) {
  const extend = {};
  for (const [section, { take, key }] of Object.entries(SECTIONS)) {
    dictionary.allTokens.filter(take).forEach((token) => setIn(extend, [section, ...key(token)], token.$value));
  }
  const header = await fileHeader({ file });
  return `${header}export default ${JSON.stringify({ theme: { extend } }, null, 2)};\n`;
}
