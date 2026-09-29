// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.

import assert from 'node:assert/strict';
import { test } from 'node:test';
import preset from '../dist/tailwind-preset.js';
import { cssDeclarations, readText } from './helpers.js';

// Every var of dist/tokens.css before the calmer light steps, name → value; consumers depend on these.
const SNAPSHOT = JSON.parse(readText('./fixtures/tokens-baseline.json'));

const NEUTRAL_STEPS = ['50', '100', '150', '200', '300', '400', '600', '700', '800', '900'];
const TINT_ROLES = ['primary', 'positive', 'negative', 'informative', 'notice'];

const emitted = () => new Map(cssDeclarations(readText('../dist/tokens.css')));

test('every baseline var keeps its name and value', () => {
  const vars = emitted();
  for (const [name, value] of Object.entries(SNAPSHOT)) assert.equal(vars.get(name), value, name);
});

test('the calmer light steps are emitted as CSS vars', () => {
  const vars = emitted();
  const names = [
    ...NEUTRAL_STEPS.map((step) => `--brand-light-neutral-${step}`),
    ...TINT_ROLES.map((role) => `--brand-light-tint-${role}`),
  ];
  for (const name of names) assert.match(vars.get(name) ?? '', /^#[0-9A-F]{6}$/, name);
});

test('the calmer light steps reach SCSS and the Tailwind preset', () => {
  const scss = readText('../dist/_tokens.scss');
  const { neutral, tint } = preset.theme.extend.colors.light;
  assert.deepEqual(Object.keys(neutral).sort(), [...NEUTRAL_STEPS].sort());
  assert.deepEqual(Object.keys(tint).sort(), [...TINT_ROLES].sort());
  for (const step of NEUTRAL_STEPS) assert.match(scss, new RegExp(`\\$brand-light-neutral-${step}:`));
  for (const role of TINT_ROLES) assert.match(scss, new RegExp(`\\$brand-light-tint-${role}:`));
});
