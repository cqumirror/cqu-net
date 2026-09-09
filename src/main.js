import 'katex/dist/katex.min.css';
import renderMathInElement from 'katex/contrib/auto-render';

import { pageClassForWidth } from './layout.js';
import { renderGuide } from './renderer.js';
import { renderSiteFooter } from './site-footer.js';
import { renderSiteHeader } from './site-header.js';
import { applyTheme, chooseTheme, normalizeThemeMode, THEME_STORAGE_KEY } from './theme.js';
import { buildOutline, renderTocHtml } from './toc.js';
import './styles.css';

const app = document.querySelector('#app');
const systemThemeQuery = window.matchMedia('(prefers-color-scheme: dark)');
let themeMode = normalizeThemeMode(window.localStorage.getItem(THEME_STORAGE_KEY));
let currentTheme = chooseTheme(
  themeMode,
  systemThemeQuery.matches,
);
applyTheme(currentTheme);

function updateLayoutClass() {
  document.documentElement.dataset.layout = pageClassForWidth(window.innerWidth);
}

function showError() {
  app.innerHTML = `
    <section class="message" role="alert">
      <h1>文档加载失败</h1>
      <p>请确认“public/guide”目录中至少包含一个“重大校园网那些事V*.md”文件，然后刷新页面。</p>
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

function setupVersionSelector() {
  const selector = app.querySelector('.version-selector');
  if (!selector) return;

  selector.addEventListener('change', () => {
    const url = new URL(window.location.href);
    url.searchParams.set('version', selector.value);
    window.location.assign(url);
  });
}

function setupChecksumButtons() {
  app.querySelectorAll('.checksum-button').forEach((button) => {
    button.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(button.dataset.checksum);
        button.dataset.copied = 'true';
        window.setTimeout(() => { delete button.dataset.copied; }, 1600);
      } catch (error) {
        console.error(error);
      }
    });
  });
}

function setupThemeMenu() {
  const menu = app.querySelector('.theme-menu');
  if (!menu) return;

  function updateTheme(nextMode) {
    themeMode = normalizeThemeMode(nextMode);
    currentTheme = chooseTheme(themeMode, systemThemeQuery.matches);
    applyTheme(currentTheme);
    window.localStorage.setItem(THEME_STORAGE_KEY, themeMode);
    menu.querySelector('summary').textContent = `主题：${{ system: '跟随系统', light: '明亮', dark: '暗夜' }[themeMode]}`;
    menu.querySelectorAll('.theme-menu-option').forEach((button) => {
      button.setAttribute('aria-pressed', String(button.dataset.themeMode === themeMode));
    });
  }

  menu.querySelectorAll('.theme-menu-option').forEach((button) => {
    button.addEventListener('click', () => {
      updateTheme(button.dataset.themeMode);
      menu.open = false;
    });
  });
  document.addEventListener('click', (event) => {
    if (menu.open && !menu.contains(event.target)) menu.open = false;
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') menu.open = false;
  });
}

function setupDownloadMenu() {
  const menu = app.querySelector('.download-menu');
  if (!menu) return;

  document.addEventListener('click', (event) => {
    if (menu.open && !menu.contains(event.target)) menu.open = false;
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') menu.open = false;
  });
}

async function loadGuide() {
  try {
    const metadataResponse = await fetch('./guide-source.json');
    if (!metadataResponse.ok) throw new Error('Unable to load guide metadata.');

    const { path, pdf, guides = [] } = await metadataResponse.json();
    const requestedVersion = new URLSearchParams(window.location.search).get('version');
    const guide = guides.find(({ version }) => version === requestedVersion)
      ?? guides[0]
      ?? { path, pdf, version: undefined };
    const guideHref = `.${guide.path}`;
    const guideResponse = await fetch(guideHref);
    if (!guideResponse.ok) throw new Error('Unable to load guide source.');

    const downloads = [{
      href: guideHref,
      filename: guide.path.split('/').pop(),
      label: 'Markdown',
      sha256: guide.sha256,
    }];
    if (guide.pdf) {
      downloads.push({
        href: `.${guide.pdf}`,
        filename: guide.pdf.split('/').pop(),
        label: 'PDF',
        sha256: guide.pdfSha256,
      });
    }

    const markdown = await guideResponse.text();
    const html = renderGuide(markdown);
    const title = markdown.match(/^#\s+(.+)$/m)?.[1] ?? '重大校园网那些事';
    const headings = buildOutline(markdown);

    document.title = title;
    app.innerHTML = `${renderSiteHeader({ downloads, versions: guides, selectedVersion: guide.version, theme: currentTheme, themeMode })}
      ${renderTocDrawer(renderTocHtml(headings))}
      <article class="markdown-body">${html}</article>
      ${renderSiteFooter()}
      ${renderTocRail(renderTocHtml(headings))}`;

    setupToc(headings);
    setupVersionSelector();
    setupChecksumButtons();
    setupThemeMenu();
    setupDownloadMenu();

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
systemThemeQuery.addEventListener('change', (event) => {
  if (themeMode !== 'system') return;
  currentTheme = chooseTheme('system', event.matches);
  applyTheme(currentTheme);
});
loadGuide();
