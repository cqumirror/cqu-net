import { expect, it } from 'vitest';

import { applyTheme, chooseTheme, nextTheme, normalizeThemeMode } from '../src/theme.js';

it('uses the system preference when the mode is system', () => {
  expect(chooseTheme('dark', false)).toBe('dark');
  expect(chooseTheme('system', true)).toBe('dark');
  expect(chooseTheme('system', false)).toBe('light');
  expect(normalizeThemeMode(null)).toBe('system');
});

it('toggles between light and dark themes', () => {
  expect(nextTheme('light')).toBe('dark');
  expect(nextTheme('dark')).toBe('light');
});

it('applies the selected theme to the document root', () => {
  const root = { dataset: {}, style: {} };

  applyTheme('dark', root);

  expect(root.dataset.theme).toBe('dark');
  expect(root.style.colorScheme).toBe('dark');
});
