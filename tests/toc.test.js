import { describe, expect, it } from 'vitest';

import { buildOutline, renderTocHtml, slugify } from '../src/toc.js';

describe('slugify', () => {
  it('keeps CJK and lowercases ASCII, hyphenating between separators', () => {
    expect(slugify('Mbps 与 MB/s')).toBe('mbps-与-mb-s');
    expect(slugify('名词解释')).toBe('名词解释');
    expect(slugify('4G/5G 手机流量')).toBe('4g-5g-手机流量');
  });

  it('collapses runs of separators and trims the edges', () => {
    expect(slugify('  有线   网络  ')).toBe('有线-网络');
  });

  it('falls back to a placeholder when nothing remains', () => {
    expect(slugify('!!!!')).toBe('section');
  });
});

describe('buildOutline', () => {
  it('lists H2 and H3 headings in document order with anchors', () => {
    const markdown = [
      '# 重大校园网那些事',
      '',
      '## 名词解释',
      '',
      '## 学校套餐介绍',
      '### 单宽带免费',
      '### 运营商套餐简介',
    ].join('\n');

    expect(buildOutline(markdown)).toEqual([
      { level: 2, text: '名词解释', id: '名词解释' },
      { level: 2, text: '学校套餐介绍', id: '学校套餐介绍' },
      { level: 3, text: '单宽带免费', id: '单宽带免费' },
      { level: 3, text: '运营商套餐简介', id: '运营商套餐简介' },
    ]);
  });

  it('skips headings inside fenced code blocks', () => {
    const markdown = [
      '## 正文',
      '',
      '```md',
      '## 这是代码',
      '```',
      '',
      '### 后续',
    ].join('\n');

    expect(buildOutline(markdown).map((h) => h.text)).toEqual(['正文', '后续']);
  });

  it('disambiguates repeated heading text GitHub-style', () => {
    const markdown = ['## 资费', '', '### 资费', '', '## 资费'].join('\n');

    expect(buildOutline(markdown).map((h) => h.id)).toEqual([
      '资费',
      '资费-1',
      '资费-2',
    ]);
  });

  it('strips inline code backticks from the visible text', () => {
    const markdown = ['## 使用 `eduroam` 连接'].join('\n');

    expect(buildOutline(markdown)).toEqual([
      { level: 2, text: '使用 eduroam 连接', id: '使用-eduroam-连接' },
    ]);
  });
});

describe('renderTocHtml', () => {
  it('nests H3 links under their preceding H2 section', () => {
    const headings = [
      { level: 2, text: '名词解释', id: '名词解释' },
      { level: 2, text: '基本网络知识', id: '基本网络知识' },
      { level: 3, text: '校园网与手机流量', id: '校园网与手机流量' },
      { level: 3, text: 'Eduroam', id: 'eduroam' },
      { level: 2, text: 'FAQ', id: 'faq' },
    ];

    expect(renderTocHtml(headings)).toContain('<a href="#名词解释">名词解释</a>');
    expect(renderTocHtml(headings)).toContain('<a href="#eduroam">Eduroam</a>');
  });
});
