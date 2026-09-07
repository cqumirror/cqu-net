export function renderSiteHeader({ downloads = [] } = {}) {
  const buttons = downloads
    .map(({ href, filename, label }) => `
      <a class="download-button" href="${href}" download="${filename}">${label}</a>`)
    .join('');

  return `
    <header class="site-header">
      <img src="./logo.svg" alt="重庆大学蓝盟标志" width="46" height="46">
      <span class="site-title">重庆大学蓝盟</span>
      ${buttons ? `<div class="site-actions">
        <span class="download-hint">离线版本下载</span>${buttons}
      </div>` : ''}
    </header>`;
}
