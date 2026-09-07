export const GUIDE_DIRECTORY = 'guide';

const guidePattern = /^重大校园网那些事V.+\.md$/;

function publicPathFor(filename) {
  return `/${GUIDE_DIRECTORY}/${filename}`;
}

export function findGuideSource(filenames) {
  const matches = filenames.filter((filename) => guidePattern.test(filename));

  if (matches.length === 0) {
    throw new Error('No 重大校园网那些事V*.md guide was found in the guide directory.');
  }

  if (matches.length > 1) {
    throw new Error('Expected exactly one 重大校园网那些事V*.md guide in the guide directory.');
  }

  const filename = matches[0];
  return { filename, publicPath: publicPathFor(filename) };
}

export function findGuidePdf(filenames, stem) {
  const filename = `${stem}.pdf`;
  if (!filenames.includes(filename)) return null;
  return { filename, publicPath: publicPathFor(filename) };
}
