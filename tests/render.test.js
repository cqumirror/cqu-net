import { expect, it } from 'vitest';

import { renderGuide } from '../src/renderer.js';

it('renders a Markdown heading and table', () => {
  const html = renderGuide('# 网络指南\n\n| 套餐 | 带宽 |\n| --- | --- |\n| 免费 | 200 Mbps |');

  expect(html).toContain('<h1>网络指南</h1>');
  expect(html).toContain('<table>');
});

it('adds anchor ids to H2/H3 headings', () => {
  const html = renderGuide('# 标题\n\n## 名词解释\n\n### Mbps 与 MB/s');

  expect(html).toContain('<h2 id="名词解释">名词解释</h2>');
  expect(html).toContain('<h3 id="mbps-与-mb-s">Mbps 与 MB/s</h3>');
});
