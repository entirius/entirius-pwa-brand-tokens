// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.

import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

export const readText = (path) => readFileSync(new URL(path, import.meta.url), 'utf8');

export const brandTokens = () => JSON.parse(readText('../tokens/brand.json'));

// Every `--brand-*: value;` declaration of a stylesheet, in order (duplicates kept).
export const cssDeclarations = (css) =>
  [...css.matchAll(/(--brand-[\w-]+)\s*:\s*([^;]+);/g)].map(([, name, value]) => [name, value.trim()]);

// Every leaf of a nested object, dotted key path → value (`colors.basic.100` → `#0A0A0F`).
export const flatten = (node, path = []) =>
  Object.entries(node).flatMap(([key, value]) =>
    typeof value === 'object' ? flatten(value, [...path, key]) : [[[...path, key].join('.'), value]],
  );

// Replaces every var(--brand-*) with its value until none is left.
export function resolveVars(value, vars) {
  const resolved = value.replace(/var\((--brand-[\w-]+)\)/g, (_, name) => {
    assert.ok(vars.has(name), `var(${name}) is not defined`);
    return resolveVars(vars.get(name), vars);
  });
  return resolved.replace(/\s+/g, ' ').toLowerCase();
}
