import { expect, it } from 'vitest';

import { renderGuide } from '../src/renderer.js';

it('renders a Markdown heading and table', () => {
  const html = renderGuide('# 网络指南\n\n| 套餐 | 带宽 |\n| --- | --- |\n| 免费 | 200 Mbps |');

  expect(html).toContain('<h1>网络指南</h1>');
  expect(html).toContain('<table>');
});
