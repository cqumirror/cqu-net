import { expect, it } from 'vitest';

import { pageClassForWidth } from '../src/layout.js';

it('uses compact reading layout below 700 pixels', () => {
  expect(pageClassForWidth(699)).toBe('compact');
});
