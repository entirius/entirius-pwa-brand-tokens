// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.

import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import { test } from 'node:test';
import { compileString } from 'sass';

const dist = fileURLToPath(new URL('../dist', import.meta.url));

test('_tokens.scss compiles and its map yields var() references', () => {
  const source = `
    @use 'sass:map';
    @use 'tokens' as brand;
    .fill { background: map.get(brand.$brand, 'accent', 'fill'); }
    .black { color: brand.$brand-black; }
  `;
  const { css } = compileString(source, { loadPaths: [dist] });
  assert.match(css, /background: var\(--brand-accent-fill\);/);
  assert.match(css, /color: var\(--brand-black\);/);
});
