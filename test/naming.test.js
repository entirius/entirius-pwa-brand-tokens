// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.

import assert from 'node:assert/strict';
import { test } from 'node:test';
import { brandTokens, cssDeclarations, readText } from './helpers.js';

// Leaf token paths; `font.fallback.*` becomes @font-face blocks, not vars.
function* leafPaths(node, path = []) {
  if ('$value' in node) {
    yield path;
    return;
  }
  for (const [key, child] of Object.entries(node)) {
    if (!key.startsWith('$') && !(path[0] === 'font' && key === 'fallback')) yield* leafPaths(child, [...path, key]);
  }
}

const expectedName = (path) => `--brand-${path.filter((segment) => segment !== 'DEFAULT').join('-')}`;
const emittedNames = () => cssDeclarations(readText('../dist/tokens.css')).map(([name]) => name);

test('every leaf token emits exactly one var named by the rule', () => {
  const expected = [...leafPaths(brandTokens())].map(expectedName);
  assert.deepEqual([...emittedNames()].sort(), [...expected].sort());
});

test('no var is emitted twice', () => {
  const names = emittedNames();
  assert.equal(new Set(names).size, names.length);
});

test('DEFAULT segments are dropped, other segments kept', () => {
  const names = new Set(emittedNames());
  for (const name of ['--brand-glass', '--brand-accent', '--brand-gradient-accent-from', '--brand-radius-2xl']) {
    assert.ok(names.has(name), name);
  }
});

test('font fallbacks become @font-face blocks, not vars', () => {
  const css = readText('../dist/tokens.css');
  assert.match(css, /font-family: 'Inter Fallback: Arial';\s+src: local\(Arial\);\s+ascent-override: 90\.4365%;/);
  assert.match(css, /font-family: 'Lexend Deca Fallback: Arial';\s+src: local\(Arial\);/);
  assert.doesNotMatch(css, /--brand-font-fallback/);
});
