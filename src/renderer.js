import { marked } from 'marked';

const renderer = new marked.Renderer();
renderer.html = () => '';

marked.setOptions({
  gfm: true,
  renderer,
});

export function renderGuide(markdown) {
  return marked.parse(markdown);
}
