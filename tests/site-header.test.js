import { expect, it } from 'vitest';

import { renderSiteHeader } from '../src/site-header.js';

it('uses the Lanunion logo in the page masthead', () => {
  expect(renderSiteHeader()).toContain('src="./logo.svg"');
});

it('omits download buttons when no downloads are given', () => {
  expect(renderSiteHeader()).not.toContain('download=');
});

it('renders a download button per provided file with an offline hint', () => {
  const stem = '重大校园网那些事V占位';
  const html = renderSiteHeader({
    downloads: [
      { href: `./guide/${stem}.md`, filename: `${stem}.md`, label: 'Markdown' },
      { href: `./guide/${stem}.pdf`, filename: `${stem}.pdf`, label: 'PDF' },
    ],
  });

  expect(html).toContain('离线版本下载');
  expect(html).toContain(`download="${stem}.md"`);
  expect(html).toContain(`href="./guide/${stem}.pdf"`);
  expect(html).toContain('>Markdown</a>');
  expect(html).toContain('>PDF</a>');
});

it('renders a version selector with the newest guide selected', () => {
  const html = renderSiteHeader({
    versions: [
      { version: '3.1.0', path: '/guide/重大校园网那些事V3.1.0.md' },
      { version: '3.0.5', path: '/guide/重大校园网那些事V3.0.5.md' },
    ],
    selectedVersion: '3.1.0',
  });

  expect(html).toContain('<select class="version-selector"');
  expect(html).toContain('value="3.1.0" selected');
  expect(html).toContain('V3.0.5');
});
