export const THEME_STORAGE_KEY = 'cqu-net-theme';

export function normalizeThemeMode(savedTheme) {
  return ['system', 'light', 'dark'].includes(savedTheme) ? savedTheme : 'system';
}

export function chooseTheme(themeMode, systemPrefersDark) {
  if (themeMode === 'light' || themeMode === 'dark') return themeMode;
  return systemPrefersDark ? 'dark' : 'light';
}

export function nextTheme(theme) {
  return theme === 'dark' ? 'light' : 'dark';
}

export function applyTheme(theme, root = document.documentElement) {
  root.dataset.theme = theme;
  root.style.colorScheme = theme;
}
