import { describe, expect, it } from 'vitest';

import { findGuidePdf, findGuideSource, findGuideSources } from '../src/guide-source.js';

// 占位版本名：检测逻辑不关心版本号具体是多少，只关心存在唯一一个 V* 文档。
const stem = '重大校园网那些事V占位';

describe('findGuideSource', () => {
  it('resolves the sole versioned campus-network guide under /guide/', () => {
    expect(findGuideSource(['README.md', `${stem}.md`])).toEqual({
      filename: `${stem}.md`,
      publicPath: `/guide/${stem}.md`,
    });
  });

  it('lists multiple guides newest version first', () => {
    expect(findGuideSources([
      '重大校园网那些事V3.0.5.md',
      '重大校园网那些事V3.1.0.md',
    ])).toEqual([
      {
        filename: '重大校园网那些事V3.1.0.md',
        publicPath: '/guide/重大校园网那些事V3.1.0.md',
        version: '3.1.0',
      },
      {
        filename: '重大校园网那些事V3.0.5.md',
        publicPath: '/guide/重大校园网那些事V3.0.5.md',
        version: '3.0.5',
      },
    ]);
  });
});

describe('findGuidePdf', () => {
  it('resolves the matching PDF when present', () => {
    expect(findGuidePdf([`${stem}.md`, `${stem}.pdf`], stem)).toEqual({
      filename: `${stem}.pdf`,
      publicPath: `/guide/${stem}.pdf`,
    });
  });

  it('returns null when no PDF matches the stem', () => {
    expect(findGuidePdf([`${stem}.md`], stem)).toBeNull();
  });
});
