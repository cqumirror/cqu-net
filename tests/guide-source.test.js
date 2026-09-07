import { describe, expect, it } from 'vitest';

import { findGuideSource } from '../src/guide-source.js';

describe('findGuideSource', () => {
  it('resolves the sole versioned campus-network guide', () => {
    expect(findGuideSource(['README.md', '重大校园网那些事V3.0.5.md'])).toEqual({
      filename: '重大校园网那些事V3.0.5.md',
      publicPath: '/重大校园网那些事V3.0.5.md',
    });
  });

  it('rejects multiple versioned campus-network guides', () => {
    expect(() => findGuideSource([
      '重大校园网那些事V3.0.5.md',
      '重大校园网那些事V3.0.6.md',
    ])).toThrow('Expected exactly one');
  });
});
