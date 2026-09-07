const guidePattern = /^重大校园网那些事V.+\.md$/;

export function findGuideSource(filenames) {
  const matches = filenames.filter((filename) => guidePattern.test(filename));

  if (matches.length === 0) {
    throw new Error('No 重大校园网那些事V*.md guide was found in the repository root.');
  }

  if (matches.length > 1) {
    throw new Error('Expected exactly one 重大校园网那些事V*.md guide in the repository root.');
  }

  const filename = matches[0];
  return { filename, publicPath: `/${filename}` };
}
