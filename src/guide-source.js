import { createHash } from 'node:crypto';

export const GUIDE_DIRECTORY = 'guide';

const guidePattern = /^重大校园网那些事V.+\.md$/;

function publicPathFor(filename) {
  return `/${GUIDE_DIRECTORY}/${filename}`;
}

function versionFor(filename) {
  return filename.slice('重大校园网那些事V'.length, -'.md'.length);
}

function compareVersionsDescending(left, right) {
  const leftParts = left.version.split('.').map(Number);
  const rightParts = right.version.split('.').map(Number);
  const length = Math.max(leftParts.length, rightParts.length);

  for (let index = 0; index < length; index += 1) {
    const difference = (rightParts[index] ?? 0) - (leftParts[index] ?? 0);
    if (difference !== 0) return difference;
  }

  return right.filename.localeCompare(left.filename, 'zh-CN');
}

export function findGuideSources(filenames) {
  const matches = filenames
    .filter((filename) => guidePattern.test(filename))
    .map((filename) => ({
      filename,
      publicPath: publicPathFor(filename),
      version: versionFor(filename),
    }));

  if (matches.length === 0) {
    throw new Error('No 重大校园网那些事V*.md guide was found in the guide directory.');
  }

  return matches.sort(compareVersionsDescending);
}

export function findGuideSource(filenames) {
  const { filename, publicPath } = findGuideSources(filenames)[0];
  return { filename, publicPath };
}

export function findGuidePdf(filenames, stem) {
  const filename = `${stem}.pdf`;
  if (!filenames.includes(filename)) return null;
  return { filename, publicPath: publicPathFor(filename) };
}

export function sha256For(content) {
  return createHash('sha256').update(content).digest('hex');
}
