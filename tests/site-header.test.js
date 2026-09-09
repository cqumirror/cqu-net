import { expect, it } from 'vitest';

import { renderSiteHeader } from '../src/site-header.js';

it('uses the Lanunion logo in the page masthead', () => {
  const html = renderSiteHeader();
  expect(html).toContain('src="./logo.svg"');
  expect(html).not.toContain('class="theme-toggle"');
  expect(html).not.toContain('<select');
  expect(html).toContain('class="theme-menu"');
  expect(html).toContain('<summary>主题：跟随系统</summary>');
  expect(html).toContain('data-theme-mode="dark"');
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

  expect(html).toContain('class="download-label">离线文件');
  expect(html).toContain(`download="${stem}.md"`);
  expect(html).toContain(`href="./guide/${stem}.pdf"`);
  expect(html).toContain('>Markdown</a>');
  expect(html).toContain('>PDF</a>');
  expect(html).toContain('class="download-pair"');
  expect(html).toContain('class="download-menu"');
  expect(html).toContain('<summary>离线版本下载</summary>');
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

it('renders a copyable checksum for each offline file', () => {
  const checksum = '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef';
  const html = renderSiteHeader({
    downloads: [{
      href: './guide/重大校园网那些事V3.1.0.md',
      filename: '重大校园网那些事V3.1.0.md',
      label: 'Markdown',
      sha256: checksum,
    }],
  });

  expect(html).toContain('SHA-256');
  expect(html).toContain(`data-checksum="${checksum}"`);
  expect(html).toContain('01234567…89abcdef');
  expect(html).toContain('class="download-pair"');
  expect(html).toContain('class="checksum-label">SHA-256 校验');
});
