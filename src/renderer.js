import { marked } from 'marked';

import { buildOutline } from './toc.js';

const renderer = new marked.Renderer();
renderer.html = () => '';

let pendingHeadings = [];

function idForHeading(depth) {
  const next = pendingHeadings[0];
  if (next && next.level === depth) {
    pendingHeadings.shift();
    return ` id="${next.id}"`;
  }
  return '';
}

renderer.heading = function heading({ tokens, depth }) {
  const body = this.parser.parseInline(tokens);
  return `<h${depth}${idForHeading(depth)}>${body}</h${depth}>`;
};

marked.setOptions({
  gfm: true,
  renderer,
});

export function renderGuide(markdown) {
  pendingHeadings = buildOutline(markdown);
  return marked.parse(markdown);
}
