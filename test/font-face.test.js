// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.

import assert from 'node:assert/strict';
import { test } from 'node:test';
import { brandTokens, readText } from './helpers.js';

const fallbackFamilies = () =>
  Object.values(brandTokens().font.family)
    .filter((token) => typeof token === 'object' && '$value' in token)
    .flatMap((token) => token.$value)
    .filter((family) => family.includes(' Fallback: '));

const fontFaceFamilies = (css) =>
  new Set([...css.matchAll(/@font-face\s*\{[^}]*?font-family:\s*'([^']+)'/g)].map(([, family]) => family));

test('every fallback family named in font.family has an @font-face block of the same name', () => {
  const referenced = fallbackFamilies();
  const declared = fontFaceFamilies(readText('../dist/tokens.css'));
  assert.ok(referenced.length > 0, 'no fallback family referenced in font.family');
  for (const family of referenced) assert.ok(declared.has(family), `no @font-face for '${family}'`);
});
