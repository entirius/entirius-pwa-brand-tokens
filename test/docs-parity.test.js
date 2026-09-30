// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.

import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { cssDeclarations, readText, resolveVars } from './helpers.js';

// entirius-docs src/styles/brand.css is the hand-written mirror this package replaces.
const docsPath = process.env.DOCS_BRAND_CSS;

test('every docs brand.css var exists in dist/tokens.css with the same value', { skip: !docsPath }, () => {
  const docs = new Map(cssDeclarations(readFileSync(docsPath, 'utf8')));
  const dist = new Map(cssDeclarations(readText('../dist/tokens.css')));
  assert.ok(docs.size > 0, `no --brand-* vars in ${docsPath}`);
  for (const name of docs.keys()) {
    assert.ok(dist.has(name), `${name} missing in dist/tokens.css`);
    assert.equal(resolveVars(dist.get(name), dist), resolveVars(docs.get(name), docs), name);
  }
});
