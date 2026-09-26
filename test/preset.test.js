// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.

import assert from 'node:assert/strict';
import { test } from 'node:test';
import preset from '../dist/tailwind-preset.js';

const { extend } = preset.theme;

// backgroundImage keys of entirius-react-www tailwind.config.ts (2026-09-26).
const WWW_GRADIENTS = [
  'gradient-accent',
  'gradient-accent-hover',
  'gradient-card',
  'gradient-card-dim',
  'gradient-icon',
  'gradient-icon-hover',
  'gradient-backdrop',
  'gradient-backdrop-mobile',
  'gradient-fade',
];

const COLOR_GROUPS = [
  'black',
  'white',
  'basic',
  'primary',
  'secondary',
  'tertiary',
  'positive',
  'negative',
  'informative',
  'notice',
  'additional',
  'accent',
  'on-accent-fill',
  'hairline',
  'glass',
  'light',
];

test('accent colours match www', () => {
  assert.equal(extend.colors.accent.DEFAULT, '#00ACC1');
  assert.equal(extend.colors.accent.fill, '#0E7C86');
});

test('every brand colour group is present, gradient stops are not', () => {
  assert.deepEqual(Object.keys(extend.colors).sort(), [...COLOR_GROUPS].sort());
});

test('radius scale maps base to DEFAULT', () => {
  // 32px = www's 2rem at the default root size; token values are never rewritten.
  assert.deepEqual(extend.borderRadius, {
    DEFAULT: '4px',
    lg: '8px',
    xl: '12px',
    '2xl': '16px',
    '3xl': '24px',
    '4xl': '32px',
    full: '9999px',
  });
});

test('every www gradient key is present with resolved stops', () => {
  assert.deepEqual(Object.keys(extend.backgroundImage).sort(), [...WWW_GRADIENTS].sort());
  assert.equal(extend.backgroundImage['gradient-accent'], 'linear-gradient(180deg, #00C2D7 0%, #55636D 100%)');
});

test('font families and shadows are present, spacing is not', () => {
  assert.deepEqual(Object.keys(extend.fontFamily), ['brand', 'ui', 'mono']);
  assert.deepEqual(Object.keys(extend.boxShadow), ['sm', 'md', 'lg', 'down', 'glow']);
  assert.equal(extend.spacing, undefined);
});
