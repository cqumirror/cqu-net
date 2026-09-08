export function renderSiteHeader({ downloads = [], versions = [], selectedVersion } = {}) {
  const downloadPairs = downloads
    .map(({ href, filename, label, sha256 }) => {
      const compactChecksum = sha256 && `${sha256.slice(0, 8)}…${sha256.slice(-8)}`;
      return `
      <div class="download-pair">
        <a class="download-button" href="${href}" download="${filename}">${label}</a>
        ${sha256 ? `<button class="checksum-button" type="button" data-checksum="${sha256}" aria-label="复制 ${filename} 的 SHA-256 校验值">
          <span class="checksum-label">SHA-256 校验</span><code title="${sha256}">${compactChecksum}</code>
        </button>` : ''}
      </div>`;
    })
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
      <div class="site-brand">
        <img src="./logo.svg" alt="重庆大学蓝盟标志" width="46" height="46">
        <span class="site-title">重庆大学蓝盟</span>
        ${versionSelector}
      </div>
      ${downloadPairs ? `<div class="site-actions">
        <span class="download-label">离线文件</span>
        <div class="download-row">${downloadPairs}</div>
      </div>` : ''}
    </header>`;
}
