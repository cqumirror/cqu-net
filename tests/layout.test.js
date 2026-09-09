import { expect, it } from 'vitest';

import { pageClassForWidth } from '../src/layout.js';

it('uses compact reading layout below 768 pixels', () => {
  expect(pageClassForWidth(767)).toBe('compact');
  expect(pageClassForWidth(768)).toBe('comfortable');
});
