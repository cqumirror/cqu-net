export function renderSiteHeader({ downloads = [], versions = [], selectedVersion } = {}) {
  const buttons = downloads
    .map(({ href, filename, label }) => `
      <a class="download-button" href="${href}" download="${filename}">${label}</a>`)
    .join('');
  const versionSelector = versions.length > 1
    ? `<label class="version-control">版本
        <select class="version-selector" aria-label="选择文档版本">
          ${versions.map(({ version }) => `<option value="${version}"${version === selectedVersion ? ' selected' : ''}>V${version}</option>`).join('')}
        </select>
      </label>`
    : '';

  return `
    <header class="site-header">
      <img src="./logo.svg" alt="重庆大学蓝盟标志" width="46" height="46">
      <span class="site-title">重庆大学蓝盟</span>
      ${versionSelector}
      ${buttons ? `<div class="site-actions">
        <span class="download-hint">离线版本下载</span>${buttons}
      </div>` : ''}
    </header>`;
}
