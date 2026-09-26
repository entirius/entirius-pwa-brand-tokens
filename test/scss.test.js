// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.

import assert from 'node:assert/strict';
import { mkdirSync, mkdtempSync, rmSync, symlinkSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { test } from 'node:test';
import { NodePackageImporter, compileString } from 'sass';

const root = fileURLToPath(new URL('..', import.meta.url));

// A consumer's node_modules/@entirius/brand-tokens pointing at this repo: resolution goes through `exports`.
function consumerDir() {
  const dir = mkdtempSync(join(tmpdir(), 'brand-tokens-'));
  mkdirSync(join(dir, 'node_modules', '@entirius'), { recursive: true });
  symlinkSync(root, join(dir, 'node_modules', '@entirius', 'brand-tokens'), 'dir');
  return dir;
}

test('tokens.scss resolves through pkg: and its map yields var() references', (t) => {
  const dir = consumerDir();
  t.after(() => rmSync(dir, { recursive: true, force: true }));
  const source = `
    @use 'sass:map';
    @use 'pkg:@entirius/brand-tokens/tokens.scss' as brand;
    .fill { background: map.get(brand.$brand, 'accent', 'fill'); }
    .black { color: brand.$brand-black; }
  `;
  const { css } = compileString(source, { importers: [new NodePackageImporter(dir)] });
  assert.match(css, /background: var\(--brand-accent-fill\);/);
  assert.match(css, /color: var\(--brand-black\);/);
});
