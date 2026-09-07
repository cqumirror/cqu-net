import 'katex/dist/katex.min.css';
import renderMathInElement from 'katex/contrib/auto-render';

import { pageClassForWidth } from './layout.js';
import { renderGuide } from './renderer.js';
import './styles.css';

const app = document.querySelector('#app');

function updateLayoutClass() {
  document.documentElement.dataset.layout = pageClassForWidth(window.innerWidth);
}

function showError() {
  app.innerHTML = `
    <section class="message" role="alert">
      <h1>文档加载失败</h1>
      <p>请确认根目录中仅保留一个“重大校园网那些事V*.md”文件，然后刷新页面。</p>
    </section>`;
}

async function loadGuide() {
  try {
    const metadataResponse = await fetch('./guide-source.json');
    if (!metadataResponse.ok) throw new Error('Unable to load guide metadata.');

    const { path } = await metadataResponse.json();
    const guideResponse = await fetch(`.${path}`);
    if (!guideResponse.ok) throw new Error('Unable to load guide source.');

    const markdown = await guideResponse.text();
    const html = renderGuide(markdown);
    const title = markdown.match(/^#\s+(.+)$/m)?.[1] ?? '重大校园网那些事';

    document.title = title;
    app.innerHTML = `
      <header class="site-header">
        <img src="./cqu-emblem.jpg" alt="重庆大学校徽" width="46" height="46">
        <span>重庆大学蓝盟</span>
      </header>
      <article class="markdown-body">${html}</article>`;

    renderMathInElement(app, {
      delimiters: [
        { left: '$$', right: '$$', display: true },
        { left: '$', right: '$', display: false },
        { left: '\\(', right: '\\)', display: false },
        { left: '\\[', right: '\\]', display: true },
      ],
      throwOnError: false,
    });
  } catch (error) {
    console.error(error);
    showError();
  }
}

updateLayoutClass();
window.addEventListener('resize', updateLayoutClass, { passive: true });
loadGuide();
