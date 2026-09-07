const fencePattern = /^\s{0,3}(```|~~~)/;
const headingPattern = /^\s{0,3}(#{2,3})\s+(.*)$/;

export function slugify(text) {
  const slug = text
    .toLowerCase()
    .replace(/[^\p{Letter}\p{Number}]+/gu, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
  return slug || 'section';
}

function visibleText(raw) {
  return raw
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/`([^`]*)`/g, '$1')
    .replace(/[*_~]+/g, '')
    .trim();
}

function escapeHtml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

export function buildOutline(markdown) {
  const headings = [];
  const counts = new Map();
  let inFence = false;

  for (const line of markdown.split('\n')) {
    if (fencePattern.test(line)) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;

    const match = headingPattern.exec(line);
    if (!match) continue;

    const text = visibleText(match[2]);
    if (!text) continue;

    const base = slugify(text);
    const seen = counts.get(base) ?? 0;
    counts.set(base, seen + 1);
    headings.push({
      level: match[1].length,
      text,
      id: seen === 0 ? base : `${base}-${seen}`,
    });
  }

  return headings;
}

export function renderTocHtml(headings) {
  let html = '<ol class="toc-list">';
  let subOpen = false;

  const closeSub = () => {
    if (subOpen) {
      html += '</ol>';
      subOpen = false;
    }
    html += '</li>';
  };

  for (const heading of headings) {
    const link = `<a href="#${heading.id}">${escapeHtml(heading.text)}</a>`;

    if (heading.level === 2) {
      if (html !== '<ol class="toc-list">') closeSub();
      html += `<li>${link}`;
    } else {
      if (!subOpen) {
        html += '<ol>';
        subOpen = true;
      }
      html += `<li>${link}</li>`;
    }
  }

  if (html !== '<ol class="toc-list">') closeSub();
  html += '</ol>';
  return html;
}
