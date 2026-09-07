import 'katex/dist/katex.min.css';
import renderMathInElement from 'katex/contrib/auto-render';

import { pageClassForWidth } from './layout.js';
import { renderGuide } from './renderer.js';
import { renderSiteHeader } from './site-header.js';
import { buildOutline, renderTocHtml } from './toc.js';
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

function renderTocRail(tocHtml) {
  return `
    <nav class="toc-rail" aria-label="目录">
      <span class="toc-label">目录</span>
      ${tocHtml}
    </nav>`;
}

function renderTocDrawer(tocHtml) {
  return `
    <details class="toc-drawer">
      <summary>目录</summary>
      ${tocHtml}
    </details>`;
}

function setupToc(headings) {
  const links = [...app.querySelectorAll('.toc-list a[href^="#"]')];
  const drawer = app.querySelector('.toc-drawer');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  links.forEach((link) => {
    link.addEventListener('click', (event) => {
      const id = link.getAttribute('href').slice(1);
      const target = document.getElementById(id);
      if (!target) return;

      event.preventDefault();
      if (drawer) drawer.open = false;
      requestAnimationFrame(() => {
        target.scrollIntoView({
          behavior: reducedMotion ? 'auto' : 'smooth',
          block: 'start',
        });
      });
    });
  });

  const sections = headings
    .map((heading) => document.getElementById(heading.id))
    .filter(Boolean);
  const linkByHref = new Map(links.map((link) => [link.getAttribute('href'), link]));

  let activeHref = null;
  function setActive(activeId) {
    const next = activeId ? `#${activeId}` : null;
    if (next === activeHref) return;
    links.forEach((link) => link.classList.remove('active'));
    activeHref = next;
    if (next) linkByHref.get(next)?.classList.add('active');
  }

  function updateActiveSection() {
    const probe = window.innerHeight * 0.3;
    let current = null;
    for (const section of sections) {
      if (section.getBoundingClientRect().top <= probe) current = section.id;
    }
    setActive(current);
  }

  updateActiveSection();
  window.addEventListener('scroll', updateActiveSection, { passive: true });
}

async function loadGuide() {
  try {
    const metadataResponse = await fetch('./guide-source.json');
    if (!metadataResponse.ok) throw new Error('Unable to load guide metadata.');

    const { path, pdf } = await metadataResponse.json();
    const guideHref = `.${path}`;
    const guideResponse = await fetch(guideHref);
    if (!guideResponse.ok) throw new Error('Unable to load guide source.');

    const downloads = [{
      href: guideHref,
      filename: path.split('/').pop(),
      label: 'Markdown',
    }];
    if (pdf) {
      downloads.push({ href: `.${pdf}`, filename: pdf.split('/').pop(), label: 'PDF' });
    }

    const markdown = await guideResponse.text();
    const html = renderGuide(markdown);
    const title = markdown.match(/^#\s+(.+)$/m)?.[1] ?? '重大校园网那些事';
    const headings = buildOutline(markdown);

    document.title = title;
    app.innerHTML = `${renderSiteHeader({ downloads })}
      ${renderTocDrawer(renderTocHtml(headings))}
      <article class="markdown-body">${html}</article>
      ${renderTocRail(renderTocHtml(headings))}`;

    setupToc(headings);

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
