import { expect, it } from 'vitest';

import { renderSiteFooter } from '../src/site-footer.js';

it('renders the copyright notice without an "All Rights Reserved" claim', () => {
  const html = renderSiteFooter();

  expect(html).toContain('© 2026 重庆大学蓝盟  Lanunion');
  expect(html).not.toContain('All Rights Reserved');
});

it('renders CC BY-NC-SA 4.0 distribution terms linking to the license deed', () => {
  const html = renderSiteFooter();

  expect(html).toContain('CC BY-NC-SA 4.0');
  expect(html).toContain('许可协议');
  expect(html).toContain('creativecommons.org/licenses/by-nc-sa/4.0');
  expect(html).toMatch(/rel="license\b/);
});

it('provides feedback and contact links', () => {
  const html = renderSiteFooter();

  expect(html).toContain('反馈与纠错');
  expect(html).toContain('https://github.com/cqumirror/cqu-net/issues');
  expect(html).toContain('mailto:piblic@lanunion.org.cn');
  expect(html).toContain('piblic@lanunion.org.cn');
});
